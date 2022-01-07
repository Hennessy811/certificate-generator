import React from "react"

import { isPast } from "date-fns"
import { signIn, signOut, useSession } from "next-auth/react"

interface Props {
  children: JSX.Element
}

function Auth({ children }: Props) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user

  React.useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
    if (session?.expires && isPast(new Date(session?.expires))) signOut() // If expired, force log in
  }, [isUser, session?.expires, status])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className="flex flex-col items-center justify-center h-screen font-mono text-4xl animate-pulse">
      Loading...
    </div>
  )
}

export default Auth
