import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { ErrorBanner } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  if (localStorage.getItem("campus_token"))
    return <Navigate to="/tutors" replace />;
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6)
      return setError("Use at least 6 characters for your password.");
    if (form.password !== form.confirm)
      return setError("The passwords do not match.");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "We could not create your account."));
    } finally {
      setLoading(false);
    }
  };
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  return (
    <AuthLayout
      eyebrow="Join your community"
      title="Create your account"
      text="Use your college email to enter your trusted campus network."
    >
      <ErrorBanner message={error} />
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <div className="relative">
            <UserRound
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
              size={18}
            />
            <input
              id="name"
              className="field pl-11"
              placeholder="Your full name"
              value={form.name}
              onChange={update("name")}
              required
            />
          </div>
        </div>
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
              id="email"
              className="field pl-11"
              type="email"
              placeholder="you@campus.edu"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35"
                size={18}
              />
              <input
                id="password"
                className="field pl-11 pr-10"
                type={show ? "text" : "password"}
                placeholder="6+ characters"
                value={form.password}
                onChange={update("password")}
                required
              />
              <button
                aria-label="Toggle password visibility"
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="confirm">
              Confirm
            </label>
            <input
              id="confirm"
              className="field"
              type={show ? "text" : "password"}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={update("confirm")}
              required
            />
          </div>
        </div>
        <button className="primary-btn mt-2 w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
          <ArrowRight size={18} />
        </button>
      </form>
      <p className="mt-7 text-center text-sm text-ink/55">
        Already have an account?{" "}
        <Link to="/login" className="font-extrabold text-moss hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
