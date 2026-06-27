import { GraduationCap } from 'lucide-react'

export default function Brand({ light = false }) {
  return (
    <div className={`flex items-center gap-2.5 font-display text-xl font-bold ${light ? 'text-white' : 'text-ink'}`}>
      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${light ? 'bg-white/10 text-sun' : 'bg-pine text-white'}`}><GraduationCap size={22} /></span>
      Campus<span className="-ml-2 text-sun">Connect</span>
    </div>
  )
}
