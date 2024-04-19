"use client";

import React, { useState } from "react";
import { InputWithLabel } from "@/components/ui/inputwithlabel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
};

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="relative z-10 px-20 pt-10 grid gap-5">
        <div className="text-white">
          <h1 className="text-3xl font-bold">Login</h1>
          <p>Enter your Email and Password to access Account..</p>
        </div>
        <form onSubmit={handleLogin} className="grid gap-3">
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
            <Link href={"/reset"} className="font-medium hover:text-blue-500">
              <em>Reset Password</em>
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button>Submit</Button>
          <p className="text-white">
            Don&apos;t have an Account yet?{" "}
            <em className="font-medium hover:text-blue-500 cursor-pointer">
              Click Register
            </em>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
