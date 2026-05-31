import type { ReactNode } from "react";
import { CardBody, CardHeader, CardRoot } from "./Card.styles";

function Root({ children }: { children: ReactNode }) {
  return <CardRoot>{children}</CardRoot>;
}

function Header({ children }: { children: ReactNode }) {
  return <CardHeader>{children}</CardHeader>;
}

function Body({ children }: { children: ReactNode }) {
  return <CardBody>{children}</CardBody>;
}

export const Card = {
  Root,
  Header,
  Body,
};
