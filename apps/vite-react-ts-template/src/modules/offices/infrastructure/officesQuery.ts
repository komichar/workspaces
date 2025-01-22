import { buildUrl, queryClient, useQuery } from "utils";

import { httpServiceReservationSystem, APIResponseWrapper } from "utils/http";
import type { OfficeListOutput } from "../../../../../api/src/offices.routing";

export const getOfficesQueryKey = () => ["offices"];

const getOfficesQuery = () => ({
  queryKey: getOfficesQueryKey(),
  queryFn: (): Promise<OfficeListOutput> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<OfficeListOutput>>(buildUrl("v1/offices"))
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
