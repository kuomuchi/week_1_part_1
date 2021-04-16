const { rejects } = require('assert')
const { resolve } = require('path')
const { promisify } = require('util')

// function test2 (data) {
//   let ans = 1
//   for (let i = 0; i < data; i++) {
//     ans *= data
//   }
//   return data
// }

// function test1 (cb) {
//   cb(null, test2)
// }

// const getTest = promisify(test1)
// console.log(getTest())
// console.log(getTest)
// // console.log(obj.getnum())

// getTest(1234).then((a) => { console.log(a) })

// const sleep = promisify((ms, cb) => setTimeout(cb, ms))
// sleep(3000).then(() => console.log('3 sec pass'))

const ㄅarray = [1, 2, 3, 4, 5]

function ans (x) {
  for (let num = 0; num < ㄅarray.length; num++) {
    ㄅarray[num] *= x()
  }
  return ㄅarray
}

console.log(ans((num) => {
  let useNum = 0
  if (num === undefined) {
    useNum = 20
  } else {
    useNum = num
  }
  return +useNum
}))
