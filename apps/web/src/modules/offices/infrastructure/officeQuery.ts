import { UseQueryOptions } from "@tanstack/react-query";

import { buildUrl, queryClient, useQuery } from "utils";

import { APIResponseWrapper, httpServiceReservationSystem } from "utils/http";
import type { Office } from "../../../../../api/src/office";
import type { OfficeByIdOutput } from "../../../../../api/src/offices.routing";

export const getOfficeQueryKey = (officeId: string) => ["office", officeId];

export const getOfficeQuery = (officeId: string) => ({
  queryKey: getOfficeQueryKey(officeId),
  queryFn: (): Promise<Office> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<OfficeByIdOutput>>(
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
