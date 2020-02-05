import React from 'react';
import { makeNoise3D } from 'open-simplex-noise';

import Canvas from './Canvas';

export default class Cloud extends React.Component {
  width = 120;
  height = 120;
  scale = 0.01;
  speed = 0.1;

  state = {
    time: 0
  };

  constructor() {
    super();

    this.noise = makeNoise3D(1);
  }

  draw = p5 => {
    const { time } = this.state;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const scaledNoise = scale => (this.noise(x * scale, y * scale, time) + 1) * 0.5;
        const val = scaledNoise(this.scale) * 0.8 + scaledNoise(0.05) * 0.1; // + scaledNoise(0.1) * 0.1;

        p5.stroke(`rgba(255, 255, 255, ${val.toFixed(2)})`);
        // p5.strokeWeight(1);
        p5.point(x, y);
      }
    }

    this.setState({ time: time + this.speed });
    // console.log('render');
  };

  render() {
    return <Canvas draw={this.draw} width={this.width} height={this.height} _noLoop />;
  }
}
