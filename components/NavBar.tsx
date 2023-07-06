"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
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
import { useContext } from "react";
import { PageContext, PageContextType } from "@/contexts/PageContext";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/backendrequests";
export default function NavBar() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();
    const { user, setUser, globalSelectedPersons, setGlobalSelectedPersons } =
        useContext<PageContextType>(PageContext);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        getUser()
            .then((data: any) => {
                console.log(data);
                const user = {
                    name:
                        (data.first_name ?? "") + " " + (data.last_name ?? ""),
                    id: data.id,
                    image: data.picture?.medium,
                };
                setUser(user);
                setGlobalSelectedPersons([...globalSelectedPersons, user]);
            })
            .catch((err) => {
                console.log(err);
            });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const handleLogout = () => {
        window.localStorage.removeItem("access_token");
        router.replace("/");
    };
    return (
        <div
            className={`bg-white p-4  sticky z-10 top-0  left-0 right-0 text-center border-b align-center items-center flex justify-center ${
                scrollPosition > 0
                    ? " backdrop-blur-sm bg-white/75 border-b-2  backdrop-filter"
                    : ""
            } `}
        >
            <Image
                className="absolute left-4"
                src={"/walmart-icon.svg"}
                alt="Walmart Logo"
                width={50}
                height={50}
            />
            <Link href={"/"}>
                <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Walmart split
                </h2>
            </Link>

            <div
                className="absolute cursor-pointer right-4 flex flex-row items-center "
                onMouseOver={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
            >
                <Avatar>
                    <AvatarImage src={user?.image} alt="NOne" />
                    <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
                <h6 className="ml-2">Hello, {user?.name}</h6>
                {showMenu && (
                    <div className="absolute right-2 top-10">
                        <div className="bg-[#3e3d3d] px-5 py-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Logout</Button>
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
                                        <Button
                                            type="submit"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
