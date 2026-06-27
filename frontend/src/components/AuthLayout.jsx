import { ArrowUpRight, BookOpenCheck, Sparkles, Users } from 'lucide-react'
import Brand from './Brand'

export default function AuthLayout({ children, eyebrow, title, text }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">
      <section className="auth-grid relative hidden overflow-hidden bg-pine p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 top-16 h-80 w-80 rounded-full border-[55px] border-white/5" />
        <div className="absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-moss/70 blur-2xl" />
        <Brand light />
        <div className="relative my-auto max-w-2xl py-16">
          <p className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.22em] text-sun"><Sparkles size={15} /> Your campus, connected</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.08] xl:text-6xl">Learn together.<br />Trade smarter.<br /><span className="text-sun">Go further.</span></h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-white/65">Everything your campus community needs—from peer learning to the next big opportunity—in one trusted place.</p>
          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
            {[['Peer tutors', BookOpenCheck], ['Campus network', Users], ['New possibilities', ArrowUpRight]].map(([label, Icon]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[.06] p-4 backdrop-blur"><Icon className="mb-5 text-sun" size={21} /><p className="text-sm font-bold">{label}</p></div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/35">Made for students, by the campus community.</p>
      </section>
      <section className="flex min-h-screen items-center justify-center bg-[#fbfcf8] px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Brand /></div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-moss">{eyebrow}</p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-ink/55">{text}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  )
}
