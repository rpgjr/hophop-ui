import { useState } from "react";
import MetaTagMappings from "../components/settings/MetaTagMappings";

const TABS = ["General", "Meta tags"] as const;
type Tab = (typeof TABS)[number];

export default function Settings() {
  const [tab, setTab] = useState<Tab>("General");

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-4 text-xl font-bold sm:text-2xl">Settings</h1>

      <div role="tablist" className="tabs tabs-border mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            className={`tab ${tab === t ? "tab-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <p className="opacity-70">General settings will go here.</p>
      )}
      {tab === "Meta tags" && <MetaTagMappings />}
    </div>
  );
}
