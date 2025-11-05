import { useState } from "react";
import SearchBar from "../common/SearchBar";
import {
  LogIn,
  LogOut,
  Settings,
  ShoppingCart,
  User,
  UserCircle,
} from "lucide-react";
import CartSlider from "./Cart/CartSlider";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/store/slices/userApiSlice";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";
import { clearUserInfo } from "@/store/slices/auth";
import { apiSlice } from "@/store/slices/apiSlice";
const MainNav = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleCart = () => {
    setIsOpen((prev) => !prev);
  };
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await logoutMutation(undefined).unwrap();

      if (response.status !== 200) {
        toast.error(response?.message || "Something went wrong");
      } else if (response.status === 200) {
        toast.warning(response?.message || "Logout success");
      }
      dispatch(clearUserInfo());

      // ✅ Clear RTK Query cache (so useAuthCheckQuery doesn’t return stale data)
      dispatch(apiSlice.util.resetApiState());

      // ✅ Navigate after state reset
      navigate("/auth/login", { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };
  return (
    <main className="bg-black text-white  py-6 px-4 ">
      <div className=" flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="font-bold text-3xl">FlipFlop</h1>
        <SearchBar />
        <div className=" flex items-center  gap-4">
          <ShoppingCart
            onClick={toggleCart}
            className="hover:text-gray-500 cursor-pointer"
          />
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="  ">
                  <User className="w-6 h-6 cursor-pointer hover:text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userInfo ? userInfo.name : ""}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userInfo ? userInfo.email : ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => navigate("/profile")}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => navigate("/setting")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-300/20"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={"/auth/login"}>
              {" "}
              <LogIn className="hover:text-gray-500 cursor-pointer" />
            </Link>
          )}
        </div>
      </div>
      <CartSlider isCartOpen={isOpen} setCartOpen={setIsOpen} />
    </main>
  );
};

export default MainNav;
