import AuthForm from "@/components/Forms/AuthForm";
import type { RootState } from "@/store";
import React from "react";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  console.log(userInfo);
  return (
    <section className="max-w-6xl mx-auto">
      <AuthForm FormType="Login" />
    </section>
  );
};

export default LoginPage;
