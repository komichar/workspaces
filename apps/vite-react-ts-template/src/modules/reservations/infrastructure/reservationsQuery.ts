import { buildUrl, queryClient, useQuery } from "utils";

import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";

import type { Reservation } from "../../../../../api/src/reservation";
import type {
  ReservationsListInput,
  ReservationsListOutput,
} from "../../../../../api/src/reservations.routing";

export const getReservationsQueryKey = () => ["reservations"]; // TODO: improve key with other params

// TOOD: read response header about high demand and persist that data
// in order to show on UI
const getReservationsQuery = (params: ReservationsListInput) => ({
  queryKey: getReservationsQueryKey(),
  queryFn: (): Promise<ReservationsListOutput> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<ReservationsListOutput>>(
        buildUrl<ReservationsListInput>("v1/reservations", params)
      )
      .then((res) => ({
        reservations: res.data.reservations,
      })),
});

export const useReservationsQuery = (params: ReservationsListInput) => {
  return useQuery({
    ...getReservationsQuery(params),
  });
};

export const getMyReservationForDayQueryKey = (
  date: string,
  office_id: number,
  user_id: number
) => ["myreservations", date, office_id, user_id];

const getMyReservationsForDayQuery = (params: ReservationsListInput) => ({
  queryKey: getMyReservationForDayQueryKey(
    params.date,
    params.office_id,
    params.user_id as number
  ),
  queryFn: (): Promise<Reservation | null> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<ReservationsListOutput>>(
        buildUrl<ReservationsListInput>("v1/reservations", params)
      )
      .then((res) => res.data.reservations[0] || null),
});

export const useMyReservationsForDayQuery = (params: ReservationsListInput) => {
  return useQuery({
    ...getMyReservationsForDayQuery(params),
  });
};

export const reservationsLoader = async (params: ReservationsListInput) =>
  queryClient.ensureQueryData(getReservationsQuery(params));

export const myreservationsForDayLoader = async (
  params: ReservationsListInput
) => queryClient.ensureQueryData(getMyReservationsForDayQuery(params));
