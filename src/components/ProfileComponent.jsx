'use client'

import { UserContext } from "@/context/UserContext"
import Link from "next/link";
import { useContext, useEffect } from "react";

export default function ProfileComponent() {
    const { user, getUser } = useContext(UserContext);

    console.log(user);

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [getUser, user]);

    if (!user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading your profile...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Your account</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:h-40" />
                    <div className="px-6 pb-8 sm:px-10">
                        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
                            <img src={user.profile_pic || "/avatar.png"} alt={user.username} className="h-28 w-28 rounded-2xl object-cover shadow-lg " />
                            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {user.role}
                            </span>
                        </div>

                        <div className="mt-5">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
                            <p className="mt-1 text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-blue-50 p-5 dark:bg-blue-950/40">
                                <p className="text-sm text-blue-700 dark:text-blue-300">Total XP</p>
                                <p className="mt-2 text-3xl font-bold text-blue-950 dark:text-blue-100">{user.total_xp}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{user.address || "Not provided"}</p>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-slate-200 pt-7 dark:border-slate-800">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">About</h3>
                            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">{user.about || "Tell the DSA Hub community a little about yourself."}</p>
                        </div>

                        <Link href="/dashboard" className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-400">
                            Back to dashboard
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    )
}