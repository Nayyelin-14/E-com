import {
  ChartLine,
  PackagePlus,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import { NavLink } from "react-router";

const SideBar = () => {
  const pages = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <ChartLine className="w-6 h-6" />,
    },
    {
      name: "Management",
      path: "/admin/products/management",
      icon: <SlidersHorizontal className="w-6 h-6" />,
    },
    {
      name: "Create Product",
      path: "/admin/products/actions",
      icon: <PackagePlus className="w-6 h-6" />,
    },
    {
      name: "User Management",
      path: "/admin/users/management",
      icon: <UserCog className="w-6 h-6" />,
    },
    // You can add more pages here
  ];

  return (
    <nav className="h-full">
      <div className="flex flex-col  space-y-4">
        {pages.map((page, index) => (
          <NavLink
            to={page.path}
            key={index}
            className={({ isActive }) => `
          flex items-center gap-3 px-3 rounded-lg font-medium text-sm py-2 ${
            isActive
              ? "bg-primary text-primary-foreground shadow"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
          >
            {page.icon}
            <span>{page.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default SideBar;
