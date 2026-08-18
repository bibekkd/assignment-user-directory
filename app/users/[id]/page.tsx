"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Building,
  GraduationCap,
  Calendar,
  HeartPulse,
  User as UserIcon,
  RefreshCw,
  Info,
  Map,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  address: UserAddress;
}

interface UserHair {
  color: string;
  type: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  age: number;
  gender: string;
  birthDate: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: UserHair;
  address: UserAddress;
  company: UserCompany;
  university: string;
}

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: UserPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://dummyjson.com/users/${id}`);
      if (response.data && response.data.id) {
        setUser(response.data);
      } else {
        throw new Error("User not found");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user details.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadDetails = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/users/${id}`);
        if (active) {
          if (response.data && response.data.id) {
            setUser(response.data);
          } else {
            throw new Error("User not found");
          }
        }
      } catch (err: unknown) {
        if (active) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch user details.";
          setError(errorMessage);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadDetails();
    }

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6">
      
      {/* Back Button */}
      <div className="flex items-center">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 hover:bg-zinc-150 dark:hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Button>
        </Link>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
          {/* Header Card Skeleton */}
          <Card className="md:col-span-12 border-zinc-200/50 dark:border-zinc-800">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <Skeleton className="h-28 w-28 rounded-full" />
              <div className="flex-1 flex flex-col gap-3 items-center sm:items-start w-full">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* Details Skeletons */}
          <div className="md:col-span-8 space-y-6">
            <Card className="border-zinc-200/50 dark:border-zinc-800">
              <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
            <Card className="border-zinc-200/50 dark:border-zinc-800">
              <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="border-zinc-200/50 dark:border-zinc-800">
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="my-auto flex flex-col items-center justify-center text-center p-8 border border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10 rounded-xl max-w-lg mx-auto w-full">
          <RefreshCw className="h-12 w-12 animate-spin-once text-red-650 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Profile Fetch Failed</h3>
          <p className="mt-2 text-sm text-zinc-550 dark:text-zinc-400">{error}</p>
          <div className="flex gap-4 mt-6">
            <Button onClick={fetchUserDetails} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      )}

      {/* User Details Presentation */}
      {user && !loading && !error && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-12 animate-fade-in">
          
          {/* Top Banner Card: Basic Profile Info */}
          <Card className="md:col-span-12 border-zinc-200/60 dark:border-zinc-850 overflow-hidden bg-white dark:bg-zinc-950 shadow-xs">
            <div className="h-32 bg-linear-to-r from-indigo-50/70 via-purple-50/70 to-pink-50/50 border-b border-zinc-100 dark:border-zinc-900 relative">
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="border-zinc-200 bg-white/80 text-zinc-700 dark:border-zinc-800 dark:text-zinc-400 font-mono text-xs">
                  ID: #{user.id}
                </Badge>
              </div>
            </div>
            
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-14">
              <div className="h-28 w-28 rounded-full overflow-hidden bg-white dark:bg-zinc-950 border-4 border-white dark:border-zinc-950 shadow-md flex-shrink-0 relative group">
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="object-cover h-full w-full"
                />
              </div>
              
              <div className="text-center sm:text-left flex-1 min-w-0 pt-0 sm:pt-14">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                  {user.maidenName && (
                    <span className="text-sm font-normal text-zinc-450 dark:text-zinc-500 ml-2">
                      ({user.maidenName})
                    </span>
                  )}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 mt-1.5 text-sm text-zinc-550 dark:text-zinc-400">
                  <span className="font-mono">@{user.username}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hidden sm:inline" />
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    {user.address?.city}, {user.address?.state}
                  </span>
                </div>
              </div>

              {user.company?.department && (
                <div className="mt-4 sm:mt-0 flex-shrink-0 self-center sm:self-end">
                  <Badge variant="secondary" className="px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    {user.company.department}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Left Column: Extensive Info Cards */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Professional Information */}
            <Card className="border-zinc-200/60 dark:border-zinc-850 bg-white dark:bg-zinc-950 shadow-xs">
              <CardHeader className="flex flex-row items-center gap-2 border-b border-zinc-100/50 dark:border-zinc-900/50 pb-4">
                <Briefcase className="h-5 w-5 text-zinc-550" />
                <CardTitle className="text-lg">Employment & Role Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Job Title</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.company?.title || "Employee"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Department</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.company?.department || "N/A"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Employer / Organization</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-zinc-400" />
                    {user.company?.name || "Corporate Network"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Company Location</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {user.company?.address?.address}, {user.company?.address?.city}, {user.company?.address?.state}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="border-zinc-200/60 dark:border-zinc-850 bg-white dark:bg-zinc-950 shadow-xs">
              <CardHeader className="flex flex-row items-center gap-2 border-b border-zinc-100/50 dark:border-zinc-900/50 pb-4">
                <UserIcon className="h-5 w-5 text-zinc-550" />
                <CardTitle className="text-lg">Contact & Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Email Address</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-mono">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    <a href={`mailto:${user.email}`} className="hover:underline">{user.email}</a>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Phone Number</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-mono">
                    <Phone className="h-4 w-4 text-zinc-400" />
                    <a href={`tel:${user.phone}`} className="hover:underline">{user.phone}</a>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">University / Education</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-zinc-400" />
                    {user.university}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-450 mb-0.5">Residential Address</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <Map className="h-4 w-4 text-zinc-400" />
                    {user.address?.address}, {user.address?.city}, {user.address?.state} {user.address?.postalCode}, {user.address?.country}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Physical & Bio Stats Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Bio stats */}
            <Card className="border-zinc-200/60 dark:border-zinc-850 bg-white dark:bg-zinc-950 shadow-xs">
              <CardHeader className="border-b border-zinc-100/50 dark:border-zinc-900/50 pb-4 flex flex-row items-center gap-2">
                <HeartPulse className="h-5 w-5 text-zinc-550" />
                <CardTitle className="text-base">Biological Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm">
                
                <div className="flex items-center justify-between py-1 border-b border-zinc-50 dark:border-zinc-900">
                  <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-zinc-400" /> Age & Gender
                  </span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-250 capitalize">
                    {user.age} yrs / {user.gender}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-50 dark:border-zinc-900">
                  <span className="text-zinc-500 font-medium">Birth Date</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-250 font-mono">
                    {user.birthDate}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-50 dark:border-zinc-900">
                  <span className="text-zinc-500 font-medium">Blood Group</span>
                  <Badge variant="outline" className="border-red-200 text-red-650 bg-red-50/20 dark:border-red-900 dark:text-red-400 font-bold px-2 py-0.5">
                    {user.bloodGroup}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-zinc-50 dark:border-zinc-900">
                  <span className="text-zinc-500 font-medium">Height & Weight</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-250">
                    {user.height} cm / {user.weight} kg
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-500 font-medium flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-zinc-400" /> Hair & Eyes
                  </span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-250 capitalize">
                    {user.hair?.color} {user.hair?.type} / {user.eyeColor} eyes
                  </span>
                </div>

              </CardContent>
            </Card>

            {/* Quick Notes / System card */}
            <Card className="border-zinc-200/60 dark:border-zinc-850 bg-zinc-50/40 dark:bg-zinc-950/25 shadow-xs">
              <CardContent className="p-5 text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed flex items-start gap-2.5">
                <Info className="h-4 w-4 text-zinc-450 flex-shrink-0 mt-0.5" />
                <div>
                  This directory profile represents official company record data synchronized on behalf of <strong>@{user.username}</strong>. Information is governed under privacy protection and organization internal network guidelines.
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}

    </div>
  );
}
