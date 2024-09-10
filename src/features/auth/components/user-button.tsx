"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut, Mail, User } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

const UserButton = () => {
    const { signOut } = useAuthActions();
    const { data, isLoading } = useCurrentUser();

    if (isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />
    }

    if (!data) {
        return null;
    }

    const { image, name } = data;

    const avatarFallback = name!.charAt(0).toUpperCase();

    return (
        <div className="flex flex-col items-center gap-4">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none relative">
                    <Avatar className="rounded-md size-10 hover:opacity-75 transition">
                        <AvatarImage alt={name} src={image} className="rounded-md" />
                        <AvatarFallback className="rounded-md bg-rose-400 text-xl text-white">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="right" className="w-60">
                    <DropdownMenuItem className="h-10 w-60 truncate">
                        <User className="size-4 mr-2" />
                        {name}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="h-10 w-60 truncate">
                        <Mail className="size-4 mr-2" />
                        {data?.email}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none relative">
                    <Button
                        variant={"ghost"}
                        className="bg-zinc-200/20 hover:bg-zinc-200/30 rounded-md transition size-10 p-0"
                    >
                        <LogOut className="text-white size-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="right" className="w-60">
                    <DropdownMenuItem onClick={() => signOut()} className="h-10 cursor-pointer">
                        <LogOut className="size-4 mr-2" />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default UserButton