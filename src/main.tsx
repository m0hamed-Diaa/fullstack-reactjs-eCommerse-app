import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider as ChakraUiComponent } from "./components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./app/store";
import { Toaster } from "./components/ui/toaster";
import InternetConnectionServicesProvider from "./Provider/InternetConnectionServicesProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ChakraUiComponent>
      <Provider store={store}>
        <InternetConnectionServicesProvider>
          <App />
          <Toaster />
        </InternetConnectionServicesProvider>
      </Provider>
    </ChakraUiComponent>
  </QueryClientProvider>
);
