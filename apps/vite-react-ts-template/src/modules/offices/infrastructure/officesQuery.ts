import { buildUrl, queryClient, useQuery } from "utils";

import {
  httpServiceReservationSystem,
  ReservationSystemResponseWrapper,
} from "utils/http";
import type { OfficeListOutput } from "../../../../../api/routing";

export const getOfficesQueryKey = () => ["offices"];

const getOfficesQuery = () => ({
  queryKey: getOfficesQueryKey(),
  queryFn: (): Promise<OfficeListOutput> =>
    httpServiceReservationSystem
      .get<ReservationSystemResponseWrapper<OfficeListOutput>>(
        buildUrl("v1/offices")
      )
      .then((res) => ({
        offices: res.data.offices,
      })),
});

export const useOfficesQuery = () => {
  return useQuery({
    ...getOfficesQuery(),
  });
};

export const officesLoader = async () =>
  queryClient.ensureQueryData(getOfficesQuery());
