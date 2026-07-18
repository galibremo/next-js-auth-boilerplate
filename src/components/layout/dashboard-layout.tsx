import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "./site-header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <BreadcrumbProvider>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">{children}</div>
              </div>
            </div>
          </div>
        </BreadcrumbProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
