import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import SessionWatcher from "@/components/ifTimeout/SessionWatcherForUser";
import ScrollToTop from "@/components/ٍScrollToTop";
import { Outlet } from "react-router-dom";

const AppLayout = () => {

  return (
    <>
      <Navbar />
      <ScrollProgress />
      <ScrollToTop />
      <SessionWatcher />
      <Outlet />
    </>
  );
};

export default AppLayout;
