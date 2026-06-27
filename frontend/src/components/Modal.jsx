import { X } from "lucide-react";

export default function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/55 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-cream p-6 shadow-2xl sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white hover:bg-mint"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
