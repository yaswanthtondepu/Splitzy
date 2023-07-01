"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useContext } from "react";
import { PageContext, PageContextType } from "../contexts/PageContext";
import CardWithForm from "./itemcard";

export default function WalmartItems() {
    const { itemsState } = useContext<PageContextType>(PageContext);
    return (
        <>
            <div className="grid w-full gap-2">
                {itemsState.length > 0 ? (
                    <>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-2 text-pink-500 ">
                            Items Bought: {itemsState.length}
                        </h3>

                        <div className="mt-2 grid grid-cols-4 gap-12 justify-between sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4  ">
                            {itemsState.map((itemState, idx) => (
                                <CardWithForm
                                    key={idx}
                                    id={idx}
                                    item={itemState.item}
                                    tax={itemState.tax}
                                    persons={itemState.selectedPersons}
                                />
                            ))}

                            {/* <CardWithForm />   */}
                        </div>
                    </>
                ) : (
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        No items found
                    </h4>
                )}
            </div>
        </>
    );
}
