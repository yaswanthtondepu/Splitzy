"use client";
import SearchBar from "../../components/searchbar";
import WalmartItems from "../../components/walmartItems";
import PageSourceInput from "../../components/PageSourceInput";
import { Separator } from "@/components/ui/separator";
import { PageContext, PageContextType } from "../../contexts/PageContext";
import { useContext, useEffect, useState } from "react";
import TotalBox from "../../components/TotalBox";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Edit, Save } from "lucide-react";

export default function WelcomePageBody() {
    const { itemsState } = useContext<PageContextType>(PageContext);
    let access_token =
        typeof window !== "undefined"
            ? window.localStorage.getItem("access_token") || ""
            : "";
    let router = useRouter();
    if (!access_token) {
        window.alert("Please login to continue");

        router.push("/");
    }

    return (
        <div className="flex flex-1">
            <div className="pl-10 flex-1  ">
                {/* <SearchBar />    */}
                {itemsState.length > 0 ? (
                    <div className="h-[calc(100vh-115px)] overflow-y-auto">
                        <GlobalTaxBox />
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

function GlobalTaxBox() {
    const { globalTax, setGlobalTax } =
        useContext<PageContextType>(PageContext);
    const [tax, setTax] = useState(globalTax);
    const [isInputFocused, setInputFocused] = useState(false);
    return (
        <div className="flex flex-col">
            {isInputFocused ? (
                <div className="flex ">
                    <Input
                        type="number"
                        value={tax}
                        onChange={(e) => {
                            if (e.target.value.length > 0) {
                                setTax(parseFloat(e.target.value));
                            } else {
                                setTax(0);
                            }
                        }}
                        required
                    ></Input>
                    <Save
                        className="cursor-pointer"
                        onClick={() => {
                            setInputFocused(false);
                            if (tax === undefined || tax === null || tax < 0 || tax > 100 || isNaN(tax)) {
                                setGlobalTax(0);
                            } else {
                                setGlobalTax(tax);
                            }
                        }}
                    ></Save>
                </div>
            ) : (
                <div className="flex ">
                    <p className="text-2xl mr-4 font-bold">{`Global Tax: ${globalTax}`}</p>
                    <Edit
                        className="cursor-pointer"
                        onClick={() => setInputFocused(true)}
                    ></Edit>
                </div>
            )}
        </div>
    );
}
