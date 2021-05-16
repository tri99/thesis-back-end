function getAgeTag(age) {
  const si = 0;
  if (age < 3) {
    return si;
  } else if (age < 10) {
    return si + 1;
  } else if (age < 20) {
    return si + 2;
  } else if (age < 30) {
    return si + 3;
  } else if (age < 40) {
    return si + 4;
  } else if (age < 50) {
    return si + 5;
  } else if (age < 60) {
    return si + 6;
  } else if (age < 70) {
    return si + 7;
  } else {
    return si + 8;
  }
}
function getAgeTagName(tag) {
  const ageNames = [
    "0-2",
    "3-9",
    "10-19",
    "20-29",
    "30-39",
    "40-49",
    "50-59",
    "60-69",
    "70+",
  ];
  return ageNames[tag];
}

module.exports = {
  getAgeTag,
  getAgeTagName,
};
