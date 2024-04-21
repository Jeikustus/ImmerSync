"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { conDatabase } from "@/config/firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

type UserData = {
  userID: string;
  userFullName: string;
  userEmail: string;
  userAccountType: string;
  userAccountStatus: string;
};

const AdminPage = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(conDatabase, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({
          userID: doc.id,
          ...doc.data(),
        })) as UserData[];
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDecline = async (userID: string) => {
    try {
      const userDocRef = doc(conDatabase, "users", userID);
      await updateDoc(userDocRef, { userAccountStatus: "Declined" });
      // Update local state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userID === userID
            ? { ...user, userAccountStatus: "Declined" }
            : user
        )
      );
    } catch (error) {
      console.error("Error declining user:", error);
    }
  };

  const handleApprove = async (userID: string) => {
    try {
      const userDocRef = doc(conDatabase, "users", userID);
      await updateDoc(userDocRef, { userAccountStatus: "Approved" });
      // Update local state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userID === userID
            ? { ...user, userAccountStatus: "Approved" }
            : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white ">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <Table className="shadow-md bg-slate-100  rounded-lg overflow-hidden">
        <TableCaption className="text-white ">
          List of all accounts Registered
        </TableCaption>
        <TableHeader className="bg-gray-700">
          <TableRow>
            <TableHead className="text-white font-bold text-[18px]">
              Full Name
            </TableHead>
            <TableHead className="text-white font-bold text-[18px]">
              Email Address
            </TableHead>
            <TableHead className="text-white font-bold text-[18px]">
              Account Type
            </TableHead>
            <TableHead className="text-white font-bold text-[18px]">
              Status
            </TableHead>
            <TableHead className="text-white font-bold text-[18px]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.userID}
              className="bg-gray-600 text-white hover:text-black"
            >
              <TableCell className="font-medium ">
                {user.userFullName}
              </TableCell>
              <TableCell>{user.userEmail}</TableCell>
              <TableCell>{user.userAccountType}</TableCell>
              <TableCell>{user.userAccountStatus}</TableCell>
              <TableCell>
                {user.userAccountType !== "Admin" ? (
                  <>
                    <Button
                      className="mr-2 bg-red-500 hover:bg-red-600"
                      onClick={() => handleDecline(user.userID)}
                    >
                      Declined
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleApprove(user.userID)}
                    >
                      Approved
                    </Button>
                  </>
                ) : (
                  <Button className="min-w-[200px] bg-blue-500 hover:bg-blue-600">
                    Logout
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPage;
