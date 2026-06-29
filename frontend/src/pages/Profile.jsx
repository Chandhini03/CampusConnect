import {
  AlertTriangle,
  GraduationCap,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import Modal from "../components/Modal";
import { ErrorBanner, Loading } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

const blankTutor = {
  branch: "",
  yearOfStudy: "",
  bio: "",
  subjects: "",
  hourlyRate: "",
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", isTutor: false });
  const [tutorEnabled, setTutorEnabled] = useState(false);
  const [tutorForm, setTutorForm] = useState(blankTutor);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirm, setConfirm] = useState(null);

  const syncLocalUser = (nextUser) => {
    localStorage.setItem("campus_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/auth/me");
        syncLocalUser(data);
        setTutorEnabled(data.isTutor);
        if (data.isTutor) {
          const tutor = (await api.get("/tutors/me")).data;
          setTutorForm({
            branch: tutor.branch || "",
            yearOfStudy: tutor.yearOfStudy || "",
            bio: tutor.bio || "",
            subjects: (tutor.subjects || []).join(", "),
            hourlyRate: tutor.hourlyRate || "",
          });
        }
      } catch (e) {
        setError(errorMessage(e, "Could not load your profile."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleTutor = () => {
    if (tutorEnabled && user.isTutor) {
      setConfirm("tutor");
      return;
    }
    setTutorEnabled(!tutorEnabled);
  };

  const deleteTutor = async () => {
    setConfirm(null);
    setSaving(true);
    setError("");
    try {
      await api.delete("/tutors/me");
      const nextUser = { ...user, isTutor: false };
      syncLocalUser(nextUser);
      setTutorEnabled(false);
      setTutorForm(blankTutor);
      setNotice("Tutor profile removed.");
    } catch (e) {
      setError(errorMessage(e, "Could not remove your tutor profile."));
    } finally {
      setSaving(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.put("/auth/me", { name: user.name });
      let nextUser = data;
      if (tutorEnabled) {
        await api.put("/tutors/me", {
          branch: tutorForm.branch,
          yearOfStudy: tutorForm.yearOfStudy,
          bio: tutorForm.bio,
          subjects: tutorForm.subjects
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean),
          hourlyRate: tutorForm.hourlyRate || null,
        });
        nextUser = { ...data, isTutor: true };
      }
      syncLocalUser(nextUser);
      setNotice("Profile saved.");
    } catch (e) {
      setError(errorMessage(e, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    setConfirm(null);
    setSaving(true);
    setError("");
    try {
      await api.delete("/auth/me");
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (e) {
      setError(errorMessage(e, "Could not delete your account."));
      setSaving(false);
    }
  };

  const updateTutor = (key) => (e) =>
    setTutorForm({ ...tutorForm, [key]: e.target.value });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        <PageHeader
          eyebrow="Profile"
          title="Manage your campus identity"
          description="Keep your account details current and choose whether students can find you as a tutor."
        />
        <ErrorBanner message={error} />
        {notice && (
          <div className="mb-6 rounded-2xl border border-moss/15 bg-mint p-4 text-sm font-bold text-moss">
            {notice}
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={save} className="space-y-6">
            <section className="card p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-moss">
                  <UserRound size={22} />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    Account details
                  </h2>
                  <p className="text-sm text-ink/50">{user.email}</p>
                </div>
              </div>
              <div>
                <label className="label" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  className="field"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  required
                />
              </div>
            </section>

            <section className="card p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-moss">
                    <GraduationCap size={23} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold">
                      Tutor profile
                    </h2>
                    <p className="text-sm text-ink/50">
                      Turn this on to appear in tutor discovery.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTutor}
                  className={`flex h-11 w-20 items-center rounded-full p-1 ${tutorEnabled ? "justify-end bg-pine" : "justify-start bg-ink/10"}`}
                  aria-label="Toggle tutor profile"
                >
                  <span className="h-9 w-9 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {tutorEnabled && (
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Branch</label>
                    <input
                      className="field"
                      placeholder="Computer Science"
                      value={tutorForm.branch}
                      onChange={updateTutor("branch")}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Year of study</label>
                    <input
                      className="field"
                      placeholder="3rd year"
                      value={tutorForm.yearOfStudy}
                      onChange={updateTutor("yearOfStudy")}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Hourly rate</label>
                    <input
                      className="field"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="300"
                      value={tutorForm.hourlyRate}
                      onChange={updateTutor("hourlyRate")}
                    />
                  </div>
                  <div>
                    <label className="label">Subjects</label>
                    <input
                      className="field"
                      placeholder="DSA, Java, DBMS"
                      value={tutorForm.subjects}
                      onChange={updateTutor("subjects")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Bio</label>
                    <textarea
                      className="field min-h-32 resize-none"
                      placeholder="Tell students what you can help with."
                      value={tutorForm.bio}
                      onChange={updateTutor("bio")}
                    />
                  </div>
                </div>
              )}
            </section>

            <div className="flex flex-wrap justify-between gap-3">
              <button
                type="button"
                className="secondary-btn border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                onClick={() => setConfirm("account")}
              >
                <Trash2 size={17} />
                Delete account
              </button>
              <button className="primary-btn" disabled={saving}>
                <Save size={17} />
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        )}
      </main>

      {confirm === "tutor" && (
        <Modal
          title="Remove tutor profile?"
          subtitle="Your tutor details will be deleted from the database."
          onClose={() => setConfirm(null)}
        >
          <ConfirmBody
            text="Students will no longer see you as a tutor. Your normal account will stay active."
            action="Remove tutor profile"
            onCancel={() => setConfirm(null)}
            onConfirm={deleteTutor}
          />
        </Modal>
      )}

      {confirm === "account" && (
        <Modal
          title="Delete account?"
          subtitle="This will remove your account and your posts."
          onClose={() => setConfirm(null)}
        >
          <ConfirmBody
            text="This action cannot be undone."
            action="Delete account"
            onCancel={() => setConfirm(null)}
            onConfirm={deleteAccount}
          />
        </Modal>
      )}
    </>
  );
}

function ConfirmBody({ text, action, onCancel, onConfirm }) {
  return (
    <div>
      <div className="mb-5 flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
        <AlertTriangle className="mt-0.5 shrink-0" size={18} />
        <p>{text}</p>
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="primary-btn bg-red-600 text-white hover:bg-red-700"
          onClick={onConfirm}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
