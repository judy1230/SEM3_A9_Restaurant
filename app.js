const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
	require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}



//連線到mongoDB
mongoose.connect('mongodb://localhost/restaurant', { useNewUrlParser: true})
//mongoose 連線後透過mongoose.connection拿到 connection的物件
const db = mongoose.connection

//連線成功
db.on('error', () => {
	console.log('mongodb error!')
})

//連線成功
db.once('open', () => {
	console.log('mongodb connected!')
})

//express template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// setting static files
app.use(express.static('public'))

app.use(session({
	secret: 'aaaaaaaaaaaaaaa',
	resave: 'false',
	saveUninitialized: 'false'   // secret: 定義一組自己的私鑰（字串)
}))
// 使用 Passport 
app.use(passport.initialize())
app.use(passport.session())

// 載入 Passport config
require('./config/passport')(passport)


app.use(flash())

app.use((req, res, next) => {
	res.locals.user = req.user
	res.locals.isAuthenticated = req.isAuthenticated()
	res.locals.success_msg = req.flash('success_msg')
	res.locals.warning_msg = req.flash('warning_msg')
	next()
})

app.use('/', require('./routers/home.js'))
app.use('/restaurants', require('./routers/restaurants.js'))
app.use('/users', require('./routers/users.js'))
app.use('/auth', require('./routers/auths'))

//設定express port 3000
app.listen(3000, () => {
	console.log('App is running!')
})