import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    overflow-x: hidden;
    -webkit-text-size-adjust: 100%;
  }

  button, input, select {
    font: inherit;
  }

  table {
    border-collapse: collapse;
  }
`;
