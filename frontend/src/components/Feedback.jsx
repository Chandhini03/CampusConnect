import { AlertCircle, LoaderCircle } from "lucide-react";

export const Loading = () => (
  <div className="grid min-h-64 place-items-center">
    <div className="text-center">
      <LoaderCircle className="mx-auto animate-spin text-moss" size={32} />
      <p className="mt-3 text-sm font-semibold text-ink/50">
        Gathering your campus feed…
      </p>
    </div>
  </div>
);
export const ErrorBanner = ({ message }) =>
  message ? (
    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle className="mt-0.5 shrink-0" size={18} />
      <span>{message}</span>
    </div>
  ) : null;
export const EmptyState = ({ icon: Icon, title, text, action }) => (
  <div className="card grid min-h-72 place-items-center p-8 text-center">
    <div>
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-mint text-moss">
        <Icon size={28} />
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink/50">
        {text}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  </div>
);
