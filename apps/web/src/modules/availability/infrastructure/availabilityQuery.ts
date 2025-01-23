import { buildUrl, queryClient, useQuery } from "utils";
import { APIResponseWrapper, httpServiceReservationSystem } from "utils/http";
import {
  GetOfficeDayAvailabilityInput,
  GetOfficeDayAvailabilityOutput,
} from "../../../../../api/src/offices-days-availability.routing";

export const getAvailabilityQueryKey = (
  params: GetOfficeDayAvailabilityInput
) => ["availability", params.date, params.id];

const getAvailabilityQuery = (
  params: GetOfficeDayAvailabilityInput & { email: string }
) => ({
  queryKey: getAvailabilityQueryKey(params),
  queryFn: (): Promise<GetOfficeDayAvailabilityOutput> =>
    httpServiceReservationSystem
      .get<APIResponseWrapper<GetOfficeDayAvailabilityOutput>>(
        buildUrl<GetOfficeDayAvailabilityOutput>(
          `v1/offices/${params.id}/days/${params.date}/availability`
        ),
        {
          headers: { Authorization: `Bearer ${params.email}` },
        }
      )
      .then((res) => res.data),
});

export const useAvailabilityQuery = (
  params: GetOfficeDayAvailabilityInput & { email: string }
) => {
  return useQuery({
    ...getAvailabilityQuery(params),
  });
};

export const availabilityLoader = async (
  email: string,
  params: GetOfficeDayAvailabilityInput
) => queryClient.ensureQueryData(getAvailabilityQuery({ ...params, email }));
