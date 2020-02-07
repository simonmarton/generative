import React, { useState, useEffect } from 'react';
import Sketch from 'react-p5';

import './Canvas.css';

export default ({
  width,
  height,
  noLoop,
  background: backgroundProp = 'black',
  fullscreen,
  resized = () => {},
  ...props
}) => {
  const [firstDraw, setFirstDraw] = useState(true);

  const [background, setBackground] = useState(backgroundProp);

  useEffect(() => {
    setBackground(backgroundProp);
  }, [backgroundProp]);

  const update = p5 => {
    p5.redraw();
  };

  const setup = (p5, canvasParentRef) => {
    p5.setAttributes('antialias', true);
    p5.createCanvas(
      fullscreen ? window.innerWidth : width,
      fullscreen ? window.innerHeight : height,
      props.webgl ? p5.WEBGL : undefined
    ).parent(canvasParentRef);

    p5.frameRate(30);
    // if (noLoop) {
    //   p5.noLoop();
    // }
  };

  const draw = p5 => {
    if (!noLoop || firstDraw) {
      p5.background(background);
      props.draw(p5);

      setFirstDraw(false);
    }
  };

  return (
    <div style={{ background }}>
      <Sketch
        setup={setup}
        draw={draw}
        preload={props.preload}
        mouseClicked={p5 => {
          setFirstDraw(true);

          setTimeout(() => update(p5), 10);
        }}
        windowResized={p5 => {
          p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
          resized(p5);
        }}
      />
    </div>
  );
};
