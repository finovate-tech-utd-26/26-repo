import json
import os
from pathlib import Path
from flask import Flask, jsonify, request
import numpy as np

from openai import OpenAI
import pandas as pd
import torch
from train_model import TabularTransformer
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


MODEL_PATH = Path(__file__).resolve().parent / "adsense_transformer.pt"
DATA_PATH = Path(__file__).resolve().parent / "adsense_transformer_data.csv"

FEATURE_COLS = [
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

df = pd.read_csv(DATA_PATH)
FEATURE_MEANS = df[FEATURE_COLS].mean().to_numpy(dtype=np.float32)
FEATURE_STDS = df[FEATURE_COLS].std().to_numpy(dtype=np.float32)
FEATURE_STDS = np.where(FEATURE_STDS == 0, 1.0, FEATURE_STDS)

ACTION_NAMES = {
    0: "reposition_sticky",
    1: "enable_auto_refresh",
    2: "lower_price_floor",
    3: "keep_optimal",
}


def call_llm_for_ui_placement(action_name, metrics, dom_context=None):
    system_prompt = (
        "You are an ad monetization and web UI integration expert. "
        "Your task is to provide JSON-formatted recommendations instructing web developers "
        "where and how to modify their app interface based on an optimization recommendation."
    )

    user_prompt = f"""
    Ad Monetization Action Recommended: {action_name}
    Current Metrics:
    - Viewable Percent: {metrics.get('viewable_percent') * 100}%
    - Viewable Time: {metrics.get('viewable_time')}s
    - Fill Rate: {metrics.get('fill_rate') * 100}%
    - Net CPM: ${metrics.get('net_cpm')}
    
    User DOM/App Structure Provided: {dom_context or "Standard B2B SaaS Dashboard layout with sidebar navigation, main analytics feed, and header banner."}

    Return a valid JSON object matching this schema strictly:
    {{
      "target_component": "String describing the target UI region",
      "css_selector": "Dynamic CSS selector (e.g. #main-sidebar-ad-slot)",
      "rationale": "Clear 1-2 sentence explanation tailored to these metrics",
      "implementation_step": "Actionable instructions for the developer"
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {
            "target_component": "Dynamic Component",
            "css_selector": ".ad-container-slot",
            "rationale": f"Action '{action_name}' suggested based on low viewability or fill rate metrics.",
            "implementation_step": "Adjust layout configuration in your frontend code.",
            "error_note": str(e),
        }


def run_inference(sample_metrics, dom_context=None, confidence_threshold=0.15):
    raw_vector = np.array(
        [[sample_metrics[col] for col in FEATURE_COLS]], dtype=np.float32
    )
    norm_vector = (raw_vector - FEATURE_MEANS) / FEATURE_STDS
    X_input = torch.tensor(norm_vector, dtype=torch.float32)

    model = TabularTransformer(num_features=9)
    model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
    model.eval()

    with torch.no_grad():
        action_logits, projected_cpm = model(X_input)
        probabilities = torch.softmax(action_logits, dim=1).squeeze(0)

    recommendations = []
    sorted_class_indices = torch.argsort(probabilities, descending=True)

    for class_id in sorted_class_indices.tolist():
        prob = probabilities[class_id].item()
        if prob >= confidence_threshold:
            action_name = ACTION_NAMES[class_id]

            dynamic_metadata = call_llm_for_ui_placement(
                action_name, sample_metrics, dom_context
            )

            recommendations.append(
                {
                    "action": action_name,
                    "confidence_score": round(prob, 4),
                    "target_component": dynamic_metadata.get(
                        "target_component"
                    ),
                    "css_selector": dynamic_metadata.get("css_selector"),
                    "rationale": dynamic_metadata.get("rationale"),
                    "implementation_step": dynamic_metadata.get(
                        "implementation_step"
                    ),
                }
            )

    return {
        "projected_net_cpm": max(0.0, round(projected_cpm.item(), 2)),
        "recommendations_count": len(recommendations),
        "recommendations": recommendations,
    }




@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": MODEL_PATH.exists()})


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data or "metrics" not in data:
            return jsonify(
                {"error": "Missing 'metrics' key in request payload"}
            ), 400

        metrics = data["metrics"]
        dom_context = data.get("dom_context", None)

        missing_cols = [col for col in FEATURE_COLS if col not in metrics]
        if missing_cols:
            return jsonify(
                {"error": f"Missing feature columns: {missing_cols}"}
            ), 400

        result = run_inference(metrics, dom_context=dom_context)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)