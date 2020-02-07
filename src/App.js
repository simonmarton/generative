import React from 'react';

import Perlin from './Perlin';
import DeconcentricCircles from './DeconcentricCircles';
import Cloud from './Cloud';
import MaskedImage from './MaskedImage';
import YinYang from './YinYang';

const routes = [
  {
    path: 'dots-n-lines',
    component: <Perlin />
  },
  {
    path: 'cloud',
    component: <Cloud />
  },
  {
    path: 'mask',
    component: <MaskedImage />
  },
  {
    path: 'deconcentric-circles',
    component: <DeconcentricCircles />
  },
  {
    path: 'yin-yang',
    component: <YinYang />
  }
];

export default () => {
  const {
    location: { pathname }
  } = window;

  for (const { path, component } of routes) {
    if (pathname.startsWith(`/${path}`)) {
      return component;
    }
  }

  return (
    <ul>
      {routes.map(({ path, component }) => (
        <li key={path}>
          <a href={`/${path}`}>{path}</a>
        </li>
      ))}
    </ul>
  );
};
