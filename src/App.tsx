import { motion, MotionStyle, MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components'
import { useMousePosition, } from './hooks';
import './index.css';

const BUTTON_HEIGHT = 35;
const BUTTON_WIDTH = 70;
const BUTTON_RADIUS = 10;

interface CursorStatus{
  isHover: boolean;
  elementTop?: number;
  elementLeft?: number;
  height?: number;
  width?: number;
}

const App = (): JSX.Element => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorStatus, setCursorStatus] = useState<CursorStatus>({isHover: false});

  const [cursorStyle, cursorApi] = useSpring(
    () => ({
      left: '10px',
      top: '10px',
      width: '16px',
      height: '16px',
      borderRadius: '50px',
      opacity: '70%',
    }),
    []
  );

  // const [buttonStyle, buttonApi] = useSpring(
  //   () => ({
  //     transform: ''
  //   }),
  //   []
  // );

  function clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input;
  }
  
  function interpolate(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return clamp(mapped, out_min, out_max);
  }


  // useEffect(() => {
  //   console.log('hover', cursorStatus);
  // }, [cursorStatus]);

  const updateMousePosition = (e: MouseEvent) => {
    cursorApi.set({
      left: `${e.clientX - 10}px`,
      top: `${e.clientY - 10}px`,
      width: '16px',
      height: '16px',
      borderRadius: '50px',
      opacity: '70%',
    });
  };

  const updateDistanceMove = (e: MouseEvent) => {
    const event = e as MouseEvent//React.MouseEvent<HTMLButtonElement, MouseEvent>;)
    console.log('(event.target as HTMLElement).className !== adaptive)', (event.target as HTMLElement).className !== 'adaptive');
    
    if ((event.target as HTMLElement).className !== 'adaptive') {
      return;
    } 

    if (cursorStatus.elementLeft) {
      // const asd = structuredClone(style);
      const clientX = event.clientX;
      // console.log('clientX', clientX)

      const elementX = cursorStatus?.elementLeft;
      // console.log('elementX', elementX)

      const distance = clientX > elementX ? (clientX - elementX) : 0;
      if (distance < 2 || distance > BUTTON_WIDTH) {
        (event.target as HTMLElement).style.transform = '';
      }else{
        const value = interpolate(distance, 0, 70, -3, 3);
        // (event.target as HTMLElement).style.transform = buttonStyle.transform
        (event.target as HTMLElement).style.transform = `translate(${value}px, 0px)`;
      }
      // buttonApi.set({
      //   translateX: 2
      // });
    }

  };

  const updateDistanceOut = (event: MouseEvent) => {
    // if (event.target) {
    //   (event.target as HTMLElement).style.transform = 'translate(0px, 0px)';
    // }
    (event.target as HTMLElement).style.transform = '';

  };

  useEffect(() => {
    const elementsArray = document.getElementsByClassName("adaptive");
    for (const [_, element] of Object.entries(elementsArray)) {
      element.addEventListener("mouseout", handleMouseLeave);
      element.addEventListener("mouseenter", handleMouseEnter);
    }
  }, [])

  useEffect(() => {
    const { isHover, elementLeft, elementTop, height, width} = cursorStatus;

    if (isHover) {
      if (elementTop && elementLeft && height && width) {
        cursorApi.set({
          left: `${elementLeft}px`,
          top: `${elementTop}px`,
          height: `${height}px`,
          width: `${width}px`,
          borderRadius: `${BUTTON_RADIUS}px`,
          opacity: '30%',
        });
        window.addEventListener('mousemove', updateDistanceMove);
        window.addEventListener('mouseout', updateDistanceOut);
      }
    } else {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousemove', updateDistanceMove);
      window.removeEventListener('mouseout', updateDistanceOut);
    };
  }, [cursorStatus]);

  const handleMouseEnter = (e: unknown) => {
    const event = e as React.MouseEvent<HTMLButtonElement, MouseEvent>;
    console.log('event', event);
    const left = event.currentTarget.offsetLeft;
    setCursorStatus({
      isHover: true,
      elementLeft: event.currentTarget.offsetLeft,
      elementTop: event.currentTarget.offsetTop,
      height: event.currentTarget.clientHeight,
      width: event.currentTarget.clientWidth
    });
  };

  const handleMouseLeave = () => {
    setCursorStatus({
      isHover: false
    });
  };

  return (
    <Container>
      <ButtonGroup>
        <Button className='adaptive'>
          File
        </Button>
        <Button className='adaptive'>
          Edit
        </Button>
        <Button className='adaptive'>
          View
        </Button>
      </ButtonGroup>
      <Cursor ref={cursorRef} style={cursorStyle} />
    </Container>
  )
};

export default App;

const ButtonGroup = styled.div`
  margin-left: 220px;
`
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: white;
  height: 100vh;
`;

const Button = styled(animated.button)`
  height: ${BUTTON_HEIGHT}px;
  width: ${BUTTON_WIDTH}px;
  border-radius: ${BUTTON_RADIUS}px;
  /* border: 1px solid red; */
  border: 0;
  background-color: white;
  cursor: none;
  pointer-events: auto;
  color: #161616;
  transition-duration: 200ms;
  transition-property: transform;

`;

const Cursor = styled(animated.div)`
  position: absolute;
  pointer-events: none;
  background-color: #989898; 
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(.215, .61, .355, 1);
  transition-property: width, height, top, left, opacity;
`;