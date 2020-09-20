/**
 * @param {Number} min Minimum integer (less than max).
 * @param {Number} max Maximum integer (greater than min).
 * @returns {Number} A random number between min and max
 */
export const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}