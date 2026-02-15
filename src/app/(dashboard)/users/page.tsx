"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserTable } from "@/components/features/users/user-table";
import { UserForm } from "@/components/features/users/user-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layouts/page-header";

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | undefined>(
    undefined,
  );

  // @ts-ignore
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (reduxUser?.role) {
      setCurrentUserRole(reduxUser.role);
    } else {
      // Fetch from API when Redux state is lost (e.g. after refresh)
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.role) setCurrentUserRole(data.role);
        })
        .catch(() => {});
    }
  }, [reduxUser]);

  function handleSuccess() {
    setIsDialogOpen(false);
    setSelectedUser(null);
    setRefreshKey((prev) => prev + 1);
  }

  function handleEdit(user: any) {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  function handleAdd() {
    setSelectedUser(null);
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" />

      <UserTable
        key={refreshKey}
        currentUserRole={currentUserRole}
        onEdit={handleEdit}
        addButton={
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) setSelectedUser(null);
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedUser ? "Edit User" : "Add New Administrator"}
                </DialogTitle>
              </DialogHeader>
              <UserForm initialData={selectedUser} onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
}
