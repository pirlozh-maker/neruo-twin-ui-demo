import { useEffect, useRef } from "react";
import { useAppStore } from "../state/store";

const toneStyles: Record<string, string> = {
  info: "border-slate-700 bg-slate-900/90 text-slate-100",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  warning: "border-orange-500/40 bg-orange-500/10 text-orange-100",
  danger: "border-red-500/40 bg-red-500/10 text-red-100",
};

const ToastStack = () => {
  const { toasts, removeToast } = useAppStore();
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    toasts.forEach((toast) => {
      if (timers.current[toast.id]) return;
      timers.current[toast.id] = window.setTimeout(() => {
        removeToast(toast.id);
        delete timers.current[toast.id];
      }, 3200);
    });
  }, [removeToast, toasts]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-6 top-20 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-72 rounded-xl border px-4 py-3 text-xs shadow-lg ${
            toneStyles[toast.tone ?? "info"]
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{toast.title}</span>
            <button className="text-[11px]" onClick={() => removeToast(toast.id)}>
              Close
            </button>
          </div>
          {toast.description && <p className="mt-2 text-[11px]">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
