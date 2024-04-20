"use client";

import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/ui/inputwithlabel";

import Link from "next/link";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "@/config/firebase/authentication";

export const RegisterStudent = () => {
  const [fullname, setFullName] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [accountType] = useState<string>("Student");
  const [selectPicture, setSelectPicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (!selectPicture) {
        setError("Please select a profile picture");
        return;
      }
      await createUserWithEmailAndPassword(
        email,
        password,
        fullname,
        accountType,
        selectPicture,
        gradeLevel,
        organizationName
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectPicture(null);
      setError(null);

      alert("User registered successfully.");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="relative">
      <div className="relative z-10 px-20 pt-10 grid gap-5">
        <div className="text-white">
          <h1 className="text-3xl font-bold">Register</h1>
          <p>Create your account by filling out the form below.</p>
        </div>
        <form onSubmit={handleRegister} className="grid gap-3">
          <InputWithLabel
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <InputWithLabel
            label="Grade Level"
            type="text"
            placeholder="Enter grade level"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            required
          />
          <InputWithLabel
            label="Email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputWithLabel
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputWithLabel
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <InputWithLabel
            label="Select Picture"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectPicture(file);
              }
            }}
            required
          />
          <div className="flex space-x-2 text-white pb-5">
            <p>Already have an account?</p>
            <em className="font-medium hover:text-blue-500">Click Login!</em>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};
