import * as React from "react";
import styled from "styled-components";

import { palette } from "./colors";

const Container = styled.div`
  display: flex;
  min-height: 70vh;
  justify-content: center;
  align-items: center;
`;

// Copied from https://loading.io/css/
const Spinner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: ${palette.lightPurple} transparent ${palette.lightPurple}
      transparent;
    animation: dual-ring 1.2s linear infinite;
  }

  @keyframes dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loading = () => (
  <Container>
    <Spinner />
  </Container>
);

export default Loading;
