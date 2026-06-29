import {
  BriefcaseBusiness,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Brand from "./Brand";

const links = [
  { to: "/tutors", label: "Find tutors", icon: Users },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { to: "/opportunities", label: "Opportunities", icon: BriefcaseBusiness },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("campus_user") || "{}");
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${isActive ? "bg-pine text-white" : "text-ink/55 hover:bg-white hover:text-ink"}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-xs font-extrabold">
              {user.name || "Campus member"}
            </p>
            <p className="max-w-32 truncate text-[11px] text-ink/45">
              {user.email}
            </p>
          </div>
          <button
            aria-label="Log out"
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white hover:border-sun hover:text-sun"
          >
            <LogOut size={17} />
          </button>
        </div>
        <button
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-full bg-white md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ink/5 bg-white p-4 md:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              onClick={() => setOpen(false)}
              key={to}
              to={to}
              className={({ isActive }) =>
                `mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${isActive ? "bg-pine text-white" : ""}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600"
          >
            <LogOut size={18} />
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}
