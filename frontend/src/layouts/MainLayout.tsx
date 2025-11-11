import { Outlet } from "react-router";
import Navbar from "../common/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 lg:p-0 flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </section>
  );
};

export default MainLayout;
