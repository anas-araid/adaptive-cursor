import { animated } from "react-spring";
import styled from "styled-components";
import { BUTTON_HEIGHT, BUTTON_WIDTH, BUTTON_RADIUS } from "./constants";

export const ButtonGroup = styled.div`
  margin-left: 220px;
`
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: white;
  height: 100vh;
`;

export const Button = styled(animated.button)`
  height: ${BUTTON_HEIGHT}px;
  width: ${BUTTON_WIDTH}px;
  border-radius: ${BUTTON_RADIUS}px;
  border: 0;
  background-color: white;
  cursor: none;
  pointer-events: auto;
  color: #161616;
  transition-duration: 200ms;
  transition-property: transform;

`;

export const Cursor = styled(animated.div)`
  position: absolute;
  pointer-events: none;
  background-color: #989898; 
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  transition-property: width, height, top, left, opacity;
  mix-blend-mode: multiply;
`;