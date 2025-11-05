/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { PasswordSchema } from "@/schemas/AuthSchema";
import { toast } from "sonner";
import { useUpdatePasswordMutation } from "@/store/slices/userApiSlice";
import { Loader } from "lucide-react";
import { PasswordInput } from "../PasswordInput";

const PasswordsForm = () => {
  const [updatePassword, { isLoading: isUpdating }] =
    useUpdatePasswordMutation();
  const form = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof PasswordSchema>) => {
    console.log(values);
    if (!values) {
      toast.warning("Please enter the required fields");
    }
    try {
      const response = await updatePassword(values).unwrap();
      if (response?.success) {
        toast.success(response.message);
        form.reset();
      } else {
        toast.warning(response.message);
      }
      console.log(response);
    } catch (error: any) {
      // Handle validation errors (from express-validator)
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        error.data.errors.forEach((err: any) => {
          toast.error(err.msg || "Validation failed");
        });
        return;
      }

      // Handle controller or general errors
      const message = error?.data?.message || error?.error;
      toast.error(message);
    }
  };

  return (
    <div className="p-5">
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old password</FormLabel>
                <FormControl>
                  <PasswordInput field={field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput field={field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader className="animate  animate-spin" />
            ) : (
              <span>Update password</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordsForm;
