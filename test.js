const translate = require('translation-google')
const tunnel = require('tunnel')
translate('Ik spreek Engels', { to: 'en' }, {
  agent: tunnel.httpsOverHttp({
    proxy: {
      host: 'http://woyaozousini.site/',
      proxyAuth: 'user:pass',
      port: '3000',
      headers: {
        'User-Agent': 'Node'
      }
    }
  }
  )
}).then(res => {
  console.log(res.text)
}).catch(err => {
  console.error(err)
})

async function main () {
  // translate('Hello world', { to: 'chinese', key: 'YOUR-KEY-HERE', engine: 'libre' }).then(text => {
  //   console.log(text)
  // })

  translate('你好', { from: 'zh-cn', to: 'en' }).then(res => {
    console.log(res.text)
  }).catch(err => {
    console.error(err)
  })
}

// main()

// translate('Ik spreek Engels', { to: 'en' }, {
//   agent: tunnel.httpsOverHttp({
//     proxy: {
//       host: 'https://woyaozousini.site/',
//       port: '80'
//     }
//   }
//   )
// }).then(res => {
//   console.log(res.text)
//   // do something
// }).catch(err => {
//   console.error(err)
// })
