"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  conAuth,
  conDatabase,
  conStorage,
} from "@/config/firebase/firebaseConfig";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React from "react";
import { FileCheck2, Paperclip, Send } from "lucide-react";

type User = {
  userID: string;
  userFullName: string;
  userEmail: string;
};

type Message = {
  userID: string;
  userFullName: string;
  userEmail: string;
  text: string;
  sentDate: Date;
  sentBy: string;
  attachmentURL?: string;
};

export const ChatBox = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [chatWithUserData, setChatWithUserData] = useState<User | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = conAuth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        console.error("No user authenticated");
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(conDatabase, `users/${uid}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as User;
        setUserData(userData);
      } else {
        console.error("User document does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSearch = async (): Promise<void> => {
    try {
      const q = query(
        collection(conDatabase, "users"),
        where("userEmail", "==", searchEmail)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const chatWithUserData = querySnapshot.docs[0].data() as User;
        setChatWithUserData(chatWithUserData);
        setSearchEmail("");
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userData || !chatWithUserData || !chatRoomId) return;

      const q = query(
        collection(conDatabase, "chats", chatRoomId, "messages"),
        orderBy("sentDate")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
          messages.push(doc.data() as Message);
        });
        setChatHistory(messages);
      });

      return () => unsubscribe();
    };
    fetchChatHistory();
  }, [userData, chatWithUserData, chatRoomId]);

  useEffect(() => {
    const checkChatRoom = async () => {
      try {
        if (!userData || !chatWithUserData) return;

        const existingChatQuery = query(
          collection(conDatabase, "chats"),
          where("participants", "array-contains-any", [
            userData.userID,
            chatWithUserData.userID,
          ])
        );

        const existingChatSnapshot = await getDocs(existingChatQuery);
        let foundChatRoomId: string | null = null;

        if (!existingChatSnapshot.empty) {
          existingChatSnapshot.forEach((chatDoc) => {
            foundChatRoomId = chatDoc.id;
          });
        }

        if (!foundChatRoomId) {
          // Create a new chat room
          const newChatRef = await addDoc(collection(conDatabase, "chats"), {
            participants: [userData.userID, chatWithUserData.userID],
            createdAt: new Date(),
          });
          foundChatRoomId = newChatRef.id;
        }

        setChatRoomId(foundChatRoomId);
      } catch (error) {
        console.error("Error checking or creating chat room:", error);
      }
    };
    checkChatRoom();
  }, [userData, chatWithUserData]);

  const handleSendMessage = async () => {
    if (!userData || !chatWithUserData || !chatRoomId) return;

    try {
      if (attachment) {
        // Uploading attachment
        const storageRef = ref(conStorage, attachment.name);
        const uploadTask = uploadBytesResumable(storageRef, attachment);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.error("Error uploading file:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const chatRef = collection(
              conDatabase,
              "chats",
              chatRoomId,
              "messages"
            );
            await addDoc(chatRef, {
              userID: userData.userID,
              userFullName: userData.userFullName,
              userEmail: userData.userEmail,
              text: newMessage,
              sentDate: new Date(),
              sentBy: userData.userID,
              attachmentURL: downloadURL,
            });

            setAttachment(null);
          }
        );
      }

      if (newMessage.trim() !== "") {
        const chatRef = collection(
          conDatabase,
          "chats",
          chatRoomId,
          "messages"
        );
        await addDoc(chatRef, {
          userID: userData.userID,
          userFullName: userData.userFullName,
          userEmail: userData.userEmail,
          text: newMessage,
          sentDate: new Date(),
          sentBy: userData.userID,
        });

        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getAttachmentType = (attachmentURL: string): string => {
    const extension = attachmentURL.split(".").pop()?.toUpperCase();
    switch (extension) {
      case "PNG":
        return "Attachment (PNG)";
      case "PDF":
        return "Attachment (PDF)";
      case "DOC":
      case "DOCX":
        return "Attachment (Word Document)";
      case "XLS":
      case "XLSX":
        return "Attachment (Excel Sheet)";
      default:
        return "Attachment";
    }
  };

  const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setAttachment(file);
  };

  return (
    <div className="w-full">
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex space-x-3 pb-5">
          <Input
            placeholder={"Search by email"}
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2 mb-4" />
        <div className="flex items-center bg-slate-200 rounded-md p-2">
          {userData ? (
            <h1 className="text-xl font-semibold pr-20">
              {chatWithUserData?.userFullName}
            </h1>
          ) : (
            <p>Search Chat</p>
          )}
        </div>
        <div>
          <div className="h-64 overflow-y-auto px-4 py-2">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.userID === userData?.userID
                    ? "items-end"
                    : "items-start"
                } mb-2`}
              >
                <p className="text-[10px] text-gray-500">
                  {message.userID === userData?.userID
                    ? "You"
                    : chatWithUserData?.userFullName}
                </p>
                {message.attachmentURL ? (
                  <a
                    href={message.attachmentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-blue-100 rounded-lg p-2"
                  >
                    <button className="flex items-center bg-blue-100 rounded-lg p-2">
                      <FileCheck2 />
                      <span className="text-xs text-gray-400 ml-1">
                        ({getAttachmentType(message.attachmentURL)})
                      </span>
                    </button>
                  </a>
                ) : (
                  <p
                    className={`inline-block px-3 py-1 rounded-lg text-sm ${
                      message.userID === userData?.userID
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="py-2 flex items-center">
            <Input
              type="text"
              placeholder="Type a message"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleAttachFile}
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className={`text-black px-4 py-1 rounded-lg hover:text-gray-500 focus:outline-none focus:ring focus:border-blue-500 ${
                attachment ? "bg-green-500" : ""
              }`}
            >
              <Paperclip className="text-blue-500" />
            </Button>
            <Button
              className="bg-transparent text-blue-500 px-4 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
              onClick={handleSendMessage}
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
