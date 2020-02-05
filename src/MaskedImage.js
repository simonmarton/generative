import React from 'react';
import { makeNoise3D } from 'open-simplex-noise';

import Canvas from './Canvas';
import { Easing } from './utils';

import image from './assets/forest.jpg';

export default class MaskedImage extends React.Component {
  state = {
    settings: {
      scale: 0.02,
      speed: 0.01
    },
    time: 0,
    img: null
  };

  width = 720;
  height = 720;
  noise = null;

  constructor() {
    super();

    this.noise = makeNoise3D(1);
  }

  preload = p5 => {
    const img = p5.loadImage(image);
    this.setState({ img });
  };

  draw = p5 => {
    const { img, settings, time } = this.state;

    if (!img) {
      console.log('no image');
      return;
    }

    let mask = p5.createImage(200, 200);
    mask.loadPixels();
    for (let i = 0; i < mask.width; i++) {
      for (let j = 0; j < mask.height; j++) {
        const n = this.noise(i * settings.scale, j * settings.scale, time);
        const noise = Easing.easeInOutQuint((n + 1) * 0.5);

        // console.log({ n, noise });

        mask.set(i, j, p5.color(255, 0, 0, noise * 255.0));
      }
    }
    mask.updatePixels();

    img.mask(mask);
    p5.image(img, 0, 0);
    // p5.image(mask, 0, 0);

    this.setState({ time: time + settings.speed });
  };

  render() {
    // const { img } = this.state;

    return <Canvas draw={this.draw} preload={this.preload} width={this.width} height={this.height} _noLoop />;
  }
}
