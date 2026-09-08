"use client"

import { UserContext } from "@/context/UserContext"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export default function NavbarComponent() {
    const { userDetails, logoutUser } = useContext(UserContext);
    const router = useRouter();

    async function handleLogout() {
        const success = await logoutUser();

        if(success) {
            router.push("/");
        }
    }

    const user = userDetails?.user;

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                        DSA
                    </span>
                    <span className="hidden text-lg font-bold text-slate-900 dark:text-white sm:inline">DSA Hub</span>
                </Link>

                { user ? (
                    <div className="flex min-w-0 items-center gap-1 sm:gap-2">
                        <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                            Home
                        </Link>
                        <Link href="/patterns" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400">
                            Patterns
                        </Link>
                        <Link href="/bookmarks" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:block">
                            Bookmarks
                        </Link>
                        <Link href="/notes" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 sm:block">
                            Notes
                        </Link>
                        <button onClick={handleLogout} type="submit" className="bg-red-500 hover:bg-red-700 px-3 rounded py-1 text-[#ffffff]">logout</button>
                        <Link href="/profile" aria-label="View profile" className="ml-1 rounded-full dark:ring-offset-slate-900">
                            <Image src="/avatar.png" width={40} height={40} alt="Profile" className="rounded-full border-2 border-transparent object-cover" />
                        </Link>
                    </div> ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="px-6 py-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition transform hover:scale-105"
                        >
                            Sign Up
                        </Link>
                    </div>
                    )
                }
            </div>
        </nav>
    )
}