"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { RootState } from "@/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserProfileButton() {
  const dispatch = useDispatch();
  const router = useRouter();
  // @ts-ignore
  const user = useSelector((state: RootState) => state.auth.user);

  function handleLogout() {
    dispatch(logout());
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Avatar className="h-[1.2rem] w-[1.2rem]">
            <AvatarImage src="" alt={user?.name || "User"} />
            <AvatarFallback className="bg-transparent text-primary">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.email || "user@example.com"}
            </p>
            <p className="text-xxs leading-none text-muted-foreground">
              {user?.name || "User"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/change-password">Change Password</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
