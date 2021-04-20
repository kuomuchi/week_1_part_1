require('dotenv').config() // 隱藏檔案.env

const { promisify } = require('util') // node.js 工具

const express = require('express')

// 基礎架設server
const mysql = require('mysql') // mysql
const app = express()
const bodyParser = require('body-parser') // 處理post出來的body，讓req.body可以跑出資料。
const aws = require('aws-sdk')

// 檔案處理工具
const uuid = require('uuid').v4 // 處理image的東東
const multer = require('multer') // 獲取圖片的部分
const path = require('path') //  整理檔案，指定檔案
const multerS3 = require('multer-s3') // multer在aws 上使用S3
aws.config.update({ // 設置基本資料
  accessKeyId: process.env.AWS_image_id,
  secretAccessKey: process.env.AWS_image_key,
  region: 'us-east-2'
})

const s3 = new aws.S3()

const storage = multer.diskStorage({ // 圖片歸檔設定
  destination: function (req, file, cd) {
    cd(null, 'image')
  },
  filename: function (req, file, cb) {
    const { originalname } = file
    cb(null, originalname)
  }
})

const upload = multer({ storage })

const awsUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'appworkschool-image',
    contentType: multerS3.AUTO_CONTENT_TYPE, // 最棒的東西！自動偵測檔案的副檔名
    key: function (req, file, cb) {
      console.log(file)
      cb(null, file.originalname) // use Date.now() for unique file keys
    }
  })
})

const jwt = require('jsonwebtoken') // 製作前端加密 token

const { createHash } = require('crypto') // 引入密碼

const NodeCache = require('node-cache') // 快存

const rateLimit = require('express-rate-limit') // 引入「限制post次數」

const limiter = rateLimit({ // 設定post次數
  windowMs: 5000, // 1秒
  max: 3, // limit each IP to 10 requests per windowMs
  message: '為什麼要ddos呢'
})

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })

const axios = require('axios') // 抓取外部的資訊 (for facebook 使用)
const TapPay = require('tappay-nodejs') // tapPay

TapPay.initialize({
  partner_key: process.env.TapPay_key,
  env: 'sandbox'
})

// You just need to initilize the config once.

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.urlencoded({ extended: false })) // 使用body-parser，讓req.body的回傳值不會是undefined

app.use('/admin', express.static('public')) // 可以以「/admin」為前提在，public裡獲取資料。

// app.set('public engine', 'html');

app.get('/', limiter, (req, res) => {
  // res.sendFile(__dirname + '/public/welcome.html');
  res.sendFile(path.join(__dirname, '/public/html/index.html'))
})

// connect db
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_database,
  waitForConnections: true,
  connectionLimit: 10
})

// connect db is err
// db.connect((err) => {
//   if (err) {
//     throw err
//   }
// })

// 搜尋product這個table 裡面的所有資料
app.get('/selectusers', (req, res) => {
  const sql = 'SELECT * FROM product'
  let transResult = ''

  db.query(sql, (error, results) => {
    // db.connect()
    // db.end()
    if (error) throw error
    transResult = JSON.parse(JSON.stringify(results))
    console.log(transResult)
    res.send('select...')
  })
})

// 這是聆聽3000喔
app.listen(3000, () => {
  console.log('run on 3000')
})

// week_2_part_1
app.get('/admin/checkout.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/checkout.html'))
})

app.post('/admin/checkout.html', (req, res) => {
  const postData = {
    prime: req.body.prime
  }

  console.log(postData)
  req.body.prime = postData
  res.send(req.body.prime)
})

app.post('/order/checkout', (req, res) => {
  console.log(req.headers)
  console.log(req.body)
})

app.post('/order/checkout', async (req, res) => {
  const userData = []

  userData[0] = req.body.prime
  userData[1] = req.body.order
  userData[2] = req.body.list
  userData[3] = false

  if (userData[0] === undefined) {
    userData[0] = 'naaaaa'
  }

  for (let i = 1; i < 3; i++) {
    if (userData[i] === undefined) {
      userData[i] = { code: 'Hi Gan sha li ah' }
    }
  }

  const paymentInfo = {
    prime: '99736cfcc83c8af3f69c7ac1670928c29d116330583beeca84b5103432044532',
    merchant_id: 'AppWorksSchool_CTBC',
    amount: 1,
    currency: 'TWD',
    details: 'An apple and a pen.',
    cardholder: {
      phone_number: '+886923456789',
      name: '王小明',
      email: 'LittleMing@Wang.com'
    },
    remember: true
  }

  TapPay.payByPrime(paymentInfo, async (error, result) => {
    if (error) throw error

    console.log(result)
    if (result.msg === 'Success') {
      userData[3] = true
    }

    const post = { prime: userData[0], oder: `${JSON.stringify(userData[1])}`, list: `${JSON.stringify(userData[1])}`, pay: `${userData[3]}` }
    const sql = 'INSERT INTO week_2_part_2 SET ?'
    db.query(sql, post, (err, result) => {
      if (err) throw err
      console.log('丟上mysql')
      console.log(result)
    })

    const sq = 'SELECT * FROM week_2_part_2'
    // let transResult = "";
    db.query(sq, (err, results) => {
      if (err) throw err

      // transResult = JSON.parse(JSON.stringify(results));
      const printf = { data: { number: results.id } }

      res.json(printf)
    })
  })
})

// week_1_part_5

app.get('/admin/campaign.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/campaign.html'))
})

app.post('/admin/campaign.html', upload.single('main'), (req, res) => {
  const local = 'https://woyaozousini.site/'
  console.log(req.body)

  const post = { product_id: req.body.product_id, story: req.body.story, picture: local + req.file.destination + '/' + req.file.filename }
  const sql = 'INSERT INTO week_1_part_5 SET ?'
  db.query(sql, post, (err, result) => {
    if (err) throw err
    console.log(result)
    res.send('nice')
  })
})

app.get('/api/1.0/marketing/campaigns', (req, res) => {
  const sql = 'SELECT * FROM week_1_part_5'
  let transResult = ''
  db.query(sql, (err, results) => {
    if (err) throw err
    transResult = JSON.parse(JSON.stringify(results))
    console.log(results)

    const printf = { data: transResult }

    res.json(printf)
  })
})

/// ///當有人在product.html輸入資料

// in product there, when post! and.....do soemthing!
// 當在「product.html」收到post時。
app.post('/admin/product.html', upload.array('main_image', 4), (req, res) => {
  const local = 'woyaozousini.site'

  // get all post req, and make a array
  // 取得所有的input post結果
  const allpostdata = [req.body.title, req.body.description, req.body.price, req.body.texture, req.body.wash, req.body.place, req.body.note, req.body.story, req.body.selec]

  // 所有的衣服尺碼
  const allsieze = [req.body.sizes, req.body.sizem, req.body.sizel, req.body.sizexl, req.body.sizexxl]
  // 新建立一個array
  const postsize = []

  // 將所有的被選取的衣服size放入array。
  for (let i = 0; i < allsieze.length; i++) {
    const size = ['S', 'M', 'L', 'XL', 'XXL']
    if (allsieze[i] === 'on') {
      postsize.push(size[i])
    }
  }

  // 抓取所有顏色的數值。
  const allcolor = [req.body.colorblue, req.body.colorred, req.body.colorgreen]
  const postcolor = []
  let now = 0
  for (let i = 0; i < allcolor.length; i++) {
    const color = ['blue', 'red', 'green']
    // all colors table
    const colornum = ['#0000ff', '#ff0000', '#00ff00']

    // 如果顏色為on
    if (allcolor[i] === 'on') {
      // 加入一個物件。
      postcolor.push({})

      // 將資料輸入對應的key
      postcolor[now].code = colornum[i]
      postcolor[now].name = color[i]
      now++
    }
  }

  // 將images輸入array裡面
  const allimage = []
  for (let i = 1; i < req.files.length; i++) {
    const thing = `${local + req.files[i].destination}/${req.files[i].filename}`
    allimage.push(thing)
  }

  // 建立一個新的變體
  const chld = []
  let chldnow = 0

  // 自動產生所有的變體
  for (let i = 0; i < postcolor.length; i++) {
    for (let u = 0; u < postsize.length; u++) {
      chld.push({})
      chld[chldnow].color_code = postcolor[i].code
      chld[chldnow].size = postsize[u]
      chld[chldnow].stock = Math.floor(Math.random() * 100) + 1
      chldnow++
    }
  }

  // 把所有並非obj的資料，放入 FOR
  for (let i = 0; i < allpostdata.length; i++) {
    // when find any input is null
    // then return get fail
    if (allpostdata[i] === '') {
      console.log('NO NULL YOU BAD BAD!!')
      res.sendFile(path.join(__dirname, '/public/errorPage.html'))
      return
    }
  }

  // 當沒有輸入圖片時，回傳YOU BAD BAD
  if (!req.files[0]) {
    console.log('NO images YOU BAD BAD!!')
    res.sendFile(path.join(__dirname, '/public/errorPage.html'))
    return
  }

  // if input != null
  // create a new thing

  const post = { title: req.body.title, description: allpostdata[1], price: allpostdata[2], texture: allpostdata[3], wash: allpostdata[4], place: allpostdata[5], note: allpostdata[6], story: allpostdata[7], colors: `${JSON.stringify(postcolor)}`, sizes: `${JSON.stringify(postsize)}`, variants: `${JSON.stringify(chld)}`, main_image: local + req.files[0].destination + '/' + req.files[0].filename, images: `${JSON.stringify(allimage)}`, categories: req.body.selec }
  const sql = 'INSERT INTO product SET ?'
  db.query(sql, post, (err, result) => {
    if (err) throw err
    console.log(result)
  })

  // back to the 「product.html」
  res.sendFile(path.join(__dirname, '/public/product.html'))
})

/// ////////product.html結束///////////product.html結束///////////product.html結束///////////product.html結束///////////product.html結束
/// ////////product.html結束///////////product.html結束///////////product.html結束///////////product.html結束///////////product.html結束
/// ////////product.html結束///////////product.html結束///////////product.html結束///////////product.html結束///////////product.html結束

app.get('/image/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '/image/', req.params.id))
})

const erwin = ['Tian.jpeg', 'nice.jpg']
let erwinnum = 1

app.get('/Erwin/great', (req, res) => {
  erwinnum++
  const num = erwinnum % 2
  console.log(erwin[num])
  res.sendFile(path.join(__dirname, '/image/', erwin[num]))
})

// 抓取MySQL的資料，抓取page的後6比資料
function getWebApi (sq, page) {
  const key = ['productList', 'productpage']
  let keynum = 0
  if (page === 666) {
    keynum = 1
  }
  return new Promise((resolve, reject) => {
    if (myCache.get(key[0]) === undefined || keynum === 1) {
      console.log('首次撈資料')
      let web
      db.query(sq, (err, result) => {
        if (err) throw err

        web = JSON.parse(JSON.stringify(result))
        let nextPage = 1
        const sqlData = {}

        // 將所有資料裡的 string 轉換為 obj
        for (let i = 0; i < web.length; i++) {
          if (web[i] == null) break
          web[i].colors = JSON.parse(web[i].colors)
          web[i].sizes = JSON.parse(web[i].sizes)
          web[i].variants = JSON.parse(web[i].variants)
          web[i].images = JSON.parse(web[i].images)
        }

        // 如果第7比資料是null，將不會回將paging的物件。
        if (web[6] == null) {
          nextPage = 0
        }

        if (web.length === 7) {
          web.pop()
        }

        // 因作業需求，新增了一個名為Data的key
        // 其Value為 MySQl抓下來的所有資料。

        if (web.length === 1) {
          sqlData.data = web[0]
        } else {
          sqlData.data = web
        }
        if (nextPage === 0) {
          console.log(nextPage)
        } else {
          sqlData.next_paging = +page + 1
        }

        // 回傳sqlData
        if (keynum === 1) {
          resolve(sqlData)
        } else {
          myCache.set(key[keynum], sqlData, 10000)
          resolve(sqlData)
        }
      })
    } else {
      console.log('重複的資料')
      const data = myCache.get(key[keynum])
      resolve(data)
    }
  })
}

// create api
app.get('/api/1.0/products/:id', (req, res) => {
  const { keyword } = req.query
  const { paging } = req.query
  const { id } = req.query
  let fix = 0
  let wordkey = keyword

  if (paging === undefined) {
    fix = 0
  } else {
    fix = paging
  }
  if (keyword === undefined) {
    wordkey = ''
  }
  let sql = `SELECT * FROM product WHERE title LIKE '%${wordkey}%' LIMIT ${fix * 6},7`

  if (req.params.id === 'details') {
    sql = `SELECT * FROM product WHERE id = ${id}`
    fix = 666
  }

  getWebApi(sql, fix).then(res.json.bind(res))
})

// 從共筆獲得到的function，可以透過此function GET FaceBook的資料
async function getFacebookUserData (access_token) {
  const { data } = await axios({
    url: 'https://graph.facebook.com/me',
    method: 'get',
    params: {
      fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(','),
      access_token: access_token
    }
  })
  // console.log(data); // { id, email, first_name, last_name , picture}
  return data
}

// 獲取加密的password
async function addpass (password) {
  const hash = createHash('sha256') // 創建一個新的hash，使用sha256
  hash.update(password)
  return password = await hash.digest('hex')
}

// 判斷email的部分。
function selectuser (sql) {
  return new Promise((resolve, reject) => {
    const query = db.query(sql, (err, result) => {
      if (err) throw err

      let jg = false
      const transResult = result

      if (result !== '') {
        jg = true
      }
      // b[1] = jg

      // b = JSON.parse(JSON.stringify(result));

      resolve(transResult)
    })
  })
}

// 登入以及登出

app.get('/api/1.0/user/signin', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/homepage.html'))
})

app.get('/api/1.0/user/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/signup.html'))
})

// 登入
app.post('/api/1.0/user/signin', async (req, res) => {
  console.log(req.body)
  const { provider, access_token } = req.body

  if (req.body.password === '') {
    console.log('password error')
    res.send('密碼還敢填空啊！冰鳥！')
    return
  }

  if (provider === 'facebook') {
    const fbdata = await getFacebookUserData(access_token)
    const printfout = { data: { user: {} } }

    if (fbdata.email === undefined) {
      fbdata.email = 'nano@getMaxListeners.com'
    }

    const token = jwt.sign(fbdata, process.env.JWT_key, { expiresIn: '3600s' }) // 創造一個jwt
    req.headers.authorization = 'Bearer ' + token // 將jwt存入header

    printfout.data.access_token = token
    printfout.data.access_expired = 3600
    printfout.data.user.id = fbdata.id
    printfout.data.user.provider = provider
    printfout.data.user.name = fbdata.last_name + fbdata.first_name
    printfout.data.user.email = fbdata.email
    printfout.data.user.picture = fbdata.picture.data.url

    req.body.provider = provider
    req.body.email = fbdata.email

    res.send(printfout)
    return
  } else {
    // 將密碼加密
    addpass(req.body.password).then((data) => {
      const newdata = data
      const sql = `SELECT * FROM account WHERE email = '${req.body.email}' AND password = '${newdata}'`
      // 搜尋email

      selectuser(sql).then((email) => {
        if (email === '') {
          res.send('email 或是 密碼 錯誤')
        } else {
          const transResult = JSON.parse(JSON.stringify(email))

          console.log('成功進入！')
          const token = jwt.sign({ username: email[0].username, email: req.body.email, password: newdata }, process.env.JWT_key, { expiresIn: '3600s' }) // 創造一個jwt

          req.headers.authorization = 'Bearer ' + token // 將jwt存入header

          // const decoded = jwt.verify(token, newdata); //獲取jwt的數值

          const alldata = { data: {} }
          alldata.data.access_token = token
          alldata.data.access_expired = 3600
          alldata.data.user = {}
          alldata.data.user.id = transResult[0].id
          alldata.data.user.provider = 'Nano'
          alldata.data.user.name = transResult[0].username
          alldata.data.user.email = transResult[0].email
          alldata.data.user.picture = 'https://schoolvoyage.ga/images/123498.png'

          req.body.provider = 'Nano'
          req.body.password = newdata
          // console.log(token+"\n"+decoded);
          console.log(alldata)
          res.status(200).send(alldata)
        }
      })
    })
  }

  console.log('出去signin')
})

app.post('/api/1.0/user/signup', (req, res) => {
  console.log('進入signup')
  // 抓取input的值。
  const user = [req.body.name, req.body.email, req.body.password]
  console.log(req.body)
  console.log('test')
  const sql = `SELECT * FROM account WHERE email = '${user[1]}'`

  // 判斷email是否重複
  selectuser(sql).then((email) => {
    // 沒有重複的話，直接註冊7小時。

    if (email === '') {
      console.log('keep')
      addpass(user[2]).then((data) => {
        const newdata = data
        const post = { username: user[0], email: user[1], password: newdata }
        const sql = 'INSERT INTO account SET ?'
        db.query(sql, post, (err, result) => {
          if (err) throw err

          const token = jwt.sign(post, process.env.JWT_key, { expiresIn: '3600s' }) // 創造一個jwt
          req.headers.authorization = 'Bearer ' + token // 將jwt存入 header
          // const decoded = jwt.verify(token, newdata); //獲取jwt的數值

          const alldata = { data: {} }
          alldata.data.access_token = token
          alldata.data.access_expired = 3600
          alldata.data.user = {}
          alldata.data.user.id = 123
          alldata.data.user.provider = 'Nano'
          alldata.data.user.name = req.body.email
          alldata.data.user.email = user[1]
          alldata.data.user.picture = 'https://schoolvoyage.ga/images/123498.png'

          req.body.id = 1234
          req.body.name = user[0]
          req.body.email = user[1]
          req.body.password = newdata
          console.log('this')
          console.log(alldata)

          res.send(alldata)
        })
      })
    } else {
      console.log('還敢註冊啊！冰鳥！！有E東西重複了喔 :D')
      res.send('還敢註冊啊！冰鳥！！有E東西重複了喔 :D')
    }
  })
  console.log('出去signup')
})

app.get('/api/1.0/user/profile', (req, res) => {
  let admin = 0
  const gettoken = req.headers.authorization
  const decoded = jwt.verify(gettoken, process.env.JWT_key)
  console.log(decoded.email)
  if (decoded.email === 'test') {
    console.log('is admin')
    admin = 1
  }
  res.send({ data: admin })
})

app.post('/api/1.0/user/profile', (req, res) => {
  console.log(req.headers)
  console.log(req.body.token)

  const gettoken = req.body.token

  // const gettoken = req.headers.authorization.split(' ')[1]

  const decoded = jwt.verify(gettoken, process.env.JWT_key)
  const printout = { data: {} }
  console.log(decoded)

  if (decoded.password === undefined) {
    printout.data.provider = 'facebook'
    printout.data.name = decoded.last_name + decoded.first_name
    printout.data.email = decoded.email
    printout.data.picture = decoded.picture.data.url
  } else {
    printout.data.provider = 'native'
    printout.data.name = decoded.username
    printout.data.email = decoded.email
    printout.data.picture = 'https://schoolvoyage.ga/images/123498.png'
  }

  res.send(printout)
})

app.get('/index.html', limiter, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/html/index.html'))
})

app.get('/product.html', limiter, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/html/product.html'))
})

app.get('/cart.html', limiter, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/html/cart.html'))
})

// 購物車消費
app.post('/cart.html', (req, res) => {
  console.log(req.body)

  const uderData = req.body
  uderData.pay = false
  console.log(uderData.email)

  const paymentInfo = {
    prime: uderData.prime,
    merchant_id: 'AppWorksSchool_CTBC',
    amount: uderData.product.length,
    currency: 'TWD',
    details: 'nano',
    cardholder: {
      phone_number: uderData.phone,
      name: uderData.name,
      email: uderData.email
    },
    remember: true
  }

  TapPay.payByPrime(paymentInfo, async (error, result) => {
    if (error) throw error

    console.log(result)
    if (result.msg === 'Success') {
      uderData.pay = true
    }

    if (uderData.pay === false) {
      res.send(result)
    } else {
      const post = { prime: uderData.prime, oder: `${JSON.stringify(paymentInfo)}`, list: `${JSON.stringify(uderData.product)}`, pay: `${uderData.pay}` }
      const sql = 'INSERT INTO week_2_part_2 SET ?'
      db.query(sql, post, (err, result) => {
        if (err) throw err
        console.log('丟上mysql')
      })

      const sq = 'SELECT * FROM week_2_part_2'
      // let transResult = "";
      db.query(sq, (err, results) => {
        if (err) throw err

        const transResult = JSON.parse(JSON.stringify(results))
        const dealData = transResult.length
        const printf = { data: transResult[dealData - 1].id }
        res.json(printf)
      })
    }
  })
})

app.post('/product.html', (req, res) => {
  console.log('nice')
  res.send('no thing!!!')
})

app.get('/profile.html', limiter, (req, res) => {
  res.sendFile(path.join(__dirname, '/public/html/profile.html'))
})

const player = { data: { status: 0, player1: 'nano', player2: 'nano' } }

app.post('/figthing', (req, res) => {
  const addPlayer = req.body.data
  console.log(req.body)

  player.data.status += addPlayer
  if (player.data.status === 1) {
    player.data.player1 = req.body.name
    res.send(JSON.stringify(player))
  } else if (player.data.status === 2) {
    player.data.player1 = req.body.name
    res.send(JSON.stringify(player))
  } else {
    const msg = { data: '人數滿了' }
    res.send(msg)
  }
})

app.post('/mathstart', (req, res) => {
  console.log(req.body)

  console.log(player.data.status)
  console.log('hee')

  if (player.data.status === 1) {
    console.log('loading')
    res.send({ data: 'notYet' })
  } else if (player.data.status === 2) {
    console.log('start')
    res.send(player)
  }
})

app.get('/mathstart', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/startMath.html'))
})
app.get('/figthing', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/math.html'))
})

app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/html/thankyou.html'))
})

// test place

app.get('/admin/test.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/test.html'))
})

app.post('/admin/test.html', awsUpload.array('main', 3), (req, res) => {
  console.log('getIn')
  // 如果沒有收到圖片:D
  if (!req.files) {
    console.log('no-image')
    res.send('bad')
  } else {
    // 你棒棒！！並且回傳圖片的位置。哭啊！
    // console.log(req.files+" + "+ req.files.length +" + "+ req.files[0].destination);
    console.log(req.files)
    res.json({ upload: req.files })
  }
})

// console.log(b.length);
// res.json(b.length);
// console.log(b.length);

// async function jeff(asd){
//   return await aa(asd);
// }

// function aa(asd){
//   return new Promise((resolve, reject)=>{
//     let query = db.query(asd, (err, results) =>{
//       if(err) throw err;
//       b = JSON.parse(JSON.stringify(results));
//       // console.log(b.length);
//       resolve(b);
//     });

//   });

// }

// app.get('/nisgood', (req, res)=>{

//   let sql = 'SELECT * FROM product';
//   aa(sql).then(res.json.bind(res));
// });

// // 測試用的鮭魚
// app.get('/addobj', (req, res) => {
//   const post = { test: '{"red" : "#ff0000"}' }
//   const sql = 'INSERT INTO salmon SET ?'
//   const query = db.query(sql, post, (err, result) => {
//     if (err) throw err
//   })
//   console.log(typeof (query))
//   res.send('add some obj!!!')
// })

// // 查看鮭魚的狀況
// app.get("/selectsalmon", (req, res) => {
//   const sql = "SELECT * FROM salmon";
//   let transResult = "";
//   const query = db.query(sql, (err, results) => {
//     if (err) throw err;
//     transResult = JSON.parse(JSON.stringify(results));
//     console.log(transResult.length);
//     console.log(results);
//   });
//   res.send("select....");
// });

// app.get("/token", (req, res) => {
// });
