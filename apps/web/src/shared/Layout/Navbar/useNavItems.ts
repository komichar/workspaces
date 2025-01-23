import { useAuthStore } from "modules/auth/application";

import { INavItem } from "./INavItem";

export const useNavItems = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);

  return isAuthenticated ? NAV_ITEMS : NAV_ITEMS.slice(0, NAV_ITEMS.length - 1);
};

export const NAV_ITEMS: Array<INavItem> = [
  {
    label: "Offices",
    href: "/offices",
  },
  {
    label: "Reservations",
    href: "/reservations",
  },
];
