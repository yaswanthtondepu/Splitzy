"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import styles from "./app.module.css";
let access_token =
    typeof window !== "undefined"
        ? window.localStorage.getItem("access_token") || ""
        : "";

export default function Home() {
    return (
        <div>
            <div
                className={`bg-white p-4  sticky z-10 top-0  left-0 right-0 text-center border-b align-center items-center flex justify-center `}
            >
                <Image
                    className="absolute left-4 rounded-md"
                    src={"/walmart-split.jpg"}
                    alt="Walmart Split Logo"
                    width={50}
                    height={50}
                />
                <Link href={"/"}>
                    <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Walmart split
                    </h2>
                </Link>
                <div className="absolute right-4 flex">
                    <a
                        className="mr-4"
                        href={"https://github.com/yash1744/walmsplit-next"}
                    >
                        {" "}
                        <Image
                            className="rounded-full lg:mr-6 "
                            src={"/github-icon.svg"}
                            alt="None"
                            width={40}
                            height={40}
                        />
                    </a>

                    {!access_token ? (
                        <a
                            className="cursor-pointer "
                            href={`https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SPLITWISE_API_TOKEN}`}
                        >
                            <Button>Login to splitwise </Button>
                        </a>
                    ) : (
                        <Link className="cursor-pointer" href="/welcome">
                            <Button variant={"outline"}>Go to app</Button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="flex flex-col text-[32px] font-extrabold items-center pt-20 sm:text-[40px] md:text-[56px] lg:text-[76px]  ">
                <span className="text-transparent animate-backgroundClip  bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                    An
                </span>
                <span className="text-transparent animate-backgroundClip  bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                    Easy Way to
                </span>
                <span className="text-transparent animate-backgroundClip  bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500">
                    Manage Walmart Expenses
                </span>
                <h2 className="text-xl text-center font-medium">
                    Effortlessly Split and Share Walmart Expenses via Splitwise
                    directly on the web
                </h2>
                <Button className="mt-4"> Get Started</Button>
            </div>
        </div>
    );
}
