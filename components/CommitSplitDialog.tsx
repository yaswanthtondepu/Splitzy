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
import { ReloadIcon } from "@radix-ui/react-icons";
import { PageContext, PageContextType, Person } from "@/contexts/PageContext";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectItem,
    SelectGroup,
    SelectValue,
    SelectLabel,
} from "./ui/select";
import { Trash, Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { commitSplit } from "@/lib/backendrequests";
import { Expense, Payment } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";
import { findItemsTotal } from "@/lib/utils";
import { isNumber } from "tailwind-merge/dist/lib/validators";

export function CommitSplitDialog({ expenses }: { expenses: Expense[] }) {
    const [description, setDescription] = useState<string>("");
    const { globalSelectedPersons, setGlobalSelectedPersons } =
        useContext<PageContextType>(PageContext);
    const [individualPayments, setindividualPayments] = useState<Payment[]>([
        {},
    ]);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const handleCommit = async () => {
        setLoading(true);
        const res = await validate(
            description,
            expenses,
            individualPayments,
            commitSplit
        );
        if (res) {
            if (res.error) {
                alert(res.error);
                setLoading(false);
                return;
            } else {
                alert("Added  successfully You will be redirect to home page");
                setLoading(false);
                router.push("/");
                router.refresh();
                return;
            }
        } else {
            setLoading(false);
            return;
        }
    };
    useEffect(() => {
        const newindividualPayments = individualPayments.filter((payment) => {
            return globalSelectedPersons.some((person) => {
                return person.id === (payment as { person: Person }).person?.id;
            });
        });
        if (newindividualPayments.length === 0) {
            newindividualPayments.push({});
        }
        setindividualPayments(newindividualPayments);

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalSelectedPersons]);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full mt-4"> Add to Splitwise</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Details</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 ">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Description
                        </Label>
                        <Input
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            id="name"
                            className="col-span-3"
                            required
                        />
                    </div>
                </div>
                <h6 className="text-base font-bold">
                    Total: {findItemsTotal(expenses)}
                </h6>
                <h6 className="text-sm font-semibold">Paid By:</h6>

                {/* <div className="">
                        <SelectBox persons={[...globalSelectedPersons]} />
                    </div>
                    <div className="w-40">
                        <Input id="name" className="col-span-1" />
                    </div>

                    <Trash />
                     */}
                <IndividualPaymentManager
                    expenses={expenses}
                    individualPayments={individualPayments}
                    setindividualPayments={setindividualPayments}
                />

                <DialogFooter>
                    {loading ? (
                        <Button disabled>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={handleCommit}>Commit</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const validate = async (
    description: string,
    expenses: Expense[],
    individualPayments: Payment[],
    next: Function
) => {
    if (description.trim() === "") {
        alert("Description cannot be empty");
        return;
    }
    if (expenses.length === 0) {
        alert("No expenses found");
        return;
    }
    if (
        !individualPayments.some(
            (payment) => (payment as { person: Person }).person?.name
        )
    ) {
        alert("Atleast one payer should be selected");
        return;
    }
    return next(description, expenses, individualPayments);
};

function SelectBox({
    persons,
    value,
    onValueChange,
}: {
    persons: Person[];
    value?: string | undefined;
    onValueChange?: ((value: string) => void) | undefined;
}) {
    const payments: {
        name: string;
        amount: number;
    }[] = [];
    const { user } = useContext<PageContextType>(PageContext);
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-40 ">
                <SelectValue placeholder="Select a person" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select a Person</SelectLabel>
                    {persons.map((person) => (
                        <SelectItem
                            key={person.id}
                            value={person.id.toString()}
                        >
                            {person.id === user?.id ? "You" : person.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function IndividualPaymentManager({
    individualPayments,
    setindividualPayments,
    expenses,
}: {
    individualPayments: Payment[];
    setindividualPayments: (individualPayments: Payment[]) => void;
    expenses: Expense[];
}) {
    const { user, globalSelectedPersons, setGlobalSelectedPersons } =
        useContext<PageContextType>(PageContext);
    const remainingPersons = () =>
        globalSelectedPersons.filter((globalPerson) => {
            return !individualPayments.some(
                (individualPayment) =>
                    (individualPayment as { person: Person }).person?.name ===
                    globalPerson.name
            );
        });

    let Total = findItemsTotal(expenses);
    const [remainingAmount, setRemainingAmount] = useState(Total);

    useEffect(() => {

        let addedAmount = 0;
        individualPayments.forEach((payment: any) => {
            addedAmount += parseFloat(payment.amount);
        });
        setRemainingAmount(Total - addedAmount);
    }, [individualPayments, Total]);

    const changeAmount = (index: number, amount: string) => {
        const newindividualPayments = [...individualPayments];

        newindividualPayments[index] = {
            ...newindividualPayments[index],
            amount,
        };
        setindividualPayments(newindividualPayments);
    };
    const changePerson = (index: number, person: Person) => {

        const newindividualPayments = [...individualPayments];
        if (Object.keys(newindividualPayments[index]).length !== 0)
            newindividualPayments[index] = {
                ...newindividualPayments[index],
                person,
            };
        else {
            newindividualPayments[index] = {
                person,
                amount: "0.0",
            };
        }
        setindividualPayments(newindividualPayments);
    };

    const addNewSelectBox = () => {
        setindividualPayments([...individualPayments, {}]);
    };
    const removeSelectBox = (index: number) => {
        const newindividualPayments = [...individualPayments];
        newindividualPayments.splice(index, 1);
        setindividualPayments(newindividualPayments);
    };
    return (
        <>
            <div>
                {individualPayments.map((individualPayment, index) => {
                    return (
                        <div
                            key={index}
                            className="flex justify-between items-center mb-4"
                        >
                            <div className="">
                                <SelectBox
                                    onValueChange={(value) => {
                                        changePerson(
                                            index,
                                            globalSelectedPersons.find(
                                                (person) =>
                                                    person.id.toString() ===
                                                    value
                                            ) as Person
                                        );
                                    }}
                                    {...((
                                        individualPayment as { person: Person }
                                    ).hasOwnProperty("person")
                                        ? {
                                              value: (
                                                  individualPayment as {
                                                      person: Person;
                                                  }
                                              ).person.id.toString(),
                                          }
                                        : {})}
                                    persons={
                                        (
                                            individualPayment as {
                                                person: Person;
                                            }
                                        ).person
                                            ? [
                                                  ...remainingPersons(),
                                                  (
                                                      individualPayment as {
                                                          person: Person;
                                                      }
                                                  ).person,
                                              ]
                                            : [...remainingPersons()]
                                    }
                                />
                            </div>
                            <div className="w-40">
                                <Input
                                    type="number"
                                    id="name"
                                    value={
                                        (
                                            individualPayment as {
                                                amount: number;
                                            }
                                        ).amount
                                    }
                                    onChange={(e) => {
                                        changeAmount(index, e.target.value);
                                    }}
                                    className="col-span-1"
                                />
                            </div>
                            {individualPayments.length > 1 && (
                                <Trash onClick={() => removeSelectBox(index)} />
                            )}
                        </div>
                    );
                })}
                {globalSelectedPersons.length !== individualPayments.length && (
                    <Button onClick={addNewSelectBox} className="w-40 mt-4">
                        <Plus className="mr-2" />
                        Add Person
                    </Button>
                )}
            </div>
            <div>
                {remainingAmount !== 0 && !Number.isNaN(remainingAmount) && (
                    <div className="text-red-500">
                        Remaining Amount: {remainingAmount.toFixed(2)}
                    </div>
                )}
                {remainingAmount === 0 && (
                    <div className="text-green-500">Total balanced. Please continue</div>
                )}
            </div>
        </>
    );
}
