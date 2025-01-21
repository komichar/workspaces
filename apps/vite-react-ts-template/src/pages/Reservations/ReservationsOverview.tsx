import { useMemo, useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { IQueryParams } from "types";

import { t } from "utils";

import { useOfficesQuery } from "modules/offices/infrastructure/officesQuery";
import { Page, PageHeader } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";
import { useNotImplementedYetToast } from "shared/Toast";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

import { addDays, format } from "date-fns";
import { useNavigate } from "shared/Router";
import { useReservationsQuery } from "modules/reservations/infrastructure";
import { useAuthStore } from "modules/auth/application";
import { OverviewListItem } from "./OverviewListItem";

// Generate the next 7 days starting from today
const generateNext7Days = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => addDays(today, i));
};

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

export const ReservationsOverviewPage = () => {
  const notImplemented = useNotImplementedYetToast();

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isFetching } = useOfficesQuery();
  const navigate = useNavigate();

  const next7Days = useMemo(() => generateNext7DaysWithNames(), []);

  return (
    <Page>
      <PageHeader
        title={t("Reservations list")}
        description={t("for upcoming days")}
      >
        <Button leftIcon={<SettingsIcon />} onClick={notImplemented}>
          {t("More filters")}
        </Button>
      </PageHeader>

      <Box my={2}>
        <VStack spacing={4} align="stretch">
          {next7Days.map((day) => (
            <OverviewListItem
              key={day.date}
              date={day.date}
              dayName={day.dayName}
            />
          ))}
        </VStack>
      </Box>
    </Page>
  );
};

export const ErrorBoundary = ErrorPageStrategy;
