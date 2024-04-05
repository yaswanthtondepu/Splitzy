"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import { Card } from "./ui/card";

export function NewItemDialog({
    addNewItem,
}: {
    addNewItem: (name: string, price: number) => void;
}) {
    const [itemName, setItemName] = useState<string>("");
    const [itemPrice, setItemPrice] = useState<number>(0.0);
    const [open, setOpen] = useState<boolean>(false);

    const handleAddItem = () => {
        if (itemName.trim() === "") {
            alert("Item name cannot be empty");
            return;
        }
        if (itemPrice === 0) {
            alert("Item price cannot be zero");
            return;
        }
        setItemName("");
        setItemPrice(0.0);
        setOpen(false);
        addNewItem(capitalizeFirstLetter(itemName), itemPrice);
    };
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Card
                    className="w-72 flex justify-center items-center text-6xl cursor-pointer text-gray-400 min-h-[300px]    
                 hover:text-green-700 hover:text-8xl hover:transition-all"
                >
                    +
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Custom Item</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 ">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Item Name
                        </Label>
                        <Input
                            autoComplete="off"
                            value={itemName}
                            onChange={(event) =>
                                setItemName(event.target.value)
                            }
                            id="name"
                            className="col-span-3"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Item Price
                        </Label>
                        <Input
                            type="number"
                            autoComplete="off"
                            value={itemPrice}
                            onChange={(event) =>
                                setItemPrice(parseFloat(event.target.value))
                            }
                            id="name"
                            className="col-span-3"
                            required
                        />
                    </div>
                    {itemPrice < 0 && (
                        <div className="text-xs text-red-500">
                            Are you sure you want the price megative?
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleAddItem}>Add Item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
