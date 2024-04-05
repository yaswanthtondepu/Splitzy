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

    const[showCustomItems, setShowCustomItems] = useState(false);

    function handleAddCustomItems(){
        setShowCustomItems(true);
    }

    return (
        <div className="flex flex-1">
            <div className="pl-10 flex-1  ">
                {/* <SearchBar />    */}
                {itemsState.length > 0 || showCustomItems ? (
                    <div className="h-[calc(100vh-115px)] overflow-y-auto">
                        <GlobalTaxBox />
                        <SearchBar />
                        <WalmartItems
                            showCustomItems={showCustomItems}
                            setShowCustomItems = {setShowCustomItems}
                        />
                    </div>
                ) : (
                    <div className="px-10 mt-20">
                        <PageSourceInput
                            handleAddCustomItems={handleAddCustomItems}
                        />
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
        <div className="flex flex-col py-5 px-2">
            {isInputFocused ? (
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        value={tax}
                        onChange={(e) => {
                            setTax(parseFloat(e.target.value));
                        }}
                        onBlur={(e) => {
                            if (
                                e.target.value === "" ||
                                parseFloat(e.target.value) < 0 ||
                                parseFloat(e.target.value) > 100 ||
                                isNaN(parseFloat(e.target.value))
                            ) {
                                setTax(0);
                            }
                        }}
                        required
                        autoFocus
                        className="w-32"
                    ></Input>
                    <Save
                        className="cursor-pointer h-8 w-8"
                        onClick={() => {
                            setInputFocused(false);
                            if (
                                tax === undefined ||
                                tax === null ||
                                tax < 0 ||
                                tax > 100 ||
                                isNaN(tax)
                            ) {
                                setGlobalTax(0);
                            } else {
                                setGlobalTax(tax);
                            }
                        }}
                    ></Save>
                </div>
            ) : (
                <div className="flex items-center">
                    <p className="text-2xl mr-4 font-bold">{`Tax Percentage: ${globalTax}`}</p>
                    <Edit
                        className="cursor-pointer"
                        onClick={() => setInputFocused(true)}
                    ></Edit>
                </div>
            )}
        </div>
    );
}
