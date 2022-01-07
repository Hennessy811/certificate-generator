import React from "react"

import csv from "csvtojson"

import Editor from "@components/Editor/Editor"
import Layout from "@components/shared/Layout"
import trpc from "@utils/trpc"

const Loader = () => {
  return (
    <div className="w-full h-full my-12 font-mono text-2xl animate-pulse">
      Loading...
    </div>
  )
}

const Error = () => {
  return (
    <div className="w-full h-full font-mono text-2xl text-red-600">
      Error happened while loading...
    </div>
  )
}

function Home() {
  const utils = trpc.useContext()
  const [data, setData] = React.useState<Record<string, string | null>[]>([])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0]
    const reader = new FileReader()

    reader.onload = () => {
      const content = reader.result as string
      csv().fromString(content).then(setData)
    }

    if (file) reader.readAsText(file)
  }

  return (
    <Layout>
      <h1 className="text-3xl font-semibold">Design your certificate</h1>

      <hr />

      <div className="flex mt-4">
        <input
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          type="file"
          multiple={false}
          accept="text/csv"
          onChange={handleUpload}
        />
      </div>

      {data[0] && <Editor sampleRow={data[0]} />}

      {!data[0] && (
        <div className="mt-4">
          <p>Select CSV file with sample data to get started</p>

          <p
            onClick={() =>
              setData([{ email: "johndoe2@mail.com", name: "John Doe" }])
            }
            className="underline pointer"
          >
            or try with demo data
          </p>
        </div>
      )}
    </Layout>
  )
}

export default Home
