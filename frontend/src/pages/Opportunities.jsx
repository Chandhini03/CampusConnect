import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Edit3,
  Filter,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { EmptyState, ErrorBanner, Loading } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

const categories = [
  "Internship",
  "Hackathon",
  "Workshop",
  "Volunteer",
  "Competition",
  "Projects", 
  "Other",
];
const blank = {
  title: "",
  description: "",
  category: "Internship",
  applicationLink: "",
};
const tones = {
  Internship: "bg-[#d8ebe3] text-[#17554c]",
  Hackathon: "bg-[#ead8f5] text-[#674279]",
  Workshop: "bg-[#f9dfb9] text-[#7a4b12]",
  Volunteer: "bg-[#d8e8f5] text-[#285674]",
  Competition: "bg-[#f7d5dc] text-[#803b4a]",
  Projects: "bg-[#f0f0f0] text-[#333]",
  Other: "bg-ink/5 text-ink/60",
};

export default function Opportunities() {
  const user = JSON.parse(localStorage.getItem("campus_user") || "{}");
  const [posts, setPosts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [filter, setFilter] = useState("All"),
    [modal, setModal] = useState(null),
    [form, setForm] = useState(blank),
    [saving, setSaving] = useState(false);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setPosts((await api.get("/opportunities")).data);
    } catch (e) {
      setError(
        errorMessage(
          e,
          "Could not load opportunities. Make sure the backend is running.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const shown = useMemo(
    () =>
      filter === "All" ? posts : posts.filter((p) => p.category === filter),
    [posts, filter],
  );
  const openCreate = () => {
    setForm(blank);
    setModal("create");
  };
  const openEdit = (post) => {
    setForm({
      title: post.title,
      description: post.description || "",
      category: post.category,
      applicationLink: post.applicationLink || "",
    });
    setModal(post);
  };
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      modal === "create"
        ? await api.post("/opportunities", form)
        : await api.put(`/opportunities/${modal.id}`, form);
      setModal(null);
      await load();
    } catch (err) {
      setError(errorMessage(err, "Could not save this opportunity."));
      setModal(null);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`))
      return;
    try {
      await api.delete(`/opportunities/${post.id}`);
      setPosts(posts.filter((p) => p.id !== post.id));
    } catch (e) {
      setError(errorMessage(e, "Could not delete this opportunity."));
    }
  };
  const date = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently";
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <PageHeader
          eyebrow="Campus opportunities"
          title="Your next step starts here"
          description="Discover internships, events, competitions and calls for collaboration shared by students in your campus network."
          action={
            <button onClick={openCreate} className="primary-btn">
              <Plus size={18} />
              Post opportunity
            </button>
          }
        />
        <ErrorBanner message={error} />
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <span className="mr-1 flex items-center text-ink/40">
            <Filter size={17} />
          </span>
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold ${filter === c ? "bg-pine text-white" : "border border-ink/10 bg-white text-ink/55 hover:border-moss"}`}
            >
              {c}
            </button>
          ))}
        </div>
        {loading ? (
          <Loading />
        ) : shown.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {shown.map((post) => {
              const mine = post.posterEmail === user.email;
              return (
                <article
                  key={post.id}
                  className="card flex flex-col p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider ${tones[post.category] || tones.Other}`}
                    >
                      {post.category}
                    </span>
                    {mine && (
                      <div className="flex gap-1">
                        <button
                          aria-label="Edit opportunity"
                          onClick={() => openEdit(post)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-mint text-moss hover:bg-pine hover:text-white"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          aria-label="Delete opportunity"
                          onClick={() => remove(post)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-semibold leading-tight">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-ink/55">
                    {post.description || "No additional details were provided."}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/5 pt-5 text-xs text-ink/45">
                    <span className="flex items-center gap-1.5">
                      <UserRound size={14} />
                      {post.posterName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {date(post.postedAt)}
                    </span>
                    {mine && (
                      <span className="font-extrabold text-moss">
                        Posted by you
                      </span>
                    )}
                  </div>
                  {post.applicationLink && (
                    <a
                      href={post.applicationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 self-start text-sm font-extrabold text-moss hover:underline"
                    >
                      View details <ArrowUpRight size={16} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={BriefcaseBusiness}
            title="No opportunities here yet"
            text={
              filter === "All"
                ? "Have something worth sharing? Start the campus opportunity board."
                : `There are no ${filter.toLowerCase()} posts right now.`
            }
            action={
              filter === "All" && (
                <button onClick={openCreate} className="primary-btn">
                  <Plus size={17} />
                  Post opportunity
                </button>
              )
            }
          />
        )}
      </main>
      {modal && (
        <Modal
          title={
            modal === "create" ? "Share an opportunity" : "Edit opportunity"
          }
          subtitle="Give students enough context to know if it is right for them."
          onClose={() => setModal(null)}
        >
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input
                className="field"
                placeholder="e.g. Frontend intern at local startup"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                className="field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="field min-h-32 resize-none"
                placeholder="What is it, who is it for, and what should they know?"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="label">Application or details link</label>
              <input
                className="field"
                type="url"
                placeholder="https://…"
                value={form.applicationLink}
                onChange={(e) =>
                  setForm({ ...form, applicationLink: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button className="primary-btn" disabled={saving}>
                {saving ? "Saving…" : "Publish opportunity"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
