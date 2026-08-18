"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Search,
  Grid,
  List,
  Mail,
  Briefcase,
  MapPin,
  ChevronRight,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Users,
  Building2,
  Globe2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UserCompany {
  department: string;
  name: string;
  title: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  address: UserAddress;
  company: UserCompany;
  role: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "company" | "email">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Load saved view mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ud_view_mode");
      if (saved === "grid" || saved === "table") {
        Promise.resolve().then(() => {
          setViewMode(saved);
        });
      }
    }
  }, []);

  const handleSetViewMode = (mode: "grid" | "table") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("ud_view_mode", mode);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://dummyjson.com/users?limit=100");
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load directory. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/users?limit=100");
        if (active) {
          if (response.data && Array.isArray(response.data.users)) {
            setUsers(response.data.users);
          } else {
            throw new Error("Invalid response format");
          }
        }
      } catch (err: unknown) {
        if (active) {
          const errorMessage = err instanceof Error ? err.message : "Failed to load directory. Please try again.";
          setError(errorMessage);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    
    loadUsers();
    
    return () => {
      active = false;
    };
  }, []);

  // Get departments for filters
  const departments = useMemo(() => {
    const list = new Set<string>();
    users.forEach((u) => {
      if (u.company?.department) {
        list.add(u.company.department);
      }
    });
    return Array.from(list).sort();
  }, [users]);

  // Handle Search and Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const companyName = user.company?.name?.toLowerCase() || "";
      const query = searchQuery.toLowerCase();
      
      const matchesSearch =
        fullName.includes(query) ||
        email.includes(query) ||
        companyName.includes(query) ||
        user.username.toLowerCase().includes(query);

      const matchesDept =
        selectedDepartment === "all" ||
        user.company?.department === selectedDepartment;

      return matchesSearch && matchesDept;
    });
  }, [users, searchQuery, selectedDepartment]);

  // Handle Sorting logic
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let valA = "";
      let valB = "";

      if (sortBy === "name") {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortBy === "company") {
        valA = (a.company?.name || "").toLowerCase();
        valB = (b.company?.name || "").toLowerCase();
      } else if (sortBy === "email") {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  // Calculate high-level stats for user dashboard experience
  const stats = useMemo(() => {
    const total = users.length;
    const deptsCount = departments.length;
    const locationsCount = new Set(users.map((u) => u.address?.state).filter(Boolean)).size;

    return { total, deptsCount, locationsCount };
  }, [users, departments]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("all");
    setSortBy("name");
    setSortOrder("asc");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-8">
      {/* Upper Banner Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-white">
            Directory Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-550 dark:text-zinc-400">
            Manage, discover, and search user profiles within the global organization network.
          </p>
        </div>
        
        {/* Toggle layout buttons */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-lg dark:bg-zinc-900 self-start md:self-auto border border-zinc-200/50 dark:border-zinc-800">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleSetViewMode("grid")}
            className="h-8 w-8 rounded-md"
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="icon"
            onClick={() => handleSetViewMode("table")}
            className="h-8 w-8 rounded-md"
            title="Table View"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-zinc-200/50 dark:border-zinc-800 bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
            <p className="text-xxs text-zinc-450 mt-1">Active users synchronised</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/50 dark:border-zinc-800 bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.deptsCount}</div>
            )}
            <p className="text-xxs text-zinc-450 mt-1">Cross-functional domains</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200/50 dark:border-zinc-800 bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Regions</CardTitle>
            <Globe2 className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.locationsCount}</div>
            )}
            <p className="text-xxs text-zinc-450 mt-1">States / territories represented</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters panel */}
      <Card className="border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-12">
            
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search by name, username, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Field */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "company" | "email")}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="name">Sort by Name</option>
                <option value="company">Sort by Company</option>
                <option value="email">Sort by Email</option>
              </select>
            </div>

            {/* Sort Order Direction Toggle & Reset */}
            <div className="md:col-span-2 flex gap-2">
              <Button
                variant="outline"
                onClick={toggleSortOrder}
                className="w-full flex justify-center gap-1.5 h-10 border-zinc-200 dark:border-zinc-800"
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowUp className="h-4 w-4 text-zinc-550" />
                    <span className="text-xs">Asc</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4 text-zinc-550" />
                    <span className="text-xs">Desc</span>
                  </>
                )}
              </Button>
              
              {(searchQuery || selectedDepartment !== "all" || sortBy !== "name" || sortOrder !== "asc") && (
                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="h-10 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
                  title="Clear Filters"
                >
                  Reset
                </Button>
              )}
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Main content display */}
      <div className="flex-1 flex flex-col min-h-[400px]">
        {/* Loading Skeletons */}
        {loading && (
          <>
            {viewMode === "grid" ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-zinc-200/50 dark:border-zinc-800">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div className="flex flex-col gap-2 flex-1">
                        <Skeleton className="h-5 w-[65%]" />
                        <Skeleton className="h-3 w-[45%]" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-[85%]" />
                      <Skeleton className="h-4 w-[70%]" />
                      <Skeleton className="h-9 w-full rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-zinc-200/50 dark:border-zinc-800">
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                      <div className="flex items-center gap-3 w-1/3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-[60%]" />
                      </div>
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/6" />
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="my-auto flex flex-col items-center justify-center text-center p-8 border border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10 rounded-xl max-w-lg mx-auto w-full">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mb-4 text-red-650 dark:text-red-400">
              <RefreshCw className="h-6 w-6 animate-spin-once" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">API Connection Failure</h3>
            <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400">
              {error}
            </p>
            <Button
              onClick={fetchUsers}
              className="mt-6 flex items-center gap-2"
              variant="default"
            >
              <RefreshCw className="h-4 w-4" />
              Try Reconnecting
            </Button>
          </div>
        )}

        {/* Empty Search Result State */}
        {!loading && !error && sortedUsers.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">No directory matches found</h3>
            <p className="mt-1 text-sm text-zinc-500 max-w-sm dark:text-zinc-455">
              We could not find anyone matching &ldquo;{searchQuery}&rdquo;{selectedDepartment !== "all" && ` in the ${selectedDepartment} department`}.
            </p>
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="mt-6 text-xs border-zinc-200 dark:border-zinc-800"
            >
              Reset Search Filters
            </Button>
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && sortedUsers.length > 0 && (
          <>
            {viewMode === "grid" ? (
              // GRID CARD VIEW
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {sortedUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="group border border-zinc-200/60 dark:border-zinc-850 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col overflow-hidden bg-white dark:bg-zinc-950"
                  >
                    <div className="p-6 flex-1 flex flex-col gap-4">
                      {/* Card Header Profile */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="object-cover h-full w-full"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base leading-tight text-zinc-900 dark:text-white truncate group-hover:text-zinc-950 dark:group-hover:text-zinc-200">
                            {user.firstName} {user.lastName}
                          </h3>
                          <span className="text-xs text-zinc-450 font-mono block truncate">
                            @{user.username}
                          </span>
                        </div>
                      </div>

                      {/* Info lines */}
                      <div className="space-y-2.5 text-sm flex-1 pt-1">
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <Mail className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                          <span className="truncate" title={user.email}>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <Briefcase className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                          <span className="truncate">
                            {user.company?.title || "Staff"} at <strong className="font-medium text-zinc-800 dark:text-zinc-350">{user.company?.name || "Corporate"}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-zinc-400" />
                          <span className="truncate">
                            {user.address?.city}, {user.address?.state}
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      {user.company?.department && (
                        <div className="pt-2">
                          <Badge variant="secondary" className="bg-zinc-100/80 text-zinc-800 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80">
                            {user.company.department}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Footer navigate action */}
                    <Link href={`/users/${user.id}`} className="block border-t border-zinc-100/60 dark:border-zinc-900/60">
                      <span className="w-full flex items-center justify-between px-6 py-3 text-xs font-semibold bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/40 text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                        View Detailed Profile
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              // TABLE ROW VIEW
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">User</TableHead>
                    <TableHead className="w-[25%]">Email</TableHead>
                    <TableHead className="w-[20%]">Company</TableHead>
                    <TableHead className="w-[15%]">Department</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 flex-shrink-0">
                            <img
                              src={user.image}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="object-cover h-full w-full"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-900 dark:text-white truncate">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-zinc-450 font-mono truncate">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{user.email}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {user.company?.name}
                        </div>
                        <div className="text-xs text-zinc-455">
                          {user.company?.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.company?.department ? (
                          <Badge variant="outline" className="text-xxs border-zinc-200 dark:border-zinc-800">
                            {user.company.department}
                          </Badge>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/users/${user.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold px-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            View
                            <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
