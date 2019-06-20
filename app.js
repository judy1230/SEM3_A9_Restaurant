const express = require('express')
const app = express()
//載入mongoose
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')
const exphbs = require('express-handlebars')

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
// setting static files
app.use(express.static('public'))

// 設定路由
// restaurant 首頁
app.get('/', (req, res) => {
	res.send('hello world!')
})

// 列出全部 Todo
app.get('/restaurants', (req, res) => {
	return res.render('index')
})

// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
	res.send('新增 Todo 頁面')
})

// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
	res.send('顯示 Todo 的詳細內容')
})

// 新增一筆  Todo
app.post('/todos', (req, res) => {
	res.send('建立 Todo')
})

// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
	res.send('修改 Todo 頁面')
})

// 修改 Todo
app.post('/todos/:id', (req, res) => {
	res.send('修改 Todo')
})

// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
	res.send('刪除 Todo')
})




// routes setting
app.get('/', (req, res) => {
	// past the movie data into 'index' partial template
//	res.render('index', { restaurants: restaurantList.results })
})

// app.get('/restaurants/:restaurant_id', (req, res) => {
// 	console.log('restaurant_id', req.params.restaurant_id)
// 	const restaurant = restaurantList.results.filter(function (item) { return item.id === Number(req.params.restaurant_id) })
// 	console.log('restaurant', restaurant)
// 	res.render('show', { restaurant: restaurant[0] })
// })

//設定express port 3000
app.listen(3000, () => {
	console.log('App is running!')
})