// eslint-disable-next-line no-restricted-imports
import { createBrowserRouter, ScrollRestoration } from "react-router-dom";

import { Layout } from "shared/Layout";

import { homePageLoader } from "./Home/loader";
import { officePageLoader } from "./Office/loader";
import { officesPageLoader } from "./Offices/loader";

export const router = createBrowserRouter([
  {
    element: (
      <>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <Layout />
      </>
    ),
    children: [
      {
        path: "/",
        loader: homePageLoader,
        lazy: () => import("./Home"),
      },
      {
        path: "/sign-in",
        lazy: () => import("./SignIn"),
      },
      {
        path: "/reservations/*",
        lazy: () => import("./Reservations"),
      },
      {
        path: "/offices",
        loader: officesPageLoader,
        lazy: () => import("./Offices"),
      },
      {
        path: "/offices/:officeId",
        loader: officePageLoader,
        lazy: () => import("./Office"),
      },
    ],
  },
]);
