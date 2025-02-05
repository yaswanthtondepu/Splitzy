import { ItemsState } from "@/contexts/PageContext";
import { Expense, ItemState } from "@/interfaces/interfaces";
import { Person, Payment } from "@/interfaces/interfaces";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { commentBuilder } from "./utils";
import exp from "constants";

export const parseTransaction = (
    description: string,
    expenses: Expense[],
    individualPayments: Payment[],
    itemsState: ItemsState[]
) => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const expense: any = {
        cost: total,
        description: description,
        details: commentBuilder(description, itemsState),
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

    return expense;
};

export const commitSplit = async (
    description: string,
    expenses: Expense[],
    individualPayments: Payment[],
    itemsState: ItemsState[]
) => {
    const expense = parseTransaction(
        description,
        expenses,
        individualPayments,
        itemsState
    );
    console.log(expense);
    const res = await fetch(`/api/v2/create_expense`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            token: get_access_token(),
        },
        body: JSON.stringify({
            expense: expense,
        }),
    });
    return res.json();
};

export const getFriends = async (router: AppRouterInstance) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.replace("/");
    }
    const res = await fetch(`/api/v2/get_friends`, {
        method: "POST",
        headers: {
            token: access_token,
            contentType: "application/json",
        },
        body: JSON.stringify({}),
    });
    return res.json();
};

export const getGroups = async (router: AppRouterInstance) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.replace("/");
    }
    const res = await fetch(`/api/v2/get_groups`, {
        method: "POST",
        headers: {
            token: access_token,
            contentType: "application/json",
        },
        body: JSON.stringify({}),
    });
    return res.json();
};

export const getUser = async (router: AppRouterInstance) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.push("/");
    }
    const res = await fetch(`/api/v2/get_current_user`, {
        method: "POST",
        headers: {
            token: access_token,
        },
        body: JSON.stringify({}),
    });
    return res.json();
};

//get user role
export const getUserRole = async (router: AppRouterInstance) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.push("/");
    }
    const res = await fetch(`/api/v2/get_user_role`, {
        method: "POST",
        headers: {
            token: access_token,
            contentType: "application/json",
        },
        body: JSON.stringify({}),
    });
    return res.json();
};

// Get all users
export const getAllUsers = async (router: AppRouterInstance) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.push("/");
        return;
    }
    const res = await fetch(`/api/v2/get_all_users`, {
        method: "GET",
        headers: {
            token: access_token,
            contentType: "application/json",
        },
    });

    return res.json();
};

// Update user role
export const updateUserRole = async (
    router: AppRouterInstance,
    _id: string,
    userId: string,
    newRole: string
) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.push("/");
        return;
    }
    const res = await fetch(`/api/v2/update_user_role`, {
        method: "PUT",
        headers: {
            token: access_token,
            contentType: "application/json",
        },
        body: JSON.stringify({ _id, role: newRole }),
    });

    return res.json();
};

export const getExpenses = async (
    router: AppRouterInstance,
    limit: number,
    offset: number
) => {
    let access_token = get_access_token();
    if (!access_token) {
        alert("Login expired. Please login again");
        router.push("/");
    }
    const res = await fetch(`/api/v2/get_expenses`, {
        method: "POST",
        headers: {
            token: access_token,
        },
        body: JSON.stringify({ limit, offset }),
    });
    return res.json();
};

function get_access_token() {
    return typeof window !== "undefined"
        ? window.localStorage.getItem("access_token") || ""
        : "";
}
