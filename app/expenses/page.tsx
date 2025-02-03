"use client";
import NavBar from "@/components/NavBar";
import { PageProvider } from "@/contexts/PageContext";
import { getExpenses } from "@/lib/backendrequests";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";

export default function Page() {
    const router = useRouter();

    const [accessToken, setAccessToken] = useState("");
    const [userId, setUserId] = useState<string | number | undefined>(
        undefined
    );

    useEffect(() => {
        const token = window.localStorage.getItem("access_token") || "";
        setAccessToken(token);
        if (token === "") {
            router.push("/login");
        }
        const user = window.localStorage.getItem("user");
        if (user) {
            setUserId(JSON.parse(user).id);
        }
    }, [router]);

    const [expenses, setExpenses] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allLoading, setAllLoading] = useState(false);
    const [limit, setLimit] = useState(100);
    const [offset, setOffset] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch expenses for the current page when no search is active
    useEffect(() => {
        if (!searchQuery && accessToken) {
            setLoading(true);
            const fetchExpenses = async () => {
                try {
                    const response = await getExpenses(router, limit, offset);
                    setExpenses(response);
                } catch (error) {
                    console.error("Error fetching expenses", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchExpenses();
        }
    }, [limit, offset, router, searchQuery, accessToken]);

    // When a search query is active, fetch all expenses to search across everything
    useEffect(() => {
        if (searchQuery && accessToken) {
            setAllLoading(true);
            const fetchAllExpenses = async () => {
                let offsetLocal = 0;
                let fetchedExpenses: any = [];
                let shouldContinue = true;
                while (shouldContinue) {
                    try {
                        const response = await getExpenses(
                            router,
                            limit,
                            offsetLocal
                        );
                        if (response.length > 0) {
                            fetchedExpenses = [...fetchedExpenses, ...response];
                            offsetLocal += limit;
                        } else {
                            shouldContinue = false;
                        }
                    } catch (error) {
                        console.error("Error fetching all expenses", error);
                        shouldContinue = false;
                    }
                }
                setAllExpenses(fetchedExpenses);
                setAllLoading(false);
            };
            fetchAllExpenses();
        }
    }, [searchQuery, router, limit, accessToken]);

    // Debounce the search input to reduce rapid state updates
    const handleSearch = debounce((query) => setSearchQuery(query), 300);

    // Filter the data based on search query first, then filter out expenses that do not include the current user.
    const filteredExpenses = (
        searchQuery
            ? allExpenses.filter((expense: any) =>
                  expense.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
              )
            : expenses
    ).filter((expense: any) =>
        expense.users?.some((userItem: any) => userItem.user_id === userId)
    );

    const handleNextPage = () => {
        if (!searchQuery) {
            setOffset((prevOffset) => prevOffset + limit);
        }
    };

    const handlePreviousPage = () => {
        if (!searchQuery) {
            setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
        }
    };

    return (
        <>
            <PageProvider>
                <NavBar />
                <div className="min-h-screen bg-gray-100">
                    <div className="max-w-6xl mx-auto py-8">
                        <div className="flex">
                            <div>
                                <Button
                                    onClick={() => {
                                        router.push("/welcome");
                                    }}
                                >
                                    Back to Home
                                </Button>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-semibold text-center mb-6">
                                    Expenses Dashboard
                                </h1>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                <input
                                    type="text"
                                    placeholder="Search expenses..."
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    className="w-full sm:w-1/3 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black transition-all mb-4 sm:mb-0"
                                />
                                {!searchQuery && (
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={handlePreviousPage}
                                            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={offset === 0}
                                        >
                                            Previous
                                        </button>
                                        <span className="font-medium">
                                            Page {offset / limit + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleNextPage}
                                            className="px-4 py-2 bg-black text-white rounded"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>

                            {(loading || (searchQuery && allLoading)) && (
                                <div className="flex justify-center items-center py-10">
                                    <InfinitySpin width="200" color="#000" />
                                </div>
                            )}

                            {!(loading || (searchQuery && allLoading)) &&
                                filteredExpenses.length === 0 && (
                                    <p className="text-center text-gray-500">
                                        No expenses found.
                                    </p>
                                )}

                            {!(loading || (searchQuery && allLoading)) &&
                                filteredExpenses.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-blue-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Cost
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Created By
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        Users
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredExpenses.map(
                                                    (expense: any) => (
                                                        <tr
                                                            key={expense.id}
                                                            className={`${
                                                                expense.deleted_at !==
                                                                null
                                                                    ? "bg-red-100"
                                                                    : "hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {
                                                                    expense.description
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                ${expense.cost}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {new Date(
                                                                    expense.date
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {
                                                                    expense
                                                                        .created_by
                                                                        .first_name
                                                                }{" "}
                                                                {
                                                                    expense
                                                                        .created_by
                                                                        .last_name
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {expense.users.map(
                                                                    (
                                                                        user: any
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                user.user_id
                                                                            }
                                                                            className="mb-2"
                                                                        >
                                                                            <span className="font-semibold">
                                                                                {
                                                                                    user
                                                                                        .user
                                                                                        .first_name
                                                                                }{" "}
                                                                                {user
                                                                                    .user
                                                                                    .last_name ||
                                                                                    ""}
                                                                            </span>
                                                                            {user.paid_share >
                                                                                0 && (
                                                                                <div className="text-green-600 text-xs">
                                                                                    Paid:{" "}
                                                                                    {
                                                                                        user.paid_share
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                            {user.owed_share >
                                                                                0 && (
                                                                                <div className="text-red-600 text-xs">
                                                                                    Owed:{" "}
                                                                                    {
                                                                                        user.owed_share
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </PageProvider>
        </>
    );
}
