import { t } from "utils";

import { useToast } from "shared/Toast";

export const useReservationDeletedNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "info",
      title: "Reservation cancelled",
    });

  const failure = () =>
    toast({
      status: "error",
      title: "Failed to cancel reservation",
      description: t("Something went wrong"),
    });

  return [success, failure] as const;
};
