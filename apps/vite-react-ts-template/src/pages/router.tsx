// eslint-disable-next-line no-restricted-imports
import { createBrowserRouter, ScrollRestoration } from "react-router-dom";

import { Layout } from "shared/Layout";

import { cartPageLoader } from "./Cart/loader";
import { homePageLoader } from "./Home/loader";
import { productPageLoader } from "./Product/loader";
import { productsPageLoader } from "./Products/loader";
import { officesPageLoader } from "./Offices/loader";
import { officePageLoader } from "./Office/loader";

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
