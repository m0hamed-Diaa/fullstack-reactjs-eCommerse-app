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
// https://www.udemy.com/course/pro-frontend-engineer-reactjs-typescript-redux-nextjs-api-tailwindcss/learn/lecture/40159608#content
// for make my Live Server on usually
// https://dashboard.uptimerobot.com/