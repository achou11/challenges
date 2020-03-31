import * as React from "react";
import styled from "styled-components";

// Icon from https://feathericons.com
import { ReactComponent as ChevronUp } from "./assets/chevron-up.svg";

const ChevronDown = styled(ChevronUp)`
  transform: rotate(180deg);
`;

interface Props {
  direction: "up" | "down";
}

const Icon = ({ direction }: Props) => {
  switch (direction) {
    case "up":
      return <ChevronUp height={18} width={18} />;
    case "down":
      return <ChevronDown height={18} width={18} />;
    default:
      return null;
  }
};

export default Icon;
