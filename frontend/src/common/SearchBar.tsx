import { SearchIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const SearchBar = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const newParams = new URLSearchParams(searchParams);
  // Initialize search keyword from URL on mount
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) {
      setSearchKeyword(keyword);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Preserve existing query parameters

    if (searchKeyword.trim()) {
      newParams.set("keyword", searchKeyword.trim());
    } else {
      newParams.delete("keyword");
    }

    navigate(`/products?${newParams.toString()}`, { replace: true });
  };

  const handleClear = () => {
    setSearchKeyword("");

    newParams.delete("keyword");
    navigate(`/products?${newParams.toString()}`, { replace: true });
  };

  return (
    <div className="w-[200px] sm:w-[300px] md:w-[400px] lg:w-3xl relative">
      <SearchIcon className="absolute text-black top-1 left-2" size={20} />
      <form onSubmit={handleSearch}>
        <input
          value={searchKeyword}
          type="text"
          placeholder="Search products..."
          className="bg-gray-300 ps-8 py-1 rounded-full w-full text-sm text-black focus:outline-none pr-8"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {searchKeyword && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1 text-gray-600 hover:text-black"
          >
            ✕
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
