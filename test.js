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

// const newArray = array.map((x) => {
//   while (true) { console.log('A') }
// })

// console.log(newArray)

function ㄅ (ㄆ, ㄇ) {
  let printf = 0
  for (let num = 0; num < ㄆ.length; num++) {
    printf += ㄇ(ㄆ[num])
  }
  return printf
}

// const test = ㄅ(array, (x) => x * 10)
// console.log(test)

// const array = [0, 1, 0, 0, 1, 0, 1, 2, 0, 4]

// function select (list, fn) {
//   const newArray = list
//   for (let i = 0; i < newArray.length; i++) {
//     if (newArray[i] === 0) {
//       newArray[i] = 'wall'
//     } else if (newArray[i] === 1) {
//       newArray[i] = 'road'
//     } else {
//       newArray[i] = fn(newArray[i])
//     }
//   }
//   return newArray
// }

// const maze = select(array, (x) => {
//   if (x === 2) {
//     x = 'item'
//     console.log('create new item')
//   } else {
//     x = 'bomb'
//     console.log('create new bomb')
//   }
//   return x
// })

// console.log(maze)

function ㄅ(){
  return 'hello'
}

ㄅ.ㄆ = 'ㄇ'

console.log(ㄅ)