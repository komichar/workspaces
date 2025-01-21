import { useMemo, useState } from "react";

import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, HStack, Stack, VStack } from "@chakra-ui/react";

import { IQueryParams } from "types";

import { t } from "utils";

import { useOfficesQuery } from "modules/offices/infrastructure/officesQuery";
import { Page, PageHeader } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";
import { useNotImplementedYetToast } from "shared/Toast";

const defaultParams: IQueryParams = { limit: 10, sort: "asc" };

import { addDays, format } from "date-fns";

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

const ReservationsPage = () => {
  const notImplemented = useNotImplementedYetToast();

  const [params, setParams] = useState<IQueryParams>(defaultParams);
  const { data, isFetching } = useOfficesQuery();

  const next7Days = useMemo(() => generateNext7DaysWithNames(), []);

  return (
    <Page>
      <PageHeader
        title={t("Reservations list")}
        description={t("Make reservations")}
      >
        <Button leftIcon={<SettingsIcon />} onClick={notImplemented}>
          {t("More filters")}
        </Button>
      </PageHeader>

      <Box my={2}>
        <VStack spacing={4} align="stretch">
          {next7Days.map((day) => (
            <Box p={4} bg="gray.100" key={day.date} borderRadius={8}>
              <HStack justify={"space-between"} alignContent={"center"}>
                <Heading as="h4" size="md">
                  {day.date}, {day.dayName}
                </Heading>
                <Stack direction="row" spacing={4}>
                  <Button isLoading={false} colorScheme="teal" variant="solid">
                    Reserve
                  </Button>
                  <Button
                    isLoading={false}
                    loadingText="Submitting"
                    colorScheme="teal"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </Stack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Page>
  );
};

export const Component = ReservationsPage;

export const ErrorBoundary = ErrorPageStrategy;
