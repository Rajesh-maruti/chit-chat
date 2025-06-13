export const randomRgbColor = () => {
  let r = Math.floor(Math.random() * 256); // Random between 0-255
  let g = Math.floor(Math.random() * 256); // Random between 0-255
  let b = Math.floor(Math.random() * 256); // Random between 0-255
  let a = (Math.random() * (0.6 - 0.4) + 0.4).toFixed(2); // Random between 0-255
  return "rgb(" + r + "," + g + "," + b + "," + a + ")";
};
