import { useMemo, useState } from "react";

import { IQueryParams } from "types";

import { useOfficesQuery } from "modules/offices/infrastructure/officesQuery";
import { ErrorPageStrategy } from "shared/Result";
import { useNotImplementedYetToast } from "shared/Toast";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

import { addDays, format } from "date-fns";
import { Route, Routes } from "react-router-dom";
import { ReservationSeatsOverview } from "./ReservationSeatsOverview";
import { ReservationsOverviewPage } from "./ReservationsOverview";
import { withRequireAuth } from "modules/auth/application";

const generateNext7DaysWithNames = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      dayName: format(date, "EEEE"),
    };
  });
};

const ReservationsPage = () => {
  const notImplemented = useNotImplementedYetToast();

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isFetching } = useOfficesQuery();

  const next7Days = useMemo(() => generateNext7DaysWithNames(), []);

  return (
    <Routes>
      <Route path="/" element={<ReservationsOverviewPage />}></Route>
      <Route path="/:date" element={<ReservationSeatsOverview />} />
    </Routes>
  );
};

export const Component = withRequireAuth(ReservationsPage, { to: "/sign-in" });

export const ErrorBoundary = ErrorPageStrategy;
