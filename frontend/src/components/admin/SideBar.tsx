import { PackagePlus } from "lucide-react";
import { Link, useLocation } from "react-router";

const SideBar = () => {
  const pages = [
    {
      name: "Create Product",
      path: "/admin/product/create-products",
      icon: <PackagePlus />,
    },
    // You can add more pages here
  ];

  const location = useLocation();

  const isActive = (path: string) => path === location.pathname;

  return (
    <div className="flex flex-col gap-2 p-2">
      {pages.map((page, index) => (
        <Link
          to={page.path}
          key={index}
          className={`flex items-center gap-2 p-1 px-2 rounded-lg w-fit ${
            isActive(page.path) ? "bg-blue-400 text-white" : "hover:bg-gray-200"
          }`}
        >
          {page.icon}
          <span>{page.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
