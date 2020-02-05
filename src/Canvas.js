import React, { useState, useEffect } from 'react';
import Sketch from 'react-p5';

import './Canvas.css';

export default ({ width, height, noLoop, background: backgroundProp = 'black', fullscreen, ...props }) => {
  const [firstDraw, setFirstDraw] = useState(true);

  const [background, setBackground] = useState(backgroundProp);

  useEffect(() => {
    setBackground(backgroundProp);
  }, [backgroundProp]);

  const update = p5 => {
    p5.redraw();
  };

  const setup = (p5, canvasParentRef) => {
    // p5.createCanvas(width, height, p5.WEBGL).parent(canvasParentRef);
    p5.createCanvas(width, height).parent(canvasParentRef);
    // console.log(p5.WEBGL);
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

  // console.log({ background });

  // return <h1 style={{ background }}>na miva</h1>;

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
      />
    </div>
  );
};
