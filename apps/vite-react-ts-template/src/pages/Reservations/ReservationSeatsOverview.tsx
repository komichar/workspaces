import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, VStack } from "@chakra-ui/react";
import { Page, PageHeader } from "shared/Layout";
import { useNavigate, useParams } from "shared/Router";
import { useNotImplementedYetToast } from "shared/Toast";

export const ReservationSeatsOverview = () => {
  const notImplemented = useNotImplementedYetToast();
  const params = useParams<{ date: string }>();
  const navigate = useNavigate();

  // 1. fetch reservations from api
  // 2. display reservations in a grid

  return (
    <Page>
      <PageHeader
        title={`Reservations for ${params.date}`}
        description="Make reservations"
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/reservations")}
        >
          Reservations
        </Button>
      </PageHeader>

      <Box my={2}>
        <VStack spacing={4} align="stretch"></VStack>
      </Box>
    </Page>
  );
};
