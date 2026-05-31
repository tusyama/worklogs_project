import styled from "styled-components";

export const CardRoot = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const CardHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CardBody = styled.div``;
