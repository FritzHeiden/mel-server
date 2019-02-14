const Strings = {
  timestamp(totalMilliseconds) {
    const milliseconds = totalMilliseconds % 1000;
    const seconds = Math.floor(totalMilliseconds / 1000) % 60;
    const minutes = Math.floor(totalMilliseconds / 60000) % 60;
    let string = "";
    if (minutes !== 0) string += `${minutes}min `;
    if (seconds !== 0) string += `${seconds}sec `;
    string += `${milliseconds}ms`;
    return string;
  }
};

module.exports = Strings;
