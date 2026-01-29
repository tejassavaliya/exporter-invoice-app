"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess("User created successfully");
        setFormData({ name: "", email: "", password: "", role: "USER" });
        fetchUsers();
      } else {
        const msg = await res.text();
        setError(msg || "Failed to create user");
      }
    } catch (err) {
        setError("An error occurred");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Create User Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new user to the system.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreate}>
            <CardContent className="space-y-4">
               {error && <div className="text-red-500 text-sm">{error}</div>}
               {success && <div className="text-green-500 text-sm">{success}</div>}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="******"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={creating} className="w-full">
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Users</CardTitle>
            <CardDescription>List of all users in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                                <div className="font-medium">{user.name || "No Name"}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                <div className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-1">
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">No users found</div>
                    )}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
