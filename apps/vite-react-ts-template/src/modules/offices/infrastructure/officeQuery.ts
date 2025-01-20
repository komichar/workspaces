import { UseQueryOptions } from "@tanstack/react-query";

import { buildUrl, queryClient, useQuery } from "utils";

import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import { Office } from "../../../../../api/office";
import { OfficeByIdOutput } from "../../../../../api/routing";

export const getOfficeQueryKey = (officeId: string) => ["office", officeId];

export const getOfficeQuery = (officeId: string) => ({
  queryKey: getOfficeQueryKey(officeId),
  queryFn: (): Promise<Office> =>
    httpServiceReservationSystem
      .get<ReservationSystemResponseWrapper<OfficeByIdOutput>>(
        buildUrl(`v1/offices/${officeId}`)
      )
      .then((res) => res.data.office),
});

export const useOfficeQuery = (
  officeId: string,
  options?: UseQueryOptions<Office>
) => {
  return useQuery({
    ...getOfficeQuery(officeId),
    ...options,
  });
};

export const officeLoader = async (officeId: string) =>
  queryClient.ensureQueryData(getOfficeQuery(officeId));
