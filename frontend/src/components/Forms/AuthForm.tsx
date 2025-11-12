/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema, RegisterSchema } from "@/schemas/AuthSchema";
import { Link, useNavigate } from "react-router";
import { Input } from "../ui/input";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/store/slices/userApiSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/store/slices/auth";
import { PasswordInput } from "../Inputs/PasswordInput";

type AuthFormProps = {
  FormType: "Login" | "Register";
};

type LoginFormType = z.infer<typeof LoginSchema>;
type RegisterFormType = z.infer<typeof RegisterSchema>;
type AuthFormType = LoginFormType | RegisterFormType;

const AuthForm = ({ FormType }: AuthFormProps) => {
  const dispatch = useDispatch();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const schema = FormType === "Login" ? LoginSchema : RegisterSchema;

  const form = useForm<AuthFormType>({
    resolver: zodResolver(schema),
    defaultValues:
      FormType === "Login"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "" },
  });
  const onSubmit = async (data: AuthFormType) => {
    let response;
    try {
      if (FormType === "Register") {
        response = await registerMutation(data as RegisterFormType).unwrap();

        form.reset();
        navigate("/auth/login");
      } else {
        response = await loginMutation(data as LoginFormType).unwrap();
        dispatch(setUserInfo(response.user));
        form.reset();
        navigate("/");
      }
      if (response?.success) {
        toast.success(response?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="flex items-center  justify-center min-h-screen">
      <div className="rounded-xl border border-gray-200 w-1/2 p-10">
        <p className="text-xl font-bold text-center">FLIP FLOP</p>
        <p className="text-sm text-gray-400 text-center mt-3">
          Enter your information below
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {FormType === "Register" && (
              <FormField
                control={form.control}
                name={"name" as keyof AuthFormType}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name={"email" as keyof AuthFormType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abc@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"password" as keyof AuthFormType}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isRegisterLoading || isLoginLoading}
            >
              {isRegisterLoading || isLoginLoading ? (
                <Loader className="animate-spin w-4 h-4 mr-2 inline" />
              ) : null}
              {FormType === "Login" ? "Login" : "Register"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-black mt-5">
          {FormType === "Login" ? (
            <>
              Don’t have an account?{" "}
              <Link to="/auth/register" className="text-blue-500 underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/auth/login" className="text-blue-500 underline">
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
