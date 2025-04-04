import styled from "styled-components";

type FlexProps = {
  direction?: "row" | "column";
  gap?: string;
};

export const StyledFlexCenter = styled.div<FlexProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: ${({ direction = "row" }) => direction};
  gap: ${({ gap = "0px" }) => gap};
`;

export const StyledSearchHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;
