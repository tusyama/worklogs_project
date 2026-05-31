import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import {
  StyledEmptyTd,
  StyledTable,
  StyledTd,
  StyledTh,
  StyledThead,
  StyledTr,
  TableScroll,
} from "./Table.styles";

function Root({ children }: { children: ReactNode }) {
  return (
    <TableScroll>
      <StyledTable>{children}</StyledTable>
    </TableScroll>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <StyledThead>{children}</StyledThead>;
}

function Body({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

function Row({ children, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <StyledTr {...rest}>{children}</StyledTr>;
}

function HeadCell({
  children,
  align,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" | "center" }) {
  return (
    <StyledTh $align={align} scope="col" {...rest}>
      {children}
    </StyledTh>
  );
}

function Cell({
  children,
  align,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "right" | "center" }) {
  return (
    <StyledTd $align={align} {...rest}>
      {children}
    </StyledTd>
  );
}

function Empty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <StyledEmptyTd colSpan={colSpan}>{children}</StyledEmptyTd>
    </tr>
  );
}

export const Table = {
  Root,
  Header,
  Body,
  Row,
  HeadCell,
  Cell,
  Empty,
};
