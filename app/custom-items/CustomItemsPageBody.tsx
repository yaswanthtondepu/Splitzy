"use client";
import SearchBar from "../../components/searchbar";
import Items from "../../components/Items";
import PageSourceInput from "../../components/PageSourceInput";
import { Separator } from "@/components/ui/separator";
import { PageContext, PageContextType } from "../../contexts/PageContext";
import { useContext, useEffect, useState } from "react";
import TotalBox from "../../components/TotalBox";
import { useRouter } from "next/navigation";
import GlobalTaxBox from "@/components/GlobalTaxBox";
import { Button } from "@/components/ui/button";

export default function CustomItemsPageBody() {
    const { itemsState } = useContext<PageContextType>(PageContext);
    let access_token =
        typeof window !== "undefined"
            ? window.localStorage.getItem("access_token") || ""
            : "";
    const router = useRouter();
    if (!access_token) {
        window.alert("Please login to continue");

        router.push("/");
    }
    return (
        <div className="flex flex-1">
            <div className="pl-10 flex-1  ">
                <div>
                    <Button onClick={()=>{
                        router.push("/welcome");
                    }}>Back to Welcome page</Button>
                    <GlobalTaxBox />
                    <SearchBar />
                    <Items />
                </div>
            </div>
            <Separator orientation="vertical" />

            <TotalBox />
        </div>
    );
}
