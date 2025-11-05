/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EditableInfos } from "@/index.types";
import { Calendar, Edit2, Loader, Mail, Save, X } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/schemas/AuthSchema";
import * as z from "zod";
import { toast } from "sonner";
import { useUpdateUserInfoMutation } from "@/store/slices/userApiSlice";
type ProfileFormValues = z.infer<typeof profileSchema>;
const ProfileForm: React.FC<EditableInfos> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateUserInfo, { isLoading: isUpdating }] =
    useUpdateUserInfoMutation();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });
  const onSubmit = async (data: ProfileFormValues) => {
    const nameChanged = data.name !== user?.name;
    const emailChanged = data.email !== user?.email;

    if (!nameChanged && !emailChanged) {
      toast.info("No changes detected.");
      setIsEditing(false);
      return;
    }

    const payload: Partial<ProfileFormValues> = {};

    if (nameChanged) {
      payload.name = data.name;
    }

    if (emailChanged) {
      payload.email = data.email;
    }
    console.log(payload);
    try {
      const response = await updateUserInfo(payload as EditableInfos).unwrap(); // ✅ use mutation function
      console.log(response);
      form.reset(data);
      toast.success(response?.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
  };
  return (
    <div className="mt-6 space-y-6 px-5 my-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                {isEditing ? (
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">
                    {field.value || "—"}
                  </h1>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </FormLabel>
                {isEditing ? (
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                ) : (
                  <p className="text-gray-700">{field.value}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Join Date (Static) */}
          <div>
            <FormLabel>
              <Calendar className="w-4 h-4 inline mr-2" />
              Account Created
            </FormLabel>
            <p className="text-gray-700">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "January 2024"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            {!isEditing ? (
              <Button
                type="button" // ✅ ensures it won't trigger form submission
                disabled={isUpdating}
                onClick={(e) => {
                  e.preventDefault(); // ✅ Extra safety
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                {isUpdating ? (
                  <>
                    {" "}
                    <Button
                      disabled={isUpdating}
                      type="button"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Loader className="animate animate-spin" />
                    </Button>
                  </>
                ) : (
                  <>
                    {" "}
                    <Button
                      disabled={isUpdating}
                      type="submit"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button
                      disabled={isUpdating}
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
