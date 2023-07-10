import React from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const UserOptionsMenu = ({
    setShowMenu,
    handleLogout,
}: {
    setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogout: () => void;
}) => {
    return (
        <div className="bg-[#1e2121] border border-solid  py-2 text-white w-44 rounded-md shadow-md">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="flex flex-row cursor-pointer hover:bg-[#424343] relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        <LogOut className="mr-2" />
                        <span>Logout</span>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to logout?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => setShowMenu(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserOptionsMenu;
