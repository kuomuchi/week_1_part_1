const translate = require('translation-google')

async function main () {
  // translate('Hello world', { to: 'chinese', key: 'YOUR-KEY-HERE', engine: 'libre' }).then(text => {
  //   console.log(text)
  // })

  translate('你好', { from: 'zh-cn', to: 'en' }).then(res => {
    console.log(res.text)
  })
}

main()
