import { networkMode, networkSelector } from "@/app/features/networkSlice";
import { toaster } from "@/components/ui/toaster";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";

const InternetConnectionServicesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const toastRef = useRef<string | undefined>("");
  const dispatch = useDispatch();
  const { isOnline } = useSelector(networkSelector);

  useEffect(() => {
    dispatch(networkMode(navigator.onLine));

    const handleOnline = () => {
      dispatch(networkMode(true));
      if (toastRef.current) {
        toaster.dismiss(toastRef.current);
        toastRef.current = undefined;
      }
      toaster.create({
        title: "You're back online!",
        description: "Connection restored successfully",
        type: "success",
        meta: {
          icon: <Wifi size={20} />,
        }
      });
    };

    const handleOffline = () => {
      dispatch(networkMode(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isOnline && !toastRef.current) {
      toastRef.current = toaster.create({
        title: " You're offline",
        description: "Please check your internet connection",
        type: "error",
        meta: {
          icon: <WifiOff size={20} />,
        },
      });
    }
  }, [isOnline]);

  return <>{children}</>;
};

export default InternetConnectionServicesProvider;
