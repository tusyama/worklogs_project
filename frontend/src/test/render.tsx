import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import { useMemo, type ReactElement, type ReactNode } from "react";
import { Provider } from "react-redux";
import { worklogApi } from "@/app/api";
import { ThemeProvider } from "@/theme/ThemeProvider";

export function createTestStore() {
  return configureStore({
    reducer: {
      [worklogApi.reducerPath]: worklogApi.reducer,
    },
    middleware: (getDefault) => getDefault().concat(worklogApi.middleware),
  });
}

function TestProviders({ children }: { children: ReactNode }) {
  const store = useMemo(() => createTestStore(), []);
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, { wrapper: TestProviders, ...options });
}
