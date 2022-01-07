import React from "react"

import Auth from "./Auth"
import Header from "./Header"

interface Props {
  children: React.ReactNode
  protectedRoute?: boolean
}

const Layout = ({ children, protectedRoute }: Props) => {
  const content = (
    <div className="max-w-4xl m-auto">
      <Header />

      <main className="px-4 pt-4 pb-8 mt-12 bg-white rounded-lg shadow">
        {children}
      </main>
    </div>
  )
  return protectedRoute ? <Auth>{content}</Auth> : <>{content}</>
}

export default Layout
