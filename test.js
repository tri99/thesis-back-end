// let myArray = [1, 2, 3, 4, 1, 2, 1, 2];

// uniqueArray = myArray.filter(function (elem, pos) {
//   return myArray.indexOf(elem) == pos;
// });

// console.log(uniqueArray);

let a = [1, 2, 3, 4, 2, 4, 2, 23];
let b = [2, 4, 2, 23];
a.push.apply(a,b)
console.log(a);