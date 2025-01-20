import { UseQueryOptions } from "@tanstack/react-query";

import { IQueryParams, IMeta } from "types";

import { buildUrl, httpService, queryClient, useQuery } from "utils";

import type { Office } from "../../../../../api/office";
import type { OfficeListOutput } from "../../../../../api/routing";
import { Logger } from "utils/logger";
import { httpServiceReservationSystem } from "utils/http";

export const getOfficesQueryKey = () => ["offices"];

const url = buildUrl("v1/offices");
Logger.debug(url);

type ResponseWrapper<T> = {
  status: string;
  data: T;
};

const getOfficesQuery = () => ({
  queryKey: getOfficesQueryKey(),
  queryFn: (): Promise<OfficeListOutput> =>
    httpServiceReservationSystem
      .get<ResponseWrapper<OfficeListOutput>>(url)
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
