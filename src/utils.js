const RUN_TESTS = false;
export const Easing = {
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1),
  easeInOutQuint: t => (t < 0.5 ? 16 * t ** 5 : 1 + 16 * (t - 1) ** 5),
  easeOutQuint: t => 1 + (t - 1) ** 5,
  easeInQuadOutQuint: t => (t < 0.5 ? 2 * t * t : 1 + 16 * (t - 1) ** 5)
};

// value between [0, 1]
export const lerp = (min, max, value) => {
  return (max - min) * value + min;
};

const test = (value, expected) => {
  if (typeof expected !== 'number' || typeof expected !== 'number') {
    throw new Error('Not supported test');
  }
  if (value.toFixed(4) !== expected.toFixed(4)) {
    throw new Error(`Expected: ${expected}\nGot: ${value}`);
  }
};

if (RUN_TESTS) {
  test(lerp(0, 100, 0.73), 73);
  test(lerp(1.5, 2.5, 0.3), 1.8);
  test(lerp(-50.4, 32.5, 0.9), 24.21);
  test(lerp(10, 0, 0.4), 6);
}
