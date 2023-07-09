"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {} from "next/router";
import { useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";

export default function Login() {
    const searchParams = useSearchParams();
    const router = useRouter();
    let authorizationCode = searchParams.get("code");

    useEffect(() => {
        if (!authorizationCode) {
            if (localStorage.getItem("access_token")) {
                router.replace("/welcome");
            } else {
                router.replace("/");
            }
        } else {
            axios({
                method: "post",
                url: "/api/v2/login",
                data: {
                    authorizationCode: authorizationCode,
                },
            })
                .then((res) => {
                    console.log(res);
                    localStorage.setItem("access_token", res.data.token);
                    router.replace("/welcome");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {authorizationCode && (
                <div className="items-center flex flex-col  mt-10">
                    <div className="text-xl">
                        Please wait... We are wrapping things up
                    </div>
                    <div>
                        <InfinitySpin width="200" color="#000" />
                    </div>
                </div>
            )}
        </>
    );
}
