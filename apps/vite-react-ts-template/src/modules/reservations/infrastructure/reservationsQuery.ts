import { buildUrl, queryClient, useQuery } from "utils";

import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import type {
  ReservationsListInput,
  ReservationsListOutput,
} from "../../../../../api/routing";

export const getReservationsQueryKey = () => ["reservations"]; // TODO: improve key with other params

// TOOD: read response header about high demand and persist that data
// in order to show on UI
const getReservationsQuery = (params: ReservationsListInput) => ({
  queryKey: getReservationsQueryKey(),
  queryFn: (): Promise<ReservationsListOutput> =>
    httpServiceReservationSystem
      .get<ReservationSystemResponseWrapper<ReservationsListOutput>>(
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

export const reservationsLoader = async (params: ReservationsListInput) =>
  queryClient.ensureQueryData(getReservationsQuery(params));
