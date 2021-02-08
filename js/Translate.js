import React from 'react';
import { useSpring, animated } from 'react-spring';

const Translate = () => {
  const spring = useSpring({
    from: {
      transform: `translate(0px)`,
    },
    to: {
      transform: `translate(120px)`,
    },
    config: {
      mass: 6,
    },
  });

  return <animated.div style={{ ...spring, display: 'inline-block' }}>Translated Div</animated.div>;
};

export default Translate;