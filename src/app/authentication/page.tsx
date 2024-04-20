"use client";

import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginPage from "./login/page";
import RegisterPage from "./register/page";
import Image from "next/image";

const AuthenticationPage = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="w-full h-screen flex justify-center">
      <Tabs defaultValue="login" className="w-full p-20">
        <TabsList className="w-full bg-[#2b4032] rounded-lg">
          <TabsTrigger className="w-full text-white" value="login">
            Login
          </TabsTrigger>
          <TabsTrigger className="w-full text-white" value="register">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="w-full h-screen relative">
          <LoginPage />
          <div className="absolute inset-x-0 top-10 z-0 opacity-10 h-[80%] w-full ">
            <Image
              src="./svgs/loginBG.svg"
              alt="login"
              className="w-full h-full object-cover animate-pulse"
              priority
              width={50}
              height={50}
            />
          </div>
        </TabsContent>
        <TabsContent value="register" className="w-full h-screen relative">
          <RegisterPage />
          <div className="absolute inset-x-0 top-14 z-0 opacity-10 h-[80%] w-full">
            <Image
              src="./svgs/registerBG.svg"
              alt="login"
              className="w-full h-full object-cover animate-pulse"
              priority
              width={50}
              height={50}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
