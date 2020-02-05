import React, { Fragment, useEffect } from 'react';

export default () => {
  const keyPressHandler = k => {
    if (k.key !== 'x') return;
    const datGui = document.querySelector('.react-dat-gui');

    datGui && datGui.classList.toggle('hidden');
  };

  useEffect(() => {
    window.addEventListener('keypress', keyPressHandler);

    return () => {
      window.removeEventListener('keypress', keyPressHandler);
    };
  });

  return <Fragment />;
};
