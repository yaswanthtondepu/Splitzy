"use client";
import { PageProvider } from "../../contexts/PageContext";
import NavBar from "../../components/NavBar";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, TOP_ACCESS_USER_ROLES, USER_ROLE } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useLayoutEffect, useState } from "react";
import { getUserRole } from "@/lib/backendrequests";

export default function Page() {
    const searchParams = useSearchParams();

    const router = useRouter();
    const stores = [
        {
            value: "walmart",
            label: "Walmart",
        },
        {
            value: "custom",
            label: "Add Custom Items",
        },
    ];
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [userRole, setUserRole] = useState<USER_ROLE>("user");

    let access_token =
        typeof window !== "undefined"
            ? window.localStorage.getItem("access_token") || ""
            : "";
    if (!access_token) {
        alert("Please login to continue");

        router.push("/");
    }

    function handleSelectStore() {
        if (value === "walmart") {
            router.push("/walmart");
        }
        if (value === "custom") {
            router.push("/custom-items");
        }
        if (value === "") {
            alert("Please select a store to continue");
            return;
        }
    }

    useLayoutEffect(() => {
        getUserRole(router)
            .then((data: any) => {
                setUserRole(data.role);
            })
            .catch((err: any) => {
                console.error("Error fetching user role", err);
            });
    }, [router]);

    return (
        <>
            <div className="h-screen flex flex-col">
                <PageProvider>
                    <NavBar />

                    <div className="px-5">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="mt-2 text-4xl">Welcome,</div>

                                <div className="pt-2 text-xl">
                                    Please choose one of the options below to
                                    get started
                                </div>
                            </div>

                            <div>
                                <Button
                                    onClick={() => router.push("/expenses")}
                                    className="px-5"
                                >
                                    Expenses
                                </Button>
                            </div>
                        </div>

                        <div className="pt-10 text-center">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[200px] justify-between border-neutral -500"
                                    >
                                        {value
                                            ? stores.find(
                                                  (store) =>
                                                      store.value === value
                                              )?.label
                                            : "Select stores..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Search stores..." />
                                        <CommandEmpty>
                                            No store found.
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {stores.map((store) => (
                                                <CommandItem
                                                    key={store.value}
                                                    value={store.value}
                                                    onSelect={(
                                                        currentValue
                                                    ) => {
                                                        setValue(
                                                            currentValue ===
                                                                value
                                                                ? ""
                                                                : currentValue
                                                        );
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value ===
                                                                store.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {store.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="pt-10 text-center">
                            <Button onClick={handleSelectStore}>Submit</Button>
                        </div>
                    </div>
                </PageProvider>
                {TOP_ACCESS_USER_ROLES.includes(userRole) && (
                    <div className="mt-20 mx-5">
                        <div>
                            <Button
                                onClick={() =>
                                    router.push("/admin/manage-user-roles")
                                }
                            >
                                Manage User Roles
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
