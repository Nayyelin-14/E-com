import SideBar from "@/components/admin/SideBar";

import { Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <section className="grid grid-cols-10 my-10">
      <div className="col-span-2">
        <SideBar />
      </div>
      <div className="col-span-8">
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
