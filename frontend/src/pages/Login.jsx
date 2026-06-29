import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { ErrorBanner } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (localStorage.getItem("campus_token"))
    return <Navigate to="/tutors" replace />;
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("campus_token", data.token || data.jwt);
      localStorage.setItem(
        "campus_user",
        JSON.stringify({
          email: data.email || form.email,
          name: data.name || form.email.split("@")[0].replace(/[._]/g, " "),
          isTutor: data.isTutor || false,
        }),
      );
      navigate("/tutors");
    } catch (err) {
      setError(
        errorMessage(err, "We could not sign you in. Check your details."),
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your campus"
      text="Pick up where you left off. Your campus community is waiting."
    >
      <ErrorBanner message={error} />
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="label" htmlFor="email">
            College email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
              size={18}
            />
            <input
              className="field pl-11"
              id="email"
              type="email"
              placeholder="you@campus.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Password
            </label>
          </div>
          <div className="relative">
            <LockKeyhole
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
              size={18}
            />
            <input
              className="field px-11"
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              aria-label="Toggle password visibility"
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="primary-btn w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
          <ArrowRight size={18} />
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-ink/55">
        New to CampusConnect?{" "}
        <Link to="/signup" className="font-extrabold text-moss hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-5 rounded-2xl bg-mint/55 p-3 text-center text-xs text-moss">
        Fresh setup? Register with an <b>@campus.edu</b> email first.
      </p>
    </AuthLayout>
  );
}
