import React, { Fragment } from 'react';

import Canvas from './Canvas';

export default class YinYang extends React.Component {
  state = {
    settings: {
      size: window.innerHeight - 20
    },
    center: {
      x: 0,
      y: 0
    }
  };

  rotation = 0;

  rotatePoint = (cx, cy, x, y, angle) => {
    const s = Math.sin(angle),
      c = Math.cos(angle);

    x -= cx;
    y -= cy;

    const x2 = x * c - y * s,
      y2 = x * s + y * c;

    return [x2 + cx, y2 + cy];
  };

  drawYinYang = (p5, { center, size, rotation, anti, debug }) => {
    p5.noStroke();

    p5.fill('black');
    p5.arc(center.x, center.y, size, size, rotation + p5.PI, rotation);
    p5.fill('white');
    debug && p5.fill('red');
    p5.arc(center.x, center.y, size, size, rotation, rotation + p5.PI);

    const drawRotatedCirclePair = ({ center: { x, y }, size, distance, angle, colors: [a, b] }) => {
      p5.fill(anti ? b : a);
      p5.circle(...this.rotatePoint(x, y, x - distance, y, angle), size);

      p5.fill(anti ? a : b);
      p5.circle(...this.rotatePoint(x, y, x + distance, y, angle), size);
    };

    drawRotatedCirclePair({
      center,
      size: size / 2,
      distance: size / 4,
      angle: rotation,
      colors: ['white', 'black']
    });

    drawRotatedCirclePair({
      center,
      size: size / 6,
      distance: size / 4,
      angle: rotation,
      colors: ['black', 'white']
    });
  };

  draw = p5 => {
    const {
      center,
      settings: { size }
    } = this.state;

    const rotation = this.rotation;

    this.drawYinYang(p5, { center, size, rotation });

    const { x: cx, y: cy } = center,
      half = size / 2,
      quarter = half / 2,
      eight = quarter / 2;

    let [x, y] = this.rotatePoint(cx, cy, cx - quarter, cy, rotation);
    this.drawYinYang(p5, { center: { x, y }, size: half, rotation: -rotation, anti: true });

    [x, y] = this.rotatePoint(cx, cy, cx + quarter, cy, rotation);
    this.drawYinYang(p5, { center: { x, y }, size: half, rotation: -rotation, anti: true });

    [x, y] = this.rotatePoint(
      cx,
      cy,
      cx - quarter + p5.cos(rotation * 2) * eight,
      cy + p5.sin(-rotation * 2) * eight,
      rotation
    );
    this.drawYinYang(p5, { center: { x, y }, size: quarter, rotation });

    [x, y] = this.rotatePoint(
      cx,
      cy,
      cx + quarter + p5.cos(-rotation * 2) * eight,
      cy - p5.sin(rotation * 2) * eight,
      rotation
    );
    this.drawYinYang(p5, { center: { x, y }, size: quarter, rotation });

    [x, y] = this.rotatePoint(
      cx,
      cy,
      cx + quarter - p5.cos(rotation * 2) * eight,
      cy - p5.sin(-rotation * 2) * eight,
      rotation
    );
    this.drawYinYang(p5, { center: { x, y }, size: quarter, rotation });

    [x, y] = this.rotatePoint(
      cx,
      cy,
      cx - quarter - p5.cos(-rotation * 2) * eight,
      cy + p5.sin(rotation * 2) * eight,
      rotation
    );
    this.drawYinYang(p5, { center: { x, y }, size: quarter, rotation });

    this.rotation = this.rotation + 0.01;
  };

  render() {
    return (
      <Fragment>
        <Canvas
          draw={this.draw}
          resized={p5 => {
            this.setState({
              center: {
                x: p5.windowWidth / 2,
                y: p5.windowHeight / 2
              }
            });
          }}
          background="#333"
          fullscreen
          webgl
        />
      </Fragment>
    );
  }
}
