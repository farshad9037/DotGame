const CONFIG = {
  minDotDiameter: 10, // Minimum diameter of the dot in px
  maxDotDiameter: 100, // Maximun diameter of the dot in px
  initLevel: 10, // Game level (speed = (1 * 10)px/s)
  frequency: 1000, // Frequency to push dot in ms (1000ms = 1s)
  gameLevelFreq: 100, // Game autospeed increase frequency
  maxLostCount: 10, // Count of maximum lost dot for game over
  colors: { // Configure dot colors {radius: color}
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
  }
};

export default CONFIG;