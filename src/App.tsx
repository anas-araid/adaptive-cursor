import { useEffect, useRef, useState } from 'react';
import { useSpring } from 'react-spring';
import { BUTTON_WIDTH, BUTTON_RADIUS, CURSOR_DOWN_OPACITY, CURSOR_HOVER_OPACITY, CURSOR_INITAL_STATE } from './constants';
import { Container, ButtonGroup, Button, Cursor } from './styled';
import { interpolate } from './utils';
import './index.css';

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
      ...CURSOR_INITAL_STATE
    }),
    []
  );

  const updateCursorPosition = (e: MouseEvent) => {
    cursorApi.set({
      left: `${e.clientX - 10}px`,
      top: `${e.clientY - 10}px`,
      ...CURSOR_INITAL_STATE
    });
  };

  const handleHoverCursorMove = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).classList.contains('adaptive')) {
      return;
    } 

    if (cursorStatus.elementLeft) {
      const clientX = event.clientX;
      const elementX = cursorStatus?.elementLeft;
      const distance = clientX > elementX ? (clientX - elementX) : 0;
      
      if (distance < 2 || distance > BUTTON_WIDTH) {
        (event.target as HTMLElement).style.transform = '';
      }else{
        const value = interpolate(distance, 0, 70, -8, 5);
        cursorApi.set({
          transform: `translate(${value}px, 0px)`
        });
        (event.target as HTMLElement).style.transform = `translate(${value}px, 0px)`;
      }
    }

  };

  const handleOnHoverCursorOut = (event: MouseEvent) => {
    (event.target as HTMLElement).style.transform = '';
  };

  const handleOnButtonDown = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).classList.contains('adaptive')) {
      return;
    } 
    (event.target as HTMLElement).style.scale = '0.95'
    cursorApi.set({
      opacity: `${CURSOR_DOWN_OPACITY}%`
    });
  }

  const handleOnButtonUp = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).classList.contains('adaptive')) {
      return;
    }
    (event.target as HTMLElement).style.scale = '1';
    const { elementLeft, elementTop, height, width} = cursorStatus;

    cursorApi.set({
      left: `${elementLeft}px`,
      top: `${elementTop}px`,
      height: `${height}px`,
      width: `${width}px`,
      borderRadius: `${BUTTON_RADIUS}px`,
      opacity: `${CURSOR_HOVER_OPACITY}`,
    });
  };

  const handleCursorEnter = (e: unknown) => {
    const event = e as React.MouseEvent<HTMLButtonElement, MouseEvent>;

    setCursorStatus({
      isHover: true,
      elementLeft: event.currentTarget.offsetLeft,
      elementTop: event.currentTarget.offsetTop,
      height: event.currentTarget.clientHeight,
      width: event.currentTarget.clientWidth
    });
  };

  const handleCursorLeave = () => {
    setCursorStatus({
      isHover: false
    });
  };

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
          opacity: `${CURSOR_HOVER_OPACITY}`,
        });
        window.addEventListener('mousemove', handleHoverCursorMove);
        window.addEventListener('mouseout', handleOnHoverCursorOut);
        window.addEventListener('mousedown', handleOnButtonDown);
        window.addEventListener('mouseup', handleOnButtonUp);
      }
    } else {
      window.addEventListener('mousemove', updateCursorPosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousemove', handleHoverCursorMove);
      window.removeEventListener('mouseout', handleOnHoverCursorOut);
      window.removeEventListener('mousedown', handleOnButtonDown);
      window.removeEventListener('mouseup', handleOnButtonUp);
    };
  }, [cursorStatus]);

  useEffect(() => {
    const elementsArray = document.getElementsByClassName("adaptive");
    for (const [_, element] of Object.entries(elementsArray)) {
      element.addEventListener("mouseout", handleCursorLeave);
      element.addEventListener("mouseenter", handleCursorEnter);
    }
  }, [])

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