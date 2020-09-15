const CONFIG = {
  /** Minimum diameter of the dot in px */
  minDotDiameter: 10,
  /** Maximun diameter of the dot in px */
  maxDotDiameter: 100,
  /** Game level (speed = (1 * 10)px/s) */
  initLevel: 1,
  /** Frequency to push dot in ms (1000ms = 1s)*/
  frequency: 1000,
  /** Game autospeed increase frequency */
  gameLevelFreq: 20,
  /** Count of maximum lost dot for game over */
  maxLostCount: 10,
  /** Configure dot colors {radius: color} */
  colors: {
    10: 'rgba(255, 255, 255, 1)',
    20: 'rgba(255, 0, 0, 0.9)',
    30: 'rgba(31, 47, 155, 0.8)',
    40: 'rgba(0, 128, 0, 0.7)',
    50: 'rgba(244, 205, 9, 0.6)',
    60: 'rgba(71, 9, 62, 0.5)',
    70: 'rgba(128, 0, 0, 0.4)',
    80: 'rgba(9, 18, 71, 0.3)',
    90: 'rgba(230, 9 , 234, 0.2)',
    100: 'rgba(12, 12, 12, 0.2)',
  },
  /** Play button configuration */
  play: {
    label: 'Play',
    src: 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fplay.svg?1553448787217'
  },
  /** Pause button configuration */
  pause: {
    label: 'Pause',
    src: 'https://cdn.glitch.com/27f1b8ee-3948-4cb4-9c64-3854da42f337%2Fpause.svg?1553448788762'
  },
};

export default CONFIG;