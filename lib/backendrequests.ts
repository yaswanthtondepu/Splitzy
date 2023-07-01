import { Expense, ItemState } from "@/interfaces/interfaces";
import { Person, Payment } from "@/interfaces/interfaces";
import axios from "axios";
import { redirect } from "next/navigation";
const getFriends = async () => {
    let access_token = typeof window !== "undefined" ? window.localStorage.getItem("access_token") || "" : "";
     if(!access_token) {
        alert("Login expired. Please login again");
        redirect("/");
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/get_friends`, {
        headers: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkRGF0YSI6ImUwYmNmNTQ1Y2EyNzI3NzJiM2U0MDRkZGMzZjNjNmNiIiwiaWF0IjoxNjg4MDA0ODY4fQ.Pj2hkc-STII1YRFGHZInhboc_IZdmYBaXBcIc7Z7ukc",
        },
    });
    return res.json();
};

export const commitSplit = (
    description: string,
    expenses: Expense[],
    individualPayments: Payment[]
) => {
    console.log({ expenses, individualPayments });
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const expense: any = {
        cost: total,
        description: description,
        details: "comment",
        date: new Date(),
        repeat_interval: "never",
        currency_code: "USD",
        group_id: 0,
    };
    const Transactions: {
        user_id: string;
        paid_share: number;
        owed_share: number;
    }[] = [];

    expenses.forEach((expense) => {
        Transactions.push({
            user_id: expense.person.id.toString(),
            paid_share: 0,
            owed_share: expense.amount,
        });
    });
    individualPayments.forEach((payment) => {
        const existingTransaction = Transactions.find(
            (transaction) =>
                transaction.user_id ===
                (payment as { person: Person }).person.id.toString()
        );

        if (existingTransaction) {
            existingTransaction.paid_share = parseFloat(
                (
                    payment as {
                        amount: string;
                    }
                ).amount
            );
        } else {
            Transactions.push({
                user_id: (payment as { person: Person }).person.id.toString(),
                paid_share: parseFloat((payment as { amount: string }).amount),
                owed_share: 0,
            });
        }
    });
    Transactions.forEach((transaction, idx) => {
        expense[`users__${idx}__user_id`] = transaction.user_id;
        expense[`users__${idx}__paid_share`] = transaction.paid_share;
        expense[`users__${idx}__owed_share`] = transaction.owed_share;
    });

    console.log(expense);
    axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/create_expense`,
        headers: {
            "content-type": "application/json",
        },
        data: {
            expense: expense,
        },
    });
};
