import {
  defaultEndpointsFactory,
  DependsOnMethod,
  Routing,
} from "express-zod-api";
import { z } from "zod";
import { authLoginEndpoint, authRegisterEndpoint } from "./auth.routing.js";
import { getOfficeDayAvailability } from "./offices-days-availability.routing.js";
import {
  officeByIdEndpoint,
  officeCreateEndpoint,
  officesListEndpoint,
} from "./offices.routing.js";
import {
  cancelReservationByIdEndpoint,
  reservationByIdEndpoint,
  reservationsCreateEndpoint,
  reservationsListEndpoint,
} from "./reservations.routing.js";
import { userByIdEndpoint, usersListEndpoint } from "./users.routing.js";
import { officesUsersListEndpoint } from "./offices-users.routing.js";

const helloWorldEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    return { greetings: `Hello, ${name || "World"}. Happy coding!` };
  },
});

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
    auth: {
      login: authLoginEndpoint,
      register: authRegisterEndpoint,
    },
    offices: new DependsOnMethod({
      get: officesListEndpoint,
      post: officeCreateEndpoint,
    }).nest({
      ":id": new DependsOnMethod({
        get: officeByIdEndpoint,
      }).nest({
        users: officesUsersListEndpoint,
        days: new DependsOnMethod({}).nest({
          ":date": new DependsOnMethod({}).nest({
            availability: getOfficeDayAvailability,
          }),
        }),
      }),
    }),
    users: usersListEndpoint.nest({
      ":id": userByIdEndpoint,
    }),
    reservations: new DependsOnMethod({
      get: reservationsListEndpoint,
      post: reservationsCreateEndpoint,
    }).nest({
      ":id": new DependsOnMethod({
        get: reservationByIdEndpoint,
        delete: cancelReservationByIdEndpoint,
      }),
    }),
  },
};
