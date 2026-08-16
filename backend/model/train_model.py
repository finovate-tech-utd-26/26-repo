import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from pathlib import Path

class FeatureTokenizer(nn.Module):

    def __init__(self, num_features, embed_dim):
        super().__init__()
        self.weights = nn.Parameter(torch.randn(num_features, embed_dim))
        self.biases = nn.Parameter(torch.randn(num_features, embed_dim))

    def forward(self, x):
        return x.unsqueeze(-1) * self.weights + self.biases
class TabularTransformer(nn.Module):

    def __init__(
        self,
        num_features,
        embed_dim=32,
        nhead=4,
        num_layers=2,
        num_classes=4,
    ):
        super().__init__()
        self.tokenizer = FeatureTokenizer(num_features, embed_dim)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embed_dim,
            nhead=nhead,
            dim_feedforward=128,
            batch_first=True,
        )
        self.transformer = nn.TransformerEncoder(
            encoder_layer, num_layers=num_layers
        )

        self.cls_head = nn.Linear(num_features * embed_dim, num_classes)
        self.reg_head = nn.Sequential(
            nn.Linear(num_features * embed_dim, 1),
            nn.Softplus(),
        )

    def forward(self, x):
        tokens = self.tokenizer(x)
        transformed = self.transformer(tokens)
        flattened = transformed.reshape(transformed.size(0), -1)

        action_logits = self.cls_head(flattened)
        projected_cpm = self.reg_head(flattened)

        return action_logits, projected_cpm

class AdSenseDataset(Dataset):

    def __init__(self, df, feature_cols=None, feature_means=None, feature_stds=None):
        self.feature_cols = feature_cols or [
            "ctr",
            "fill_rate",
            "gross_cpm",
            "net_cpm",
            "pageviews",
            "sessions",
            "unfilled_impressions",
            "viewable_percent",
            "viewable_time",
        ]

        feature_values = df[self.feature_cols].to_numpy(dtype=np.float32)

        if feature_means is None:
            feature_means = feature_values.mean(axis=0, dtype=np.float32)
        if feature_stds is None:
            feature_stds = feature_values.std(axis=0, dtype=np.float32)
        feature_stds = np.where(feature_stds == 0, 1.0, feature_stds)

        self.X = torch.tensor(
            (feature_values - feature_means) / feature_stds,
            dtype=torch.float32,
        )
        self.y_action = torch.tensor(
            df["target_action"].values, dtype=torch.long
        )
        self.y_cpm = torch.tensor(
            df["target_projected_cpm"].values, dtype=torch.float32
        ).unsqueeze(1)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return self.X[idx], self.y_action[idx], self.y_cpm[idx]


def evaluate_accuracy(model, dataloader):
    model.eval()
    correct = 0
    total = 0
    total_loss = 0.0
    criterion_cls = nn.CrossEntropyLoss()
    criterion_reg = nn.MSELoss()

    with torch.no_grad():
        for X_batch, y_act, y_cpm in dataloader:
            pred_act, pred_cpm = model(X_batch)
            loss_cls = criterion_cls(pred_act, y_act)
            loss_reg = criterion_reg(pred_cpm, y_cpm)
            total_loss += (loss_cls + loss_reg).item()

            predictions = pred_act.argmax(dim=1)
            correct += (predictions == y_act).sum().item()
            total += y_act.size(0)

    accuracy = correct / total if total else 0.0
    return accuracy, total_loss / len(dataloader) if len(dataloader) else 0.0


def train():
    DATA_PATH = Path(__file__).parent / "adsense_transformer_data.csv"
    df = pd.read_csv(DATA_PATH)
    feature_cols = [
        "ctr",
        "fill_rate",
        "gross_cpm",
        "net_cpm",
        "pageviews",
        "sessions",
        "unfilled_impressions",
        "viewable_percent",
        "viewable_time",
    ]

    train_df = df.sample(frac=0.8, random_state=42)
    val_df = df.drop(train_df.index)

    train_feature_values = train_df[feature_cols].to_numpy(dtype=np.float32)
    train_feature_means = train_feature_values.mean(axis=0, dtype=np.float32)
    train_feature_stds = train_feature_values.std(axis=0, dtype=np.float32)
    train_feature_stds = np.where(train_feature_stds == 0, 1.0, train_feature_stds)

    train_dataset = AdSenseDataset(
        train_df,
        feature_cols=feature_cols,
        feature_means=train_feature_means,
        feature_stds=train_feature_stds,
    )
    val_dataset = AdSenseDataset(
        val_df,
        feature_cols=feature_cols,
        feature_means=train_feature_means,
        feature_stds=train_feature_stds,
    )

    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

    model = TabularTransformer(num_features=9)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)

    criterion_cls = nn.CrossEntropyLoss()
    criterion_reg = nn.MSELoss()

    print("Beginning Transformer Training Loop...\n")
    for epoch in range(1, 11):
        model.train()
        total_loss = 0.0
        for X_batch, y_act, y_cpm in train_loader:
            optimizer.zero_grad()

            pred_act, pred_cpm = model(X_batch)

            loss_cls = criterion_cls(pred_act, y_act)
            loss_reg = criterion_reg(pred_cpm, y_cpm)
            loss = loss_cls + loss_reg

            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        train_loss = total_loss / len(train_loader)
        val_accuracy, val_loss = evaluate_accuracy(model, val_loader)

        print(
            f"Epoch {epoch:02d}/10 | Train Loss: {train_loss:.4f} | "
            f"Val Loss: {val_loss:.4f} | Val Accuracy: {val_accuracy:.4f} ({val_accuracy * 100:.2f}%)"
        )

    model_path = Path(__file__).resolve().with_name("adsense_transformer.pt")
    torch.save(model.state_dict(), model_path)
    print(f"\nModel saved to {model_path}")


if __name__ == "__main__":
    train()