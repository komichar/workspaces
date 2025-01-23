import { createContext, useContext } from "react";

import { createStore, useStore } from "zustand";

import type { User } from "../../../../../api/src/user";
import { getUser, loginUser } from "../infrastructure";
import { ICredentials } from "../infrastructure/loginUser";

const AUTH_KEY = "fake_store_is_authenticated";

// could be also https://www.npmjs.com/package/zustand-persist lib for advanced use cases
const isLoggedIn = () => localStorage.getItem(AUTH_KEY) === "true";
const getUserId = () => localStorage.getItem(AUTH_USER_ID) as string;

interface IStore {
  isAuthenticated: boolean;
  isError: boolean;
  state: "idle" | "loading" | "finished";
  user: User | undefined;
  login: (credentials: ICredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthStore = ReturnType<typeof initializeAuthStore>;

const zustandContext = createContext<AuthStore | null>(null);

export const Provider = zustandContext.Provider;

const AUTH_USER_ID = "user_id";

export const useAuthStore = <T>(selector: (state: IStore) => T) => {
  const store = useContext(zustandContext);

  if (!store) throw new Error("AuthStore is missing the provider");

  return useStore(store, selector);
};

export const initializeAuthStore = (preloadedState: Partial<IStore> = {}) => {
  return createStore<IStore>((set) => {
    if (isLoggedIn()) {
      set({ state: "loading" });

      getUser(getUserId())
        .then((user) => {
          set({
            user,
            isAuthenticated: true,
            state: "finished",
          });
        })
        .catch(() => {
          set({
            isError: true,
            state: "finished",
          });
        });
    } else {
      set({ state: "finished" });
    }

    return {
      isAuthenticated: false,
      isError: false,
      state: isLoggedIn() ? "idle" : "finished",
      user: undefined,
      ...preloadedState,
      login: async (credentials: ICredentials) => {
        set({ state: "loading" });

        try {
          const loginResult = await loginUser({ email: credentials.username });

          // const user = await getUser(); // keep this logic for refetching user data after refresh
          const user = await getUser(loginResult.data.user.id.toString());

          localStorage.setItem(AUTH_KEY, "true");
          localStorage.setItem(AUTH_USER_ID, user.id.toString());

          set({
            isAuthenticated: true,
            state: "finished",
            user: loginResult.data.user,
          });
        } catch (e) {
          localStorage.setItem(AUTH_KEY, "false");

          set({
            isAuthenticated: false,
            state: "finished",
            user: undefined,
          });

          throw e;
        }
      },
      logout: async () => {
        set({
          state: "loading",
        });

        return new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
          localStorage.setItem(AUTH_KEY, "false");
          set({
            isAuthenticated: false,
            state: "finished",
            user: undefined,
          });
        });
      },
    };
  });
};
