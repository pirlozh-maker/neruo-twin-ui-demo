import { ReactNode, useState } from "react";
import { useAppStore } from "../state/store";

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

const Accordion = ({ title, children, defaultOpen = true }: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const pushToast = useAppStore((state) => state.pushToast);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
        onClick={() => {
          setOpen((value) => !value);
          pushToast({
            id: `toast_accordion_${Date.now()}`,
            title: `${title} ${open ? "collapsed" : "expanded"}`,
            description: "Accordion toggled.",
            tone: "info",
          });
        }}
      >
        <span>{title}</span>
        <span className="text-xs text-slate-400">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="space-y-4 px-4 pb-4 text-sm">{children}</div>}
    </div>
  );
};

export default Accordion;
