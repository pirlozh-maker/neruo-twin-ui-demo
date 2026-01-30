import { useAppStore } from "../state/store";

const JobQueue = () => {
  const { jobs, cancelJob } = useAppStore();

  if (jobs.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Job Queue</h3>
        <span className="text-[11px] text-slate-500">{jobs.length} jobs</span>
      </div>
      <div className="mt-3 space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
            <div>
              <div className="font-semibold">{job.label}</div>
              <div className="text-[11px] text-slate-500">{job.type} • {job.status}</div>
            </div>
            {job.status === "running" && (
              <button
                className="rounded-lg border border-slate-700 px-2 py-1 text-[11px]"
                onClick={() => cancelJob(job.id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobQueue;
