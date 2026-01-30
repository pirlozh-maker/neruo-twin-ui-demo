import { useState } from "react";

const SessionNotesPanel = () => {
  const [notes, setNotes] = useState("");

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Session Notes</h3>
        <span className="text-[11px] text-slate-500">Local only</span>
      </div>
      <textarea
        className="mt-3 h-24 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs"
        placeholder="Log observations, anomalies, and tweaks..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <div className="mt-2 flex justify-end">
        <button
          className="rounded-lg border border-slate-700 px-3 py-1"
          onClick={() => setNotes("")}
        >
          Clear
        </button>
      </div>
    </section>
  );
};

export default SessionNotesPanel;
