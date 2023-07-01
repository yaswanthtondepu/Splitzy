"use client";
import { PageProvider } from "../../contexts/PageContext";
import WelcomePageBody from "./WelcomePageBody";
import NavBar from "../../components/NavBar";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    console.log(searchParams.get("key"));
    return (
        <>
            <div className="h-screen flex flex-col">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 pl-24">
                    <h6 className="text-sm font-semibold">
                        Check out new extension
                    </h6>
                </div>
                <PageProvider>
                    <NavBar />

                    <WelcomePageBody />
                </PageProvider>
            </div>

            {/* Body */}
        </>
    );
}
