import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";

const tutors = [
  {
    name: "Ananya Rao",
    subject: "Data Structures",
    branch: "Computer Science · 3rd year",
    rating: 4.9,
    sessions: 32,
    availability: "Today, 5:00 PM",
    initials: "AR",
    color: "bg-[#e3c3ff]",
  },
  {
    name: "Kabir Mehta",
    subject: "Engineering Mathematics",
    branch: "Mechanical · 4th year",
    rating: 4.8,
    sessions: 27,
    availability: "Tomorrow, 3:30 PM",
    initials: "KM",
    color: "bg-[#bce4d3]",
  },
  {
    name: "Meera Iyer",
    subject: "UI/UX Fundamentals",
    branch: "Design · 3rd year",
    rating: 4.9,
    sessions: 41,
    availability: "Friday, 4:00 PM",
    initials: "MI",
    color: "bg-[#ffd8a1]",
  },
  {
    name: "Arjun Singh",
    subject: "Financial Accounting",
    branch: "Commerce · 2nd year",
    rating: 4.7,
    sessions: 19,
    availability: "Saturday, 11:00 AM",
    initials: "AS",
    color: "bg-[#b9dffc]",
  },
  {
    name: "Sana Khan",
    subject: "Python Programming",
    branch: "IT · 4th year",
    rating: 5.0,
    sessions: 38,
    availability: "Today, 7:00 PM",
    initials: "SK",
    color: "bg-[#ffc9d2]",
  },
  {
    name: "Rohan Das",
    subject: "Organic Chemistry",
    branch: "Biotechnology · 3rd year",
    rating: 4.8,
    sessions: 23,
    availability: "Monday, 2:00 PM",
    initials: "RD",
    color: "bg-[#d6e9a6]",
  },
];

export default function Tutors() {
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () =>
      tutors.filter((t) =>
        `${t.name} ${t.subject} ${t.branch}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <PageHeader
          eyebrow="Peer learning"
          title="Find your next tutor"
          description="Learn from students who have been there before. Tutor profiles are previews while scheduling is being connected."
        />
        <div className="mb-8 flex max-w-2xl items-center gap-3 rounded-full border border-ink/10 bg-white px-5 shadow-sm focus-within:border-moss focus-within:ring-4 focus-within:ring-mint">
          <Search className="shrink-0 text-moss" size={20} />
          <input
            className="w-full bg-transparent py-4 text-sm outline-none"
            placeholder="Search by subject, name or department…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((t) => (
            <article
              key={t.name}
              className="card group p-6 transition hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid h-16 w-16 place-items-center rounded-[1.4rem] font-display text-xl font-bold ${t.color}`}
                >
                  {t.initials}
                </div>
                <span className="flex items-center gap-1 rounded-full bg-mint/60 px-3 py-1.5 text-xs font-extrabold">
                  <Star className="fill-sun text-sun" size={14} />
                  {t.rating}
                </span>
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold">
                {t.name}
              </h2>
              <p className="mt-1 text-sm font-bold text-moss">{t.subject}</p>
              <p className="mt-1 text-xs text-ink/45">{t.branch}</p>
              <div className="my-5 h-px bg-ink/5" />
              <div className="flex items-center justify-between text-xs text-ink/55">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={15} />
                  {t.sessions} sessions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 size={15} />
                  45 min
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream p-3">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <CalendarDays className="text-moss" size={16} />
                  {t.availability}
                </span>
                <button
                  aria-label={`View ${t.name}`}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white text-moss group-hover:bg-pine group-hover:text-white"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
        {!shown.length && (
          <div className="py-20 text-center">
            <Search className="mx-auto text-ink/20" size={40} />
            <p className="mt-4 font-bold">No tutors match that search yet.</p>
          </div>
        )}
      </main>
    </>
  );
}
