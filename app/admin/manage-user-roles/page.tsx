"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    getUserRole,
    getAllUsers,
    updateUserRole,
} from "@/lib/backendrequests";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    TOP_ACCESS_USER_ROLES,
    USER_ROLE,
    ASSIGNABLE_USER_ROLES,
} from "@/lib/utils";

type User = {
    _id: string;
    userId: string;
    role: USER_ROLE;
};

export default function AdminUserRoles() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [adminAccess, setAdminAccess] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState("");
    const [openDialog, setOpenDialog] = useState(false);

    const fetchUsers = useCallback(async () => {
        const data = await getAllUsers(router);
        setUsers(data);
    }, [router]);

    useEffect(() => {
        getUserRole(router).then((data) => {
            if (!data || !TOP_ACCESS_USER_ROLES.includes(data.role)) {
                router.push("/"); // Redirect non-admin users
            } else {
                setAdminAccess(true);
                try {
                    fetchUsers();
                } catch (error) {
                    console.error(error);
                    alert(error);
                }
            }
        });
    }, [fetchUsers, router]);

    const handleRoleChange = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setOpenDialog(true);
    };

    const confirmRoleChange = async () => {
        if (selectedUser) {
            await updateUserRole(
                router,
                selectedUser._id,
                selectedUser.userId,
                newRole
            );
            fetchUsers();
            setOpenDialog(false);
        }
    };

    if (!adminAccess) return null;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex">
                <div>
                    <Button
                        onClick={() => router.push("/welcome")}
                        className="mr-4"
                    >
                        Back
                    </Button>
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-6 text-center">
                        Manage User Roles
                    </h1>
                </div>
            </div>
            <Card>
                <CardContent className="p-4">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-3 text-left">
                                        User Id
                                    </th>
                                    <th className="border p-3 text-center">
                                        Role
                                    </th>
                                    <th className="border p-3 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 &&
                                    users.map((user: User) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border p-3 text-left">
                                                {user.userId}
                                            </td>
                                            <td className="border p-3 text-center capitalize">
                                                {user.role}
                                            </td>
                                            <td className="border p-3 text-center">
                                                <Button
                                                    onClick={() =>
                                                        handleRoleChange(user)
                                                    }
                                                >
                                                    Edit Role
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                    </DialogHeader>
                    <div className="my-4">
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger>
                                {newRole || "Select a role"}
                            </SelectTrigger>
                            <SelectContent>
                                {ASSIGNABLE_USER_ROLES.map((role) => (
                                    <SelectItem
                                        key={role}
                                        value={role}
                                        className="capitalize"
                                    >
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button onClick={confirmRoleChange}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
