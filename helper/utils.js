const crypto = require("crypto");

const validasiTgl = (value, helpers) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([2-9][0-9]{3})$/;
  let match = value.match(regex);

  if (!match) {
    return helpers.error("any.invalid");
  }

  let day = parseInt(match[1], 10);
  let month = parseInt(match[2], 10) - 1;
  let year = parseInt(match[3], 10);

  let dateObj = new Date(year, month, day);

  const isValid =
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month &&
    dateObj.getDate() === day;

  if (!isValid) {
    return helpers.error("any.invalid");
  }

  let today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() < month ||
    (today.getMonth() === month && today.getDate() < day)
  ) {
    age--;
  }

  if (age < 13) {
    return helpers.error("any.invalid");
  }

  return value;
};

const generateApiKey = (length) => {
  let result = "";
  while (result.length < length) {
    const bytes = crypto.randomBytes(length);
    const str = bytes.toString("base64").replace(/[^a-zA-Z0-9]/g, "");
    result += str;
  }
  return result.slice(0, length);
};


module.exports = {
  validasiTgl,
  generateApiKey,
};
