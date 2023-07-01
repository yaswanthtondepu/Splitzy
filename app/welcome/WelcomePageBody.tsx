import SearchBar from "../../components/searchbar";
import WalmartItems from "../../components/walmartItems";
import PageSourceInput from "../../components/PageSourceInput";
import { Separator } from "@/components/ui/separator";
import { PageContext, PageContextType } from "../../contexts/PageContext";
import { useContext, useEffect, useState } from "react";
import TotalBox from "../../components/TotalBox";

export default function WelcomePageBody() {
    const { itemsState } = useContext<PageContextType>(PageContext);

    return (
        <div className="flex flex-1">
            <div className="px-20 mt-20 flex-1  ">
                {/* <SearchBar />    */}
                {itemsState.length > 0 ? (
                    <div>
                        <SearchBar />
                        <WalmartItems />
                    </div>
                ) : (
                    <PageSourceInput />
                )}
            </div>
            <Separator orientation="vertical" />

            <TotalBox />
        </div>
    );
}
