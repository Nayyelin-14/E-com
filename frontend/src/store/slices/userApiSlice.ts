import type {
  EditableInfos,
  LoginInputs,
  PasswordUpdate,
  RegisterInputs,
  User,
} from "@/index.types";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data: RegisterInputs) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data: LoginInputs) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    authCheck: builder.query({
      query: () => ({
        url: "/auth/authCheck",
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: `/user/info`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    uploadProfile: builder.mutation({
      query: (formData: FormData) => ({
        url: "/user/upload-profile",
        method: "POST",
        body: formData, // send FormData directly
      }),
      invalidatesTags: ["User"],
    }),
    updateUserInfo: builder.mutation({
      query: (data: EditableInfos) => ({
        url: "/user/update-profile",
        method: "POST",
        body: data, // send FormData directly
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (data: PasswordUpdate) => ({
        url: "/user/change-password",
        method: "POST",
        body: data, // send FormData directly
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useAuthCheckQuery,
  useLogoutMutation,
  useUploadProfileMutation,
  useUpdateUserInfoMutation,
  useGetUserQuery,
  useUpdatePasswordMutation,
} = userApiSlice;

//The builder is an object provided by RTK Query that helps you create endpoints.
// It acts like a “factory” that gives you methods to define what kind of request each endpoint is.
