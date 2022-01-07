import React from "react"

import Layout from "@components/shared/Layout"
import trpc from "@utils/trpc"

const Loader = () => {
  return (
    <div className="w-full h-full font-mono text-2xl animate-pulse">
      Loading...
    </div>
  )
}

const Profile = () => {
  const { data: user, isLoading } = trpc.useQuery(["users.me"])

  return (
    <Layout protectedRoute>
      <div className="">
        <h1 className="text-2xl font-bold">Profile</h1>

        <br />

        {!isLoading && user ? (
          <div>
            <h2>{user.name}</h2>
            <h2>{user.email}</h2>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </Layout>
  )
}

export default Profile
