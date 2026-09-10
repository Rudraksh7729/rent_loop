import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import DashboardSidebar, { DashboardMobileNav } from './DashboardSidebar'

export default function DashboardLayout({ role, children }) {
  return (
    <div className="min-h-svh bg-sand">
      <Navbar variant="solid" />
      <main className="container-rl pb-24 pt-24 sm:pt-28 lg:pb-16">
        <div className="flex gap-6">
          <DashboardSidebar role={role} />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <DashboardMobileNav role={role} />
      <div className="pb-16 lg:pb-0">
        <Footer />
      </div>
    </div>
  )
}
