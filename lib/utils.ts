import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ItemState } from "@/interfaces/interfaces";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// export function individualExpenses(itemState: ItemState[]) {
//     const totalExpenses: Expense[] = [];
//     itemState.forEach((itemState) => {
//         const { item, selectedPersons } = itemState;
//         selectedPersons.forEach((person) => {
//             if (
//                 !totalExpenses.some((expense) => expense.person === person.name)
//             ) {
//                 totalExpenses.push({
//                     person: person.name,
//                     amount: 0,
//                 });
//             }
//         });

//         const price = parseFloat(
//             (
//                 parseFloat(item.price) +
//                 (parseFloat(item.price) * itemState.tax) / 100
//             ).toFixed(2)
//         );
//         const splits = splitEqual(price, selectedPersons.length);

//         totalExpenses.sort((a, b) => a.amount - b.amount);
//         totalExpenses.forEach((expense, idx) => {
//             if (
//                 selectedPersons.some((person) => person.name === expense.person)
//             ) {
//                 expense.amount += parseFloat(splits[0].toFixed(2));
//                 splits.shift();
//             }
//         });
//     });
//     totalExpenses.sort((a, b) => a.person.localeCompare(b.person));
//     totalExpenses.forEach((expense) => {
//         expense.amount = parseFloat(expense.amount.toFixed(2));
//     });
//     return totalExpenses;
// }

// function splitEqual(price: number, quantity: number) {
//     const ans = [];
//     const transformedprice = Math.round(price * 100);
//     let individualprice = Math.floor(transformedprice / quantity);
//     for (let i = 0; i < quantity; i++) {
//         ans.push(individualprice);
//     }
//     const extraprice = transformedprice - individualprice * quantity;
//     for (let i = 0; i < extraprice; i++) {
//         ans[i] += 1;
//     }
//     return ans.map((price) => price / 100);
// }
