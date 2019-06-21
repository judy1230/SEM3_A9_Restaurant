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
	Restaurant.find((err, restaurants) => {             
		if (err) return console.error(err)
		return res.render('index', { restaurants: restaurants })  
	})
})


// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
	res.send('新增 Todo 頁面')
})

// 顯示一筆 Restaurant 的詳細內容
app.get('/restaurants/:id', (req, res) => {
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log(req.params.id)
		console.log('restaurant', restaurant)
		return res.render('show', { restaurant: restaurant })
	})
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



//設定express port 3000
app.listen(3000, () => {
	console.log('App is running!')
})