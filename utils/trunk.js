function trunk(name, length = 20) {
  return name.substring(0, length) + "...";
}
module.exports = trunk;
