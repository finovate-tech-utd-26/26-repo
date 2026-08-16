import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import { Button } from "./Button";

export function Footer() {
  return (
    <footer className="border-t border-ink-800">
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-medium text-ink-50">Ready to try Proicio?</h2>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/publisher/onboarding">
            <Button size="md">Sign up as a publisher</Button>
          </Link>
          <Link to="/advertiser/onboarding">
            <Button size="md" variant="amber">
              Sign up as an advertiser
            </Button>
          </Link>
        </div>
        <Link
          to="/marketplace"
          className="mt-6 inline-block text-sm text-ink-400 hover:text-ink-100"
        >
          See the engine running live →
        </Link>
      </div>
      <div className="border-t border-ink-800 px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs text-ink-500">
          <span className="flex items-center gap-2">
            <Radio size={14} />
            Proicio
          </span>
          <span>Created by Henry Ludwig, Eric Li, Olivia Kim, and Isaaq Khanooni</span>
        </div>
      </div>
    </footer>
  );
}
