import {
  BookOpen,
  ChevronRight,
  Clock3,
  IndianRupee,
  Search,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorBanner, Loading } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

const colors = [
  "bg-[#e3c3ff]",
  "bg-[#bce4d3]",
  "bg-[#ffd8a1]",
  "bg-[#b9dffc]",
  "bg-[#ffc9d2]",
  "bg-[#d6e9a6]",
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "CC";

export default function Tutors() {
  const [query, setQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        setTutors((await api.get("/tutors")).data);
      } catch (e) {
        setError(errorMessage(e, "Could not load tutors."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const shown = useMemo(
    () =>
      tutors.filter((t) =>
        `${t.tutorName} ${(t.subjects || []).join(" ")} ${t.branch}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, tutors],
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <PageHeader
          eyebrow="Peer learning"
          title="Find your next tutor"
          description="Learn from students who have been there before. Tutor profiles are managed from student profiles."
        />
        <ErrorBanner message={error} />
        <div className="mb-8 flex max-w-2xl items-center gap-3 rounded-full border border-ink/10 bg-white px-5 shadow-sm focus-within:border-moss focus-within:ring-4 focus-within:ring-mint">
          <Search className="shrink-0 text-moss" size={20} />
          <input
            className="w-full bg-transparent py-4 text-sm outline-none"
            placeholder="Search by subject, name or department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <Loading />
        ) : shown.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((t, index) => {
              const subjectText = (t.subjects || []).join(", ") || "General tutoring";
              return (
                <article
                  key={t.id}
                  className="card group p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`grid h-16 w-16 place-items-center rounded-[1.4rem] font-display text-xl font-bold ${colors[index % colors.length]}`}
                    >
                      {initials(t.tutorName)}
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-mint/60 px-3 py-1.5 text-xs font-extrabold">
                      <Star className="fill-sun text-sun" size={14} />
                      {t.rating}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-semibold">
                    {t.tutorName}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-moss">
                    {subjectText}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    {t.branch} · {t.yearOfStudy}
                  </p>
                  <p className="mt-4 min-h-12 text-sm leading-6 text-ink/55">
                    {t.bio || "Open to helping classmates learn and practice."}
                  </p>
                  <div className="my-5 h-px bg-ink/5" />
                  <div className="flex items-center justify-between text-xs text-ink/55">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={15} />
                      {t.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      45 min
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream p-3">
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <IndianRupee className="text-moss" size={16} />
                      {t.hourlyRate ? `${t.hourlyRate}/hr` : "Rate flexible"}
                    </span>
                    <button
                      aria-label={`View ${t.tutorName}`}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white text-moss group-hover:bg-pine group-hover:text-white"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No tutors found"
            text={
              query
                ? "No tutor profiles match that search yet."
                : "No students have turned on tutor profiles yet."
            }
          />
        )}
      </main>
    </>
  );
}
