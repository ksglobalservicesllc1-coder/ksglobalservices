"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Users, Settings } from "lucide-react";
import CreateAdminForm from "../../components/manageAdmin/CreateAdminForm";
import DisplayAdmin from "../../components/manageAdmin/DisplayAdmin";

export default function ManageAdmin() {
  return (
    <div className=" bg-slate-50/50 p-4 md:p-10 mx-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-2 border-b pb-6">
          <div className="flex items-center gap-2 text-primary">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">
              System Auth
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Team Management
          </h1>
          <p className="text-slate-500 text-base md:text-lg">
            Create, monitor, and remove administrative privileges across your
            team.
          </p>
        </header>

        <Tabs defaultValue="view" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 shadow-sm border">
              <TabsTrigger
                value="view"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" /> View List
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Add Member
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="view" className="mt-0 outline-none">
            <Card className="border-none shadow-md bg-white overflow-hidden">
              <CardContent className="p-0">
                <DisplayAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-0 outline-none">
            <Card className="max-w-2xl mx-auto border-none shadow-md bg-white">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create Team Member</CardTitle>
                <CardDescription>
                  Setup a new profile. They will receive access immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateAdminForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
