export interface User {
  user: {
    name: string;
    email: string;
    role: "customer" | "admin";
    profileImage?: {
      url: string;
      publicId: string;
      alt?: string;
    };
    createdAt?: string; // Dates as ISO strings
    updatedAt?: string;
  };
}

export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs extends LoginInputs {
  name: string;
}
export interface avatarInput {
  profileImage: string;
}
export interface EditableInfos {
  user?: { name: string; email: string; createdAt?: string };
}
export interface PasswordUpdate {
  oldPassword: string;
  newPassword: string;
}
