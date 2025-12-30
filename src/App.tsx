import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";
import HomeIntro from "./components/OnOpenPage";

const App = () => {
  return (
    <main>
      <div className="bg-anim">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="bubble"></span>
        ))}
      </div>

      <HomeIntro />
      <RouterProvider router={router} />
      <Toaster />
    </main>
  );
};

export default App;