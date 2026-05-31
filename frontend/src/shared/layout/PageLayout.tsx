import type { ReactNode } from "react";
import { StyledPageLayout } from "./PageLayout.styles";

type PageLayoutProps = {
  children: ReactNode;
};

export function PageLayout({ children }: PageLayoutProps) {
  return <StyledPageLayout>{children}</StyledPageLayout>;
}
