import { configureStore } from "@reduxjs/toolkit";
import { worklogApi } from "./api";

export const store = configureStore({
  reducer: {
    [worklogApi.reducerPath]: worklogApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(worklogApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
