export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[.2em] text-moss">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
