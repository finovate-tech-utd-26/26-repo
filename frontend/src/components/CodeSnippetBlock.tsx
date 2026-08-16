import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeSnippetBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative rounded-lg border border-ink-700 bg-ink-950 p-4">
      <pre className="overflow-x-auto pr-8 text-xs text-signal-300">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md p-1.5 text-ink-400 hover:bg-ink-800 hover:text-ink-100"
      >
        {copied ? <Check size={14} className="text-good-500" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
