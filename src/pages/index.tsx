import React from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"

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

interface FormInputs {
  destination: string
  startDate: string
  endDate: string
  comment: string
}

const schema = yup
  .object({
    destination: yup.string().required().min(3),
    startDate: yup.date().required(),
    endDate: yup
      .date()
      .required()
      .test("endDate", "End date must be after start date", function (value) {
        return value ? value > this.parent.startDate : true
      }),
    comment: yup.string(),
  })
  .required()

const CreateTripForm = ({
  onSubmit,
  isSubmitLoading,
}: {
  onSubmit: (data: FormInputs) => void
  isSubmitLoading: boolean
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })

  const handleSubmitForm = (data: FormInputs) => {
    onSubmit(data)
    reset()
  }

  return (
    <div className="px-2 py-4 my-4 border border-gray-100 rounded-md shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800">Create Trip</h1>
      <br />

      <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col">
        <div className="">
          <div className="text-lg font-medium">Destination</div>
          <input
            className="w-full p-2 my-2 border border-gray-300 rounded"
            placeholder="Destination"
            {...register("destination")}
          />
          <p className="text-sm text-red-500">{errors.destination?.message}</p>
        </div>

        <div>
          <div className="text-lg font-medium">Start Date</div>

          <input
            className="w-full my-2 border border-gray-300 rounded"
            type="date"
            {...register("startDate")}
          />
          <p className="text-sm text-red-500">{errors.startDate?.message}</p>
        </div>

        <div>
          <div className="text-lg font-medium">End Date</div>

          <input
            className="w-full my-2 border border-gray-300 rounded"
            type="date"
            {...register("endDate")}
          />
          <p className="text-sm text-red-500">{errors.endDate?.message}</p>
        </div>

        <div>
          <div className="text-lg font-medium">Comment</div>

          <input
            className="w-full p-2 my-2 border border-gray-300 rounded"
            placeholder="Comment"
            {...register("comment")}
          />
        </div>

        <button
          className="px-4 py-2 mt-4 uppercase border border-gray-600 rounded"
          type="submit"
          disabled={isSubmitLoading}
        >
          {isSubmitLoading ? "Loading" : "Submit"}
        </button>
      </form>
    </div>
  )
}

function Home() {
  const utils = trpc.useContext()
  const { data: trips, isLoading, isError } = trpc.useQuery(["trips.all"])
  const createTripMutation = trpc.useMutation("trips.create", {
    onSuccess: () => utils.invalidateQueries(["trips.all"]),
  })

  const handleCreateTrip = (data: FormInputs) => {
    createTripMutation.mutateAsync(data)
  }

  return (
    <Layout protectedRoute>
      <h1 className="text-3xl font-semibold">My trips</h1>

      <hr />

      {(isLoading || createTripMutation.isLoading) && <Loader />}
      {isError && <Error />}
      {trips && (
        <div>
          {trips.length === 0 && (
            <div className="mt-6 font-mono text-lg text-center">
              You have no planned trips yet. Want to create first?
            </div>
          )}

          <CreateTripForm
            onSubmit={handleCreateTrip}
            isSubmitLoading={createTripMutation.isLoading}
          />

          <div className="w-full my-12 bg-gray-400 rounded-full h-0.5"></div>

          {trips.map((trip) => (
            <div
              key={trip.id}
              className="px-6 py-4 my-3 border-b border-gray-300 rounded-lg shadow"
            >
              <h2 className="text-xl">{trip.destination}</h2>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
export default Home
