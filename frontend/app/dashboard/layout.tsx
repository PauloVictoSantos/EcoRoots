import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
// import { AppSidebar } from "@/components/dashboard/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  )
}
