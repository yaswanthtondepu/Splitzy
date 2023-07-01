"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageContext, PageContextType } from "../contexts/PageContext";
import { useContext, useState } from "react";
import { Item, Person } from "../contexts/PageContext";
export default function CardWithForm({
    id,
    item,
    tax,
    persons,
}: {
    id: number;
    item: Item;
    tax: number;
    persons: Person[];
}) {
    const {
        globalSelectedPersons,
        setGlobalSelectedPersons,
        setItemlocalSelectedPersons,
        setItemTax,
        globalTax,
        user,
    } = useContext<PageContextType>(PageContext);
    const { name, image, price } = item;
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [localSelectedPersons, setLocalSelectedPersons] = useState<Person[]>(
        []
    );
    console.log(localSelectedPersons);
    const removeLocalPerson = (globalPerson: Person) => {
        setLocalSelectedPersons(
            localSelectedPersons.filter(
                (person) => person.id !== globalPerson.id
            )
        );
        selectAll && setSelectAll(false);
    };
    const addLocalPerson = (person: Person) => {
        setLocalSelectedPersons([...localSelectedPersons, person]);
    };

    const checkHandler = (checked: boolean) => {
        if (checked) {
            setLocalSelectedPersons([...globalSelectedPersons]);
            setSelectAll(true);
        } else {
            setLocalSelectedPersons([]);
            setSelectAll(false);
        }
    };
    React.useEffect(() => {
        if (selectAll) {
            setLocalSelectedPersons([...globalSelectedPersons]);
        } else {
            const newlocalpersons = localSelectedPersons.filter((person) => {
                return globalSelectedPersons.some(
                    (globalPerson) => globalPerson.id === person.id
                );
            });
            setLocalSelectedPersons(newlocalpersons);
        }
    }, [globalSelectedPersons]);
    React.useEffect(() => {
        console.log(`${name} rendered`);
    });
    React.useEffect(() => {
        setItemlocalSelectedPersons(id, localSelectedPersons);
        localSelectedPersons.length === globalSelectedPersons.length &&
        localSelectedPersons.length !== 0
            ? setSelectAll(true)
            : setSelectAll(false);
    }, [localSelectedPersons]);
    return (
        <Card className="w-72">
            <img className="w-full h-48 object-cover" src={image} alt=""></img>
            <Separator />

            <CardHeader className="pb-2 pt-0">
                <h6 className="mt-4 text-sm font-semibold">{name}</h6>
            </CardHeader>

            <CardContent className="pb-0 pt-2">
                <div className="flex justify-between items">
                    <div className="flex items-center space-x-2 pr-6">
                        <Switch
                            checked={tax > 0 ? true : false}
                            onCheckedChange={(checked) => {
                                checked
                                    ? setItemTax(id, globalTax)
                                    : setItemTax(id, 0);
                            }}
                            id={`${name}_tax`}
                        />
                        <Label htmlFor="airplane-mode">Tax</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={selectAll}
                            onCheckedChange={checkHandler}
                            id={`${name}_select_all`}
                        />
                        <Label htmlFor="airplane-mode">Select All</Label>
                    </div>
                </div>
                <CardTitle className="mt-4">{`$${parseFloat(
                    (
                        parseFloat(price) +
                        (parseFloat(price) * tax) / 100
                    ).toFixed(2)
                )}`}</CardTitle>
            </CardContent>
            {/* <Separator /> */}
            <CardFooter className="flex-wrap mt-4 ">
                {/* <Badge  className="mt-2 mr-2 bg-red-500 ">
                    Arrely v
                </Badge>
                <Badge className="mt-2 mr-2 bg-purple-500">Divya</Badge>

                <Badge className="mt-2 mr-2  bg-blue-500 ">
                    Divya K
                </Badge>
                <Badge  className="mt-2 mr-2 bg-yellow-600">
                    Yashwanth
                </Badge>
                <Badge className="mt-2 mr-2  to-pink-500">
                    Krishna S
                </Badge> */}
                {globalSelectedPersons.map((globalPerson) =>
                    persons.some(
                        (localPerson) => localPerson.id === globalPerson.id
                    ) ? (
                        <Button
                            onClick={() => removeLocalPerson(globalPerson)}
                            key={globalPerson.id}
                            className="mt-2 mr-2"
                        >
                            {globalPerson.id === user?.id
                                ? "You"
                                : globalPerson.name}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => addLocalPerson(globalPerson)}
                            variant={"outline"}
                            key={globalPerson.id}
                            className="mt-2 mr-2"
                        >
                            {globalPerson.id === user?.id
                                ? "You"
                                : globalPerson.name}
                        </Button>
                    )
                )}

                {/* <Badge className="mt-2 mr-2">Likitha</Badge>
                <Badge variant="outline" className="mt-2 mr-2">
                    Yashwanth
                </Badge>
                <Badge
                    onClick={() => {
                        console.log("hello");
                    }}
                    className="mt-2 mr-2"
                >
                    Divya
                </Badge>

                <Badge className="mt-2 mr-2">Deployment</Badge>
                <Badge variant="outline" className="mt-2 mr-2">
                    Yashwanth
                </Badge>
                <Badge className="mt-2 mr-2">Divya</Badge>

                <Badge className="mt-2 mr-2">Deployment</Badge> */}
            </CardFooter>
        </Card>
    );
}
