export const getPos = () => {
  if (window.innerHeight > 900) {
    return { x: 0, y: window.innerHeight * (35 / 100) };
  } else if (window.innerHeight > 760 && window.innerHeight < 900) {
    return { x: 0, y: window.innerHeight * (20 / 100) };
  } else if (window.innerHeight >= 700 && window.innerHeight < 760) {
    return { x: 0, y: window.innerHeight * (16 / 100) };
  } else if (window.innerHeight >= 600 && window.innerHeight < 700) {
    return { x: 0, y: window.innerHeight * (6 / 100) };
  } else {
    return { x: 0, y: 0 };
  }
};

export const getBound = () => {
  if (window.innerHeight > 900) {
    return { top: 0, bottom: window.innerHeight * (35 / 100), left: 0, right: 0 };
  } else if (window.innerHeight > 760 && window.innerHeight < 900) {
    return { top: 0, bottom: window.innerHeight * (20 / 100), left: 0, right: 0 };
  } else if (window.innerHeight >= 700 && window.innerHeight < 760) {
    return { top: 0, bottom: window.innerHeight * (16 / 100), left: 0, right: 0 };
  } else if (window.innerHeight >= 600 && window.innerHeight < 700) {
    return { top: 0, bottom: window.innerHeight * (6 / 100), left: 0, right: 0 };
  } else {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
};
