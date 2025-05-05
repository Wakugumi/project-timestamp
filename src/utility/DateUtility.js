exports.getUnixTimestampString = () => {
  return Math.floor(Date.now() / 1000).toString();
};
