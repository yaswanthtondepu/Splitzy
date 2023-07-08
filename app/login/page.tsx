"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {} from "next/router";
import { useEffect } from "react";

export default function Login() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        axios
            .post(`${process.env.NEXT_PUBLIC_API_URL}/v2/login`, {
                authorizationcode: searchParams.get("code"),
            })
            .then((res) => {
                console.log(res);
                localStorage.setItem("access_token", res.data.token);
                router.push("/welcome");
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <p>Please wait... We are wrapping things up</p>;
}
