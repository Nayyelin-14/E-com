import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const categories: string[] = [
  "Jeans",
  "Top",
  "Jacket",
  "Shirts",
  "Gym",
  "Accessories",
  "Clothing",
];

const CategoriesBar = () => {
  const [selectedCat, setSelectedCat] = useState<string>("");
  const location = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");

    setSelectedCat(category || ""); // reset if no category
  }, [location.search]);
  const handleCategoryClick = (category: string) => {
    const queryParams = new URLSearchParams(location.search);

    if (selectedCat === category) {
      queryParams.delete("category");
      setSelectedCat("");
    } else {
      queryParams.set("category", category);
      setSelectedCat(category);
    }

    navigate(`/products?${queryParams.toString()}`);
  };
  return (
    <main className="bg-gray-200 text-white  py-3 px-4 ">
      <div className=" flex items-center max-w-6xl gap-25 mx-auto">
        <div className="flex items-center gap-3 text-black">
          <Menu />
          <p className="text-base font-medium ">Categories</p>
        </div>
        <div className="flex items-center gap-6">
          {categories.length > 0 &&
            categories.map((category, index) => (
              <div
                key={index}
                className={`text-black p-1.5 px-2 cursor-pointer text-sm rounded-xl 
          bg-gray-300 hover:bg-gray-100 
          ${selectedCat === category ? "bg-gray-400" : ""}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};

export default CategoriesBar;
