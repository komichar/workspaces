import { Box, Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useAuthStore } from "modules/auth/application";
import {
  useMyReservationsForDayQuery,
  useReservationDeleteMutation,
} from "modules/reservations/infrastructure";
import { useReservationDeletedNotifications } from "modules/reservations/presentation/useReservationDeletedNotifications";
import { useNavigate } from "shared/Router";

type Props = {
  date: string;
  dayName: string;
};

export const OverviewListItem = ({ date, dayName }: Props) => {
  const navigate = useNavigate();

  const user = useAuthStore((store) => store.user);

  const reservationDeleteMutation = useReservationDeleteMutation();
  const [notifyDeletedSuccess, notifyDeletedFailure] =
    useReservationDeletedNotifications();

  const reservation = useMyReservationsForDayQuery({
    date: date,
    office_id: user?.office_id!,
    user_id: user!.id,
  });

  return (
    <Box p={4} bg="gray.100" key={date} borderRadius={8}>
      <HStack justify={"space-between"} alignContent={"center"}>
        <Heading as="h4" size="md">
          <Text color="gray.400">{date}</Text>
          <Text>{dayName}</Text>
        </Heading>
        <Stack direction="row" spacing={4}>
          {reservation.data?.id && (
            <Button
              isLoading={false}
              loadingText="Submitting"
              colorScheme="red"
              variant="outline"
              onClick={async () => {
                await reservationDeleteMutation
                  .mutateAsync(reservation.data!.id)
                  .then(() => notifyDeletedSuccess())
                  .catch(() => notifyDeletedFailure());

                await reservation.refetch();
              }}
            >
              Cancel seat {reservation.data.seat_number}
            </Button>
          )}
          {!reservation.data && (
            <Button
              isLoading={false}
              colorScheme="teal"
              variant="solid"
              onClick={() => navigate(`/reservations/${date}`)}
            >
              Select a seat
            </Button>
          )}
        </Stack>
      </HStack>
    </Box>
  );
};
