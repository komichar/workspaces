import { buildUrl, queryClient, useQuery } from "utils";

import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import type {
  ReservationsListInput,
  ReservationsListOutput,
} from "../../../../../api/routing";

export const getReservationQueryKey = () => ["reservation"]; // TODO: improve key with other params

const getReservationQuery = (params: ReservationsListInput) => ({
  queryKey: getReservationQueryKey(),
  queryFn: (): Promise<ReservationsListOutput> =>
    httpServiceReservationSystem
      .get<ReservationSystemResponseWrapper<ReservationsListOutput>>(
        buildUrl<ReservationsListInput>("v1/reservation", params)
      )
      .then((res) => ({
        reservations: res.data.reservations,
      })),
});

const cancelReservationMutation = (id: number) => ({
  queryKey: getReservationQueryKey(),
  queryFn: (): Promise<ReservationsListOutput> =>
    httpServiceReservationSystem
      .delete<ReservationSystemResponseWrapper<ReservationsListOutput>>(
        buildUrl<ReservationsListInput>(`v1/reservation/${id}`)
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
