import { downloadJson } from "../utils/exporters";
import { useAppStore } from "../state/store";

const ExportReportsPage = () => {
  const { exports, pushToast } = useAppStore();

  return (
    <div className="space-y-4 p-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-sm font-semibold">Export & Reports</h2>
        <p className="mt-2 text-xs text-slate-400">
          Export bundles are stored locally. Download bundles or copy JSON for downstream tooling.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {exports.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-500">
            No export bundles yet — run Export from the header.
          </div>
        ) : (
          exports.map((bundle) => (
            <div
              key={bundle.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{bundle.filename}</span>
                <span className="text-[11px] text-slate-500">{bundle.createdAt}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Contains recipe, run_result, provenance, macros, correction.
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="rounded-lg border border-slate-700 px-3 py-1"
                  onClick={() => {
                    downloadJson(bundle.filename, bundle.payload);
                    pushToast({
                      id: `toast_export_download_${Date.now()}`,
                      title: "Bundle downloaded",
                      description: bundle.filename,
                      tone: "success",
                    });
                  }}
                >
                  Save File
                </button>
                <button
                  className="rounded-lg border border-slate-700 px-3 py-1"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(bundle.payload, null, 2));
                    pushToast({
                      id: `toast_export_copy_${Date.now()}`,
                      title: "Bundle copied",
                      description: "JSON copied to clipboard.",
                      tone: "info",
                    });
                  }}
                >
                  Copy JSON
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExportReportsPage;
