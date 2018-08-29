var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0; // checks for a string that is greater then length 0.  trim() removes spaces
};

module.exports = {isRealString};
