import DasboradSidebarWithHeader from "@/components/DashboardComponents/DashboardSidebar";
import SessionWatcherForAdmin from "@/components/ifTimeout/SessionWatcherForAdmin";
import ScrollToTop from "@/components/ٍScrollToTop";

export default function DashboardLayout() {
  return (
    <>
      <SessionWatcherForAdmin />
      <DasboradSidebarWithHeader />
      <ScrollToTop />
    </>
  );
}
