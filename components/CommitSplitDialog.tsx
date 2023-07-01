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

export function CommitSplitDialog({ expenses }: { expenses: Expense[] }) {
    const [description, setDescription] = useState<string>("");
    const { globalSelectedPersons, setGlobalSelectedPersons } =
        useContext<PageContextType>(PageContext);
    const [individualPayments, setindividualPayments] = useState<Payment[]>([
        {},
    ]);
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
                    individualPayments={individualPayments}
                    setindividualPayments={setindividualPayments}
                />

                <DialogFooter>
                    <Button
                        onClick={async () => {
                            console.log("committing");
                            const res = await commitSplit(
                                description,
                                expenses,
                                individualPayments
                            );
                            console.log(res);
                        }}
                    >
                        Commit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
                            key={person.name}
                            value={person.id.toString()}
                        >
                            {person.name}
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
}: {
    individualPayments: Payment[];
    setindividualPayments: (individualPayments: Payment[]) => void;
}) {
    const { globalSelectedPersons, setGlobalSelectedPersons } =
        useContext<PageContextType>(PageContext);
    const remainingPersons = () =>
        globalSelectedPersons.filter((globalPerson) => {
            return !individualPayments.some(
                (individualPayment) =>
                    (individualPayment as { person: Person }).person?.name ===
                    globalPerson.name
            );
        });
    useEffect(() => {
        console.log(remainingPersons());
        console.log(individualPayments);
    });

    const changeAmount = (index: number, amount: string) => {
        const newindividualPayments = [...individualPayments];

        newindividualPayments[index] = {
            ...newindividualPayments[index],
            amount,
        };
        setindividualPayments(newindividualPayments);
    };
    const changePerson = (index: number, person: Person) => {
        console.log("running");
        console.log(person);
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
                                                person.id.toString() === value
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
                                    (individualPayment as { amount: number })
                                        .amount
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
    );
}
