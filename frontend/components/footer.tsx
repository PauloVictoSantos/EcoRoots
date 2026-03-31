import Link from 'next/link'

function LeafLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C16 3 5 8 5 18C5 23.5 9.5 28 16 28C22.5 28 27 23.5 27 18C27 8 16 3 16 3Z" fill="#1E8449" opacity="0.9"/>
      <path d="M16 3C16 3 22 10 20 20C18.5 26 16 28 16 28" stroke="#58D68D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 28V14" stroke="#58D68D" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <LeafLogo />
            <span className="font-bold text-white">Smart<span className="text-[#58D68D]">Greenhouse</span></span>
          </div>
          <nav className="flex gap-6 text-sm text-[#6B7280]">
            <Link href="/"             className="hover:text-[#58D68D] transition-colors">Início</Link>
            <Link href="/estufa"       className="hover:text-[#58D68D] transition-colors">Estufa 3D</Link>
            <Link href="/dashboard"    className="hover:text-[#58D68D] transition-colors">Dashboard</Link>
            <Link href="/documentacao" className="hover:text-[#58D68D] transition-colors">Documentação</Link>
          </nav>
          <p className="text-xs text-[#4B5563]">© 2025 Smart Greenhouse · Tecnologia Amazônica</p>
        </div>
      </div>
    </footer>
  )
}
