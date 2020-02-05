import React from 'react';

import Perlin from './Perlin';
import DeconcentricCircles from './DeconcentricCircles';
import Cloud from './Cloud';
import MaskedImage from './MaskedImage';

export default () => {
  const {
    location: { pathname }
  } = window;

  if (pathname.startsWith('/dots-n-lines')) {
    return <Perlin />;
  } else if (pathname.startsWith('/cloud')) {
    return <Cloud />;
  } else if (pathname.startsWith('/mask')) {
    return <MaskedImage />;
  }
  return <DeconcentricCircles />;
};
