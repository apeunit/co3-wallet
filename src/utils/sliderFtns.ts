export const getPos = () => {
  // if (window.innerHeight > 1200) {
  //   return { x: 0, y: window.innerHeight * (25 / 100) };
  // } else if (window.innerHeight > 900) {
  //   return { x: 0, y: window.innerHeight * (25 / 100) };
  // } else if (window.innerHeight > 760 && window.innerHeight < 900) {
  //   return { x: 0, y: window.innerHeight * (36 / 100) };
  // } else if (window.innerHeight >= 700 && window.innerHeight < 760) {
  //   return { x: 0, y: window.innerHeight * (30 / 100) };
  // } else if (window.innerHeight >= 600 && window.innerHeight < 700) {
  //   return { x: 0, y: window.innerHeight * (36 / 100) };
  // } else if (window.innerHeight >= 400 && window.innerHeight < 700) {
  //   return { x: 0, y: window.innerHeight * (46 / 100) };
  // } else {
  //   return { x: 0, y: 0 };
  // }
  return { x: 0, y: window.innerHeight * (46 / 100) };
};

export const getBound = () => {
  // if (window.innerHeight > 900) {
  //   return { top: 5, bottom: window.innerHeight * (45 / 100), left: 0, right: 0 };
  // } else if (window.innerHeight > 760 && window.innerHeight < 900) {
  //   return { top: 5, bottom: window.innerHeight * (36 / 100), left: 0, right: 0 };
  // } else if (window.innerHeight >= 700 && window.innerHeight < 760) {
  //   return { top: 5, bottom: window.innerHeight * (16 / 100), left: 0, right: 0 };
  // } else if (window.innerHeight >= 600 && window.innerHeight < 700) {
  //   return { top: 5, bottom: window.innerHeight * (6 / 100), left: 0, right: 0 };
  // } else {
  //   return { top: 5, bottom: 0, left: 0, right: 0 };
  // }
  return { top: 5, bottom: window.innerHeight * (46 / 100), left: 0, right: 0 };
};
