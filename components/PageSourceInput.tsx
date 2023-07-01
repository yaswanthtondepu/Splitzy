import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useContext } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ItemsState, PageContext } from "../contexts/PageContext";
import parseHtml from "@/lib/parseHtml";

export default function PageSourceInput() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isError, setIsError] = useState(false);
    const { setItemsState } = useContext(PageContext);

    const handleButton = () => {
        const html = textareaRef.current?.value ?? "";
        const items = parseHtml(html);
        if (items.length > 0) {
            // setItems(items);

            const allItemsState: ItemsState[] = items.map((item) => {
                return {
                    item,
                    tax: 0,
                    selectedPersons: [],
                };
            });
            setItemsState(allItemsState);
        } else {
            setIsError(true);
        }
    };

    return (
        <>
            <Alert className={isError ? "" : "hidden"} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    Source code is not valid please Enter a Valid Source Code
                </AlertDescription>
            </Alert>
            <h3 className=" text-2xl font-semibold tracking-tight mt-2 ">
                Welcome,
            </h3>
            <h4 className=" text-md font-normal tracking-tight mb-6  ">
                Paste the{" "}
                <span className="text-pink-500">
                    walmart orders source code
                </span>{" "}
                in the below text box
            </h4>
            <div className="grid w-full gap-2">
                <Textarea
                    onChange={() => {
                        isError ? setIsError(false) : null;
                    }}
                    ref={textareaRef}
                    placeholder="Paste the source here"
                />
                <Button onClick={handleButton}>Submit</Button>
            </div>
        </>
    );
}
