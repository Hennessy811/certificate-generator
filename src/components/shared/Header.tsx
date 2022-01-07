import React from "react"

import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

const getUserAvatar = (initials: string) =>
  `https://avatars.dicebear.com/api/pixel-art/${initials}.svg`

const Header = () => {
  const { data, status } = useSession()
  const signedIn = status === "authenticated"
  const loading = status === "loading"

  return (
    <div className="flex items-center justify-between px-4 py-3 mt-2 border border-gray-200 shadow-md bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
      <div>
        <Link href="/">
          <a>
            <span className="text-xl font-bold">Travel Plans</span>
          </a>
        </Link>
      </div>
      <div>
        {!loading && signedIn ? (
          <div className="flex">
            <button
              className="px-3 font-mono text-sm uppercase border border-gray-700 rounded-lg cursor-pointer"
              onClick={() => signOut({ redirect: false })}
            >
              Sign Out
            </button>

            <Link href="/profile">
              <a>
                <div className="w-10 h-10 ml-3 border-2 border-gray-700 rounded-full shadow pointer">
                  <Image
                    className="rounded-full"
                    height={40}
                    width={40}
                    src={getUserAvatar(
                      data?.user?.name || data?.user?.email || ""
                    )}
                    alt="User avatar"
                  />
                </div>
              </a>
            </Link>
          </div>
        ) : (
          <button
            className="px-3 py-2 font-mono text-sm uppercase border border-gray-700 rounded-lg cursor-pointer"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  )
}

export default Header
