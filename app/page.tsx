"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
let access_token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") || "": "";
export default function Home() {
    return !access_token ? (
        <Link
            href={`https://secure.splitwise.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_SPLITWISE_API_TOKEN}`}
        >
            <Button>Login to splitwise </Button>
        </Link>
    ) : (
        <Link href="/welcome">
            <Button>Go to app</Button>
        </Link>
    );
}
