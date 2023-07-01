// This file is used to define the types of the data that we are going to use in our application.
import React from "react";
export interface Item {
    name: string;
    image: string;
    price: string;
}

export interface Person {
    name: string;
    id: number;
}

export interface ItemState {
    item: Item;
    selectedPersons: Person[];
}

export type PageContextType = {
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    globalSelectedPersons: Person[];
    setGlobalSelectedPersons: React.Dispatch<React.SetStateAction<Person[]>>;
};

export interface Expense {
    person: Person;
    amount: number;
}

export type Payment =
    | {
          person: Person;
          amount: string;
      }
    | {};
