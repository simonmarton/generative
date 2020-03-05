import React from 'react';

import Perlin from './Perlin';
import DeconcentricCircles from './DeconcentricCircles';
import Cloud from './Cloud';
import MaskedImage from './MaskedImage';
import YinYang from './YinYang';
import { useState } from 'react';

const routes = [
  {
    path: 'cloud',
    component: <Cloud />
  },
  {
    path: 'mask',
    component: <MaskedImage />
  },
  {
    path: 'yin-yang',
    component: <YinYang />
  },
  {
    path: 'dots-n-lines',
    component: <Perlin />
  },
  {
    path: 'deconcentric-circles',
    component: <DeconcentricCircles />
  }
];

export default () => {
  const [component, setComponent] = useState(null);

  window.onhashchange = () => {
    checkComp();
  };

  const checkComp = () => {
    const {
      location: { hash }
    } = window;

    if (!hash && component) {
      setComponent(null);
    }

    for (const { path, component: c } of routes) {
      if (hash.startsWith(`#${path}`)) {
        if (component !== c) setComponent(c);
        break;
      }
    }
  };
  checkComp();

  if (component) {
    return component;
  }

  return (
    <ul>
      {routes.map(({ path }) => (
        <li key={path}>
          <a href={`/#${path}`}>{path}</a>
        </li>
      ))}
    </ul>
  );
};
