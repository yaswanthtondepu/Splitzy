import React, { useContext, useEffect } from "react";
import {
    ItemsState,
    PageContext,
    PageContextType,
    Person,
} from "../contexts/PageContext";
import { Button } from "./ui/button";
import { CommitSplitDialog } from "./CommitSplitDialog";

export default function TotalBox() {
    const {
        user,
        itemsState,
        globalSelectedPersons,
        atLeastOnePersonSelected,
    } = useContext<PageContextType>(PageContext);
    const expenses = individualExpenses(itemsState);
    console.log(expenses);
    return (
        <div
            className={` transition-all ${
                atLeastOnePersonSelected ? "w-72 p-4" : "w-0 p-0"
            }`}
        >
            <div className="font-bold mb-4 ">Overall Expenses</div>
            {expenses.map((expense) => {
                // console.log(allPersons);
                return (
                    <div key={expense.person.id} className="flex">
                        {" "}
                        <div className="flex-1">
                            {" "}
                            {expense.person.id === user?.id
                                ? "You"
                                : expense.person.name}{" "}
                        </div>
                        <div className="text-gray-600 font-bold ">
                            {" "}
                            {expense.amount}
                        </div>
                    </div>
                );
            })}
            <div className="flex ">
                <div key="total" className="font-bold  flex-1">
                    Total
                </div>{" "}
                <div className="font-bold">
                    {parseFloat(
                        expenses
                            .reduce(
                                (accumulator, expense) =>
                                    accumulator + expense.amount,
                                0
                            )
                            .toFixed(2)
                    )}
                </div>
            </div>
            <CommitSplitDialog expenses={expenses} />
        </div>
    );
}

interface Expense {
    person: Person;
    amount: number;
}
function individualExpenses(itemState: ItemsState[]) {
    const totalExpenses: Expense[] = [];
    itemState.forEach((itemState) => {
        const { item, selectedPersons } = itemState;
        selectedPersons.forEach((person) => {
            if (
                !totalExpenses.some(
                    (expense) => expense.person.id === person.id
                )
            ) {
                totalExpenses.push({
                    person: person,
                    amount: 0,
                });
            }
        });

        const price = parseFloat(
            (
                parseFloat(item.price) +
                (parseFloat(item.price) * itemState.tax) / 100
            ).toFixed(2)
        );
        const splits = splitEqual(price, selectedPersons.length);

        totalExpenses.sort((a, b) => a.amount - b.amount);
        totalExpenses.forEach((expense, idx) => {
            if (
                selectedPersons.some(
                    (person) => person.name === expense.person.name
                )
            ) {
                expense.amount += parseFloat(splits[0].toFixed(2));
                splits.shift();
            }
        });
    });
    totalExpenses.sort((a, b) => a.person.name.localeCompare(b.person.name));
    totalExpenses.forEach((expense) => {
        expense.amount = parseFloat(expense.amount.toFixed(2));
    });
    return totalExpenses;
}

function splitEqual(price: number, quantity: number) {
    const ans = [];
    const transformedprice = Math.round(price * 100);
    let individualprice = Math.floor(transformedprice / quantity);
    for (let i = 0; i < quantity; i++) {
        ans.push(individualprice);
    }
    const extraprice = transformedprice - individualprice * quantity;
    for (let i = 0; i < extraprice; i++) {
        ans[i] += 1;
    }
    return ans.map((price) => price / 100);
}
