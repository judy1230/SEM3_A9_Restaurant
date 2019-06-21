const express = require('express')
const app = express()
//載入mongoose
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant.js')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')



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


// 新增一筆 restaurant 頁面
app.get('/restaurants/new', (req, res) => {
	res.render('new')
})

//new restaurant 頁面輸入資料儲存至mongodb
app.post('/restaurants', (req, res) => {
	const restaurant = Restaurant({
		name: req.body.name,
		name_en: req.body.name_en,
		category: req.body.category,
		image: req.body.image,
		location: req.body.location,
		phone: req.body.phone,
		google_map: req.body.google_map,
		rating: req.body.rating,
		description: req.body.description
	})
	restaurant.save((err) => {
		if (err) return console.log(err)
		console.log(`add ${req.body.name} restaurant in mongodb!`)
		return res.redirect('/')
	})
})

// 顯示一筆 Restaurant 的詳細內容
app.get('/restaurants/:id', (req, res) => {
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log(req.params.id)
		console.log('restaurant', restaurant)
		return res.render('show', { restaurant: restaurant })
	})
})


// redirect到修改 restaurant 頁面
app.get('/restaurants/:id/edit', (req, res) => {
	//create edit.handlebars
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log('restaurant description', restaurant.description)
		return res.render('edit', { restaurant, restaurant })
	})
})

// 修改 restaurant 資料
app.post('/restaurants/:id', (req, res) => {
	Restaurant.findById(req.params.id, (err, restaurant) => {
		restaurant.name = req.body.name,
		restaurant.name_en = req.body.name_en,
		restaurant.category = req.body.category,
		restaurant.image = req.body.image,
		restaurant.location = req.body.location,
		restaurant.phone = req.body.phone,
		restaurant.google_map = req.body.google_map,
		restaurant.rating = req.body.rating,
		restaurant.description = req.body.description
		
		restaurant.save((err) => {
			console.log('restaurant.id', restaurant.id)
			return res.redirect('/restaurants/' + restaurant.id)
		})
	})
})



// 刪除 restaurant
app.post('/restaurants/:id/delete', (req, res) => {
	
		Restaurant.findById(req.params.id, (err, restaurant) => {
			if (err) return console.error(err)
			restaurant.remove(err => {
				if (err) return console.error(err)
				return res.redirect('/')
			})
   })		
			
})
	

//search

app.get('/search', (req, res) => {
	Restaurant.find((err, restaurants) => {
		const keyword = req.query.keyword
		if (err) return console.error(err)
		const restaurantSearch = restaurants.filter(({name, category}) => {
			// return (name || category) includes keyword
			return (category.toLowerCase().includes(keyword.toLowerCase()) || name.toLowerCase().includes(keyword.toLowerCase()))
		})
		return res.render('index', { restaurants: restaurantSearch })
	})	
})







//設定express port 3000
app.listen(3000, () => {
	console.log('App is running!')
})