import React, { Fragment, useState, useEffect } from 'react';
import { makeNoise3D } from 'open-simplex-noise';
import Color from 'color';
import DatGui, { DatColor, DatNumber, DatBoolean, DatSelect } from 'react-dat-gui';
import 'react-dat-gui/dist/index.css';

import { Easing, lerp } from './utils';
import Canvas from './Canvas';

const noise3D = makeNoise3D(Date.now());

const DEFAULT_BG_COLOR = '#1e2127';

const METHOD_OPTIONS = {
  lines: 'Crosses with a mask',
  dots: 'Colorful dots'
};

export default () => {
  // const [width, height] = [320, 320];
  const [width, height] = [720, 720];
  // const [width, height] = [window.innerWidth, window.innerHeight];

  const [offset, setOffset] = useState(0);

  const [guiData, setGuiData] = useState({
    speed: 0.01,
    scale: 0.005,
    maxPointSize: 20,
    visibliityScale: 0.003,
    visibilityThreshold: 0.3,
    loop: false,
    easingFunction: 'easeInQuadOutQuint',
    visibilityEasingFunction: 'easeInOutQuint',
    method: METHOD_OPTIONS.lines,
    enableVisibilityMask: false,
    enableVisibilityMaskColor: false,
    lineColor: '#fdff6a',
    horizontalLines: true,
    verticalLines: false
  });

  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BG_COLOR);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    canvas && canvas.click();

    if (guiData.method === METHOD_OPTIONS.dots) {
      setBackgroundColor('black');
    } else {
      setBackgroundColor(DEFAULT_BG_COLOR);
    }
  }, [guiData]);

  const drawColorfulPointCloud = p5 => {
    const { maxPointSize, scale } = guiData;
    const minPointSize = 1,
      minPointBorder = 2;
    for (let x = 0; x < width; x += maxPointSize) {
      for (let y = 0; y < height; y += maxPointSize) {
        const noiseValue = (noise3D(x * scale, y * scale, offset) + 1) * 0.5;

        p5.strokeWeight(minPointSize + (maxPointSize - minPointSize - minPointBorder) * noiseValue);

        const color = Color({ h: noiseValue * 400 + 40, s: 100, l: 50 });

        p5.stroke(color.hex());
        p5.point(x, y);
      }
    }

    setOffset(offset + guiData.speed);
  };

  const draw = p5 => {
    const { maxPointSize, scale } = guiData;

    const rotatePoint = (cx, cy, angle, x, y) => {
      const rad = (angle * Math.PI) / 180.0;
      const s = Math.sin(rad),
        c = Math.cos(rad);

      x -= cx;
      y -= cy;

      const x2 = x * c - y * s,
        y2 = x * s + y * c;

      return [x2 + cx, y2 + cy];
    };

    const rotateLine = (x1, y1, x2, y2, angle) => {
      const cx = (x1 + x2) / 2,
        cy = (y1 + y2) / 2;

      return [...rotatePoint(cx, cy, angle, x1, y1), ...rotatePoint(cx, cy, angle, x2, y2)];
    };

    for (let x = maxPointSize / 2; x < width; x += maxPointSize) {
      for (let y = maxPointSize / 2; y < height; y += maxPointSize) {
        let noiseValue = (noise3D(x * scale, y * scale, offset) + 1) * 0.5;
        noiseValue = Easing[guiData.easingFunction](noiseValue);

        let visibilityNoiseValue;

        if (guiData.enableVisibilityMask) {
          visibilityNoiseValue =
            (noise3D(x * guiData.visibliityScale, y * guiData.visibliityScale, offset / 4) + 1) * 0.5;
          visibilityNoiseValue = Easing[guiData.visibilityEasingFunction](visibilityNoiseValue);

          if (visibilityNoiseValue < guiData.visibilityThreshold) {
            continue;
          }
        }

        const d = lerp(2, maxPointSize / 2, noiseValue);
        const rotateDeg = 160 * noiseValue;

        p5.strokeWeight(lerp(1, 5, noiseValue)); // gui

        let visibliityTransparency = 1;
        if (guiData.enableVisibilityMask) {
          const visibilityMaxThreshold = 0.9; // gui

          if (visibilityNoiseValue < visibilityMaxThreshold) {
            visibliityTransparency = Easing.easeOutQuint(
              (visibilityNoiseValue - guiData.visibilityThreshold) /
                (visibilityMaxThreshold + guiData.visibilityThreshold)
            );
          }
        }

        let color;
        if (guiData.enableVisibilityMask && guiData.enableVisibilityMaskColor) {
          color = Color({ h: Easing.easeInQuadOutQuint(visibilityNoiseValue) * 400 + 40, s: 60, l: 50 }).alpha(
            visibliityTransparency
          );
        } else {
          color = Color(guiData.lineColor).alpha(visibliityTransparency);
        }

        p5.stroke(color.rgb().toString());

        // if (x < width * 0.22 && x > width / 5 && y > height * 0.78 && y < height * 0.8) {
        // ??? noiseValue suddenly has a non-smooth value (0.5)
        // }

        if (guiData.horizontalLines) {
          p5.line(...rotateLine(x - d, y, x + d, y, rotateDeg));
        }
        if (guiData.verticalLines) {
          p5.line(...rotateLine(x, y - d, x, y + d, rotateDeg)); // gui
        }
      }
    }

    setOffset(offset + guiData.speed);
  };

  let method = draw;
  if (guiData.method === METHOD_OPTIONS.dots) {
    method = drawColorfulPointCloud;
  }

  return (
    <Fragment>
      <DatGui data={guiData} onUpdate={setGuiData} liveUpdate={false}>
        <DatNumber path="speed" min={0} max={0.02} step={0.005} />
        <DatBoolean path="loop" />
        <DatSelect path="easingFunction" options={Object.keys(Easing)} />
        <DatSelect path="method" options={Object.values(METHOD_OPTIONS)} />
        <DatNumber path="maxPointSize" min={1} max={50} step={5} />
        <DatBoolean path="enableVisibilityMask" />
        <DatBoolean path="enableVisibilityMaskColor" />
        <DatBoolean path="horizontalLines" />
        <DatBoolean path="verticalLines" />
        <DatColor path="lineColor" />
      </DatGui>
      <Canvas draw={method} width={width} height={height} background={backgroundColor} noLoop={!guiData.loop} />
    </Fragment>
  );
};
