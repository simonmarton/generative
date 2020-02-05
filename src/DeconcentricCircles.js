import React, { Fragment } from 'react';
import { makeNoise3D } from 'open-simplex-noise';
import Color from 'color';
import DatGui, { DatColor, DatNumber, DatBoolean, DatFolder } from 'react-dat-gui';
import 'react-dat-gui/dist/index.css';

import Canvas from './Canvas';
import GuiHider from './GuiHider';
import { Easing } from './utils';

const TWO_PI = Math.PI * 2;

export default class DeconcentricCircles extends React.Component {
  state = {
    settings: {
      loop: true,
      speed: 0.05,
      colorSpeed: 0.1,
      useColor: false,
      lineColor: 'white',
      scale: 0.5,
      bumpScale: 3,
      iterations: 30,
      distance: 90,
      circleSections: 150
    },
    time: 0,
    colorTime: 0
  };
  width = window.innerWidth;
  height = window.innerHeight;

  constructor() {
    super();

    console.log(this.width, this.height);
    this.noise = makeNoise3D(1);
  }

  draw = p5 => {
    const {
      settings: {
        loop,
        lineColor,
        useColor,
        scale,
        bumpScale,
        speed,
        colorSpeed,
        iterations,
        distance,
        circleSections
      },
      time,
      colorTime
    } = this.state;

    const center = {
      x: this.width / 2,
      y: this.height / 2
    };

    // console.log(center);

    const getNoisyRadius = rad => {
      let r = rad % TWO_PI;
      if (r < 0) r += TWO_PI;

      const offset = (this.noise(scale * p5.cos(r), scale * p5.sin(r), time / 5) + 1) * 0.5;
      const smallOffset = (this.noise(bumpScale * p5.cos(r), bumpScale * p5.sin(r), time) + 1) * 0.5;
      return [offset, smallOffset];
    };

    const drawNoisyCircle = (p5, radius, fill) => {
      if (fill) {
        p5.fill(fill);
        p5.noStroke();
      } else {
        p5.noFill();
        p5.stroke(lineColor);
      }
      p5.beginShape();

      for (let angle = 0; angle < 360; angle += 360 / circleSections) {
        const rad = p5.radians(angle);

        const [offset, smallOffset] = getNoisyRadius(rad);
        const offsetRadius = radius * offset + (smallOffset * radius) / 5;

        p5.vertex(offsetRadius * p5.cos(rad) + center.x, offsetRadius * p5.sin(rad) + center.y);
      }

      p5.endShape(p5.CLOSE);
    };

    const max = iterations * distance;
    for (let i = 0; i < iterations; i++) {
      const pos = Easing.easeInOutQuad(i / iterations);

      const radius = distance / 3 + (1 - pos) * max;

      let color;
      if (useColor) {
        color = Color({ h: (1 - pos - colorTime) * 360, s: 100, l: 50 })
          .alpha(0.25 + pos / 2)
          .rgb()
          .toString();
      }
      drawNoisyCircle(p5, radius, color);
    }

    if (loop) {
      this.setState({ time: time + speed * 0.1, colorTime: colorTime + colorSpeed * 0.01 });
    }
  };

  render() {
    const { settings } = this.state;

    return (
      <Fragment>
        <GuiHider />
        <DatGui data={settings} onUpdate={settings => this.setState({ settings })} liveUpdate={false}>
          <DatBoolean path="loop" />
          {settings.loop && (
            <DatFolder title="Speed settings" closed={false}>
              <DatNumber path="speed" min={0} max={1} step={0.01} />
              <DatNumber path="colorSpeed" min={0} max={1} step={0.01} />
            </DatFolder>
          )}
          <DatBoolean path="useColor" />
          <DatNumber path="scale" min={0.5} max={5} step={0.1} />
          <DatNumber path="bumpScale" min={1} max={10} step={0.1} />
          <DatNumber path="iterations" min={1} max={40} />
          <DatNumber path="distance" min={10} max={150} step={5} />
          <DatNumber path="circleSections" min={3} max={720} _step={1} />

          <DatColor path="lineColor" />
        </DatGui>
        <Canvas draw={this.draw} width={this.width} height={this.height} background="#333" _noLoop />
      </Fragment>
    );
  }
}
