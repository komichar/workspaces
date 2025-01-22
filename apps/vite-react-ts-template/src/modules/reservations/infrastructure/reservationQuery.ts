import { buildUrl, queryClient, useQuery } from "utils";

import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";
import type {
  CreateReservationInput,
  ReservationsListInput,
  ReservationsListOutput,
} from "../../../../../api/reservations.routing";
import { useMutation } from "@tanstack/react-query";

export const getReservationQueryKey = () => ["reservation"]; // TODO: improve key with other params

const getReservationQuery = (params: ReservationsListInput) => ({
  queryKey: getReservationQueryKey(),
  queryFn: (): Promise<ReservationsListOutput> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<ReservationsListOutput>>(
        buildUrl<ReservationsListInput>("v1/reservation", params)
      )
      .then((res) => ({
        reservations: res.data.reservations,
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

export const useReservationDeleteMutation = () => {
  return useMutation({
    ...getReservationDeleteMutation(),
  });
};
