import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
