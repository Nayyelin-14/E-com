import { useRef, useState } from "react";
import { Save, Upload, Trash, LoaderIcon } from "lucide-react";
import {
  useGetUserQuery,
  useUploadProfileMutation,
} from "@/store/slices/userApiSlice";

import Loader from "@/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import ProfileForm from "@/components/Forms/ProfileForm";
import PasswordsForm from "@/components/Forms/PasswordsForm";

export default function UserProfile() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: userInfo, isLoading: infoLoading } = useGetUserQuery(undefined);
  const [uploadMutation, { isLoading: isUploading }] =
    useUploadProfileMutation();

  const handleIconClick = () => {
    inputRef.current?.click();
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImg(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const response = await uploadMutation(formData).unwrap();
      console.log(response);
      setPreviewImg(null);
      setSelectedFile(null);
      toast.success(response?.message);
    } catch (err) {
      console.error(err);
      toast.error("Failed to enqueue upload");
      setPreviewImg(null);
      setSelectedFile(null);
    }
  };
  const handleCancelPhoto = () => {
    setPreviewImg(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (infoLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center -mt-20 mb-6">
              <div className="relative">
                <Avatar className="w-20 h-20 mt-10">
                  <AvatarImage
                    src={previewImg ?? userInfo?.user?.profileImage?.url ?? ""}
                  />
                  <AvatarFallback>
                    <span className="text-lg font-bold">
                      {userInfo?.user?.name &&
                        userInfo.user.name.slice(0, 2).toUpperCase()}
                    </span>
                  </AvatarFallback>
                </Avatar>
                {!previewImg ? (
                  <>
                    <Upload
                      className={`w-7 h-7 absolute -bottom-2 right-1 p-1 rounded-full text-white cursor-pointer transition
        ${
          isUploading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:text-black hover:bg-blue-500/70"
        }`}
                      onClick={!isUploading ? handleIconClick : undefined}
                    />
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </>
                ) : (
                  <button
                    disabled={isUploading}
                    onClick={!isUploading ? handleCancelPhoto : undefined}
                    className={`flex items-center gap-2 p-1 rounded-lg shadow-md font-medium absolute -bottom-2 right-1 cursor-pointer transition
      ${
        isUploading
          ? "bg-red-300 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 text-white"
      }`}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>

              {previewImg && (
                <div className="flex gap-2 mt-4">
                  <button
                    disabled={isUploading}
                    onClick={!isUploading ? handleSavePhoto : undefined}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md font-medium transition-colors
        ${
          isUploading
            ? "bg-green-300 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
                  >
                    {isUploading ? (
                      <LoaderIcon className="animate-spin w-5 h-5 text-white" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Upload Photo
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* info */}

          <ProfileForm user={userInfo?.user} />
        </div>
        <div className="my-10 bg-white rounded-lg">
          <PasswordsForm />
        </div>
      </div>
    </div>
  );
}
