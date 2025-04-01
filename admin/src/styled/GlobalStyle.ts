import styled from "styled-components";

interface FlexProps {
  direction?: "row" | "column";
  gap?: string;
}

export const FlexCenter = styled.div<FlexProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${(props) => props.direction || "row"};
  gap: ${(props) => props.gap || "0"};
`;
