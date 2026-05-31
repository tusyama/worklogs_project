import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import { store } from "./app/store";
import { GlobalStyle } from "./theme/GlobalStyle";
import { ThemeProvider } from "./theme/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
