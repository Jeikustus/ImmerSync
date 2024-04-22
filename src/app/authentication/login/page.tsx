"use client";

import React, { useState } from "react";
import { InputWithLabel } from "@/components/ui/inputwithlabel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInWithEmailAndPassword } from "@/config/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { conAuth, conDatabase } from "@/config/firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(conAuth);

  const handleLogin = async (
    e: React.FormEvent,
    userEmail: string,
    password: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(userEmail, password);

      console.log("User signed in successfully");

      const currentUser = conAuth.currentUser;

      const userDocRef = doc(
        conDatabase,
        `users/${currentUser ? currentUser.uid : null}`
      );
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as {
          userAccountStatus: string;
          userAccountType: string;
        };

        const accountStatus = userData.userAccountStatus;
        if (accountStatus === "Pending") {
          window.location.href = "/authentication/account/pending";
        } else if (accountStatus === "Declined") {
          window.location.href = "/authentication/account/declined-account";
        } else if (accountStatus === "Approved") {
          const accountType = userData.userAccountType;
          if (
            accountType === "Teacher" ||
            accountType === "Student" ||
            accountType === "Organizer"
          ) {
            window.location.href = "/dashboard";
          } else if (accountType === "Admin") {
            window.location.href = "/admin";
          } else {
            console.error("Unknown account type:", accountType);
          }
        } else {
          console.error("Unknown account status:", accountStatus);
        }
      }
    } catch (error) {
      setError((error as Error).message);
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="relative">
      <div className="relative z-10 px-20 pt-10 grid gap-5">
        <div className="text-white">
          <h1 className="text-3xl font-bold">Login</h1>
          <p>Enter your Email and Password to access Account..</p>
        </div>
        <form
          onSubmit={(e) => handleLogin(e, email, password, setError)}
          className="grid gap-3"
        >
          <InputWithLabel
            label="Email"
            type="email"
            placeholder="your@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${error && "border-2 border-rose-500"}`}
            required
          />
          <InputWithLabel
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${error && "border-2 border-rose-500"}`}
            required
          />
          <div className="flex space-x-2 text-white pb-5">
            <p>Forgot password?</p>
            <Link
              href={"/authentication/account/forgot-password"}
              className="font-medium hover:text-blue-500"
            >
              <em>Reset Password</em>
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Submit</Button>
          <p className="text-white">
            Don&apos;t have an Account yet?{" "}
            <Link href={"/"} className="font-medium hover:text-blue-500">
              <em>Click Register</em>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
