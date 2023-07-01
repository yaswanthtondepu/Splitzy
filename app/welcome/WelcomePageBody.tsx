import SearchBar from "../../components/searchbar";
import WalmartItems from "../../components/walmartItems";
import PageSourceInput from "../../components/PageSourceInput";
import { Separator } from "@/components/ui/separator";
import { PageContext, PageContextType } from "../../contexts/PageContext";
import { useContext, useEffect, useState } from "react";
import TotalBox from "../../components/TotalBox";
import { useRouter } from "next/navigation";

export default function WelcomePageBody() {
    const { itemsState } = useContext<PageContextType>(PageContext);
    let access_token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") || "" : "";

    if(!access_token){
        alert("Please login again");
        let router = useRouter();
        router.push("/");
    }

    return (
        <div className="flex flex-1">
            <div className="pl-10 flex-1  ">
                {/* <SearchBar />    */}
                {itemsState.length > 0 ? (
                    <div className="h-[calc(100vh-115px)] overflow-y-auto">
                        <SearchBar />
                        <WalmartItems />
                    </div>
                ) : (
                    <div className="px-10 mt-20">
                        <PageSourceInput />
                    </div>
                )}
            </div>
            <Separator orientation="vertical" />

            <TotalBox />
        </div>
    );
}
