import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterOrganization } from "./registerorganization";
import { RegisterStudent } from "./registerstudent";
import { RegisterTeacher } from "./registerteacher";

const RegisterPage = () => {
  return (
    <div>
      <Tabs defaultValue="teacher" className="w-full pt-2">
        <TabsList className="w-full bg-transparent flex flex-col">
          <div className="flex w-full">
            <TabsTrigger
              className="w-full rounded-md text-white"
              value="teacher"
            >
              Teacher
            </TabsTrigger>
            <TabsTrigger
              className="w-full rounded-md text-white"
              value="student"
            >
              Student
            </TabsTrigger>
            <TabsTrigger
              className="w-full rounded-md text-white"
              value="organization"
            >
              Organization
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="teacher">
          <RegisterTeacher />
        </TabsContent>
        <TabsContent value="student">
          <RegisterStudent />
        </TabsContent>
        <TabsContent value="organization">
          <RegisterOrganization />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegisterPage;
