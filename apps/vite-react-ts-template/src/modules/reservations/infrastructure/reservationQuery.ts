import { buildUrl, queryClient, useQuery } from "utils";

import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";
import type {
  CreateReservationInput,
  ReservationsListInput,
  ReservationsListOutput,
} from "../../../../../api/src/reservations.routing";
import { useMutation } from "@tanstack/react-query";

export const getReservationQueryKey = (params: ReservationsListInput) => [
  "reservation",
  params.date,
  params.office_id,
  params.user_id,
];

const getReservationQuery = (params: ReservationsListInput) => ({
  queryKey: getReservationQueryKey(params),
  queryFn: (): Promise<ReservationsListOutput> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<ReservationsListOutput>>(
        buildUrl<ReservationsListInput>("v1/reservation", params)
      )
      .then((res) => ({
        reservations: res.data.reservations,
        capacity: res.data.capacity,
      })),
});

export const useReservationQuery = (params: ReservationsListInput) => {
  return useQuery({
    ...getReservationQuery(params),
  });
};

export const reservationLoader = async (params: ReservationsListInput) =>
  queryClient.ensureQueryData(getReservationQuery(params));

export const getReservationCreateMutation = () => ({
  mutationFn: async (email: string, input: CreateReservationInput) => {
    return httpServiceReservationSystem.post(
      buildUrl(`v1/reservations`),
      input,
      {
        headers: { Authorization: `Bearer ${email}` },
      }
    );
  },
});

export type ReservationCreateMutation = ReturnType<
  typeof useReservationCreateMutation
>;

export const useReservationCreateMutation = () => {
  const { mutationFn } = getReservationCreateMutation();

  return useMutation({
    mutationFn: ({
      email,
      input,
    }: {
      email: string;
      input: CreateReservationInput;
    }) => mutationFn(email, input),
  });
};

export const getReservationDeleteMutation = () => ({
  mutationFn: async (id: number) => {
    return httpServiceReservationSystem.delete(
      buildUrl(`v1/reservations/${id}`)
    );
  },
});

export type ReservationDeleteMutation = ReturnType<
  typeof useReservationDeleteMutation
>;

export const useReservationDeleteMutation = () => {
  return useMutation({
    ...getReservationDeleteMutation(),
  });
};
