import { t } from "utils";

import { useToast } from "shared/Toast";

export const useReservationCreatedNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: "Reservation created",
    });

  const failure = () =>
    toast({
      status: "error",
      title: "Failed to create reservation",
      description: t(
        "User can place only one reservation per day. Release the seat and try again."
      ),
    });

  return [success, failure] as const;
};
