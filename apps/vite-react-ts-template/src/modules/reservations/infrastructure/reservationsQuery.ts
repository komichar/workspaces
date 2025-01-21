import { buildUrl, queryClient, useQuery } from "utils";

import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import type {
  ReservationsListInput,
  ReservationsListOutput,
} from "../../../../../api/routing";
import { useMutation } from "@tanstack/react-query";

export const getReservationsQueryKey = () => ["reservations"]; // TODO: improve key with other params

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
