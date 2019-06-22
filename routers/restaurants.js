const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')

//sort restaurants
router.get('/filter', (req, res) => {
	console.log('req._parsedOriginalUrl.query', req._parsedOriginalUrl.query)
	switch (req._parsedOriginalUrl.query) {
		case 'atoz':
			Restaurant.find((err, restaurants) => {
				if (err) return console.error(err)
				return res.render('index', { restaurants: restaurants })
			}).sort({ name_en: 1 })
			break;
		case 'time':
			Restaurant.find((err, restaurants) => {
				if (err) return console.error(err)
				return res.render('index', { restaurants: restaurants })
			}).sort({ timestamp: -1 })
			break;
		case 'rating':
			Restaurant.find((err, restaurants) => {
				if (err) return console.error(err)
				return res.render('index', { restaurants: restaurants })
			}).sort({ rating: -1 })
	}
})


// 新增一筆 restaurant 頁面
router.get('/new', (req, res) => {
	res.render('new')
})

//new restaurant 頁面輸入資料儲存至mongodb
router.post('', (req, res) => {
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
router.get('/:id', (req, res) => {
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log(req.params.id)
		console.log('restaurant', restaurant)
		return res.render('show', { restaurant: restaurant })
	})
})


// redirect到修改 restaurant 頁面
router.get('/:id/edit', (req, res) => {
	//create edit.handlebars
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log('restaurant description', restaurant.description)
		return res.render('edit', { restaurant, restaurant })
	})
})

// 修改 restaurant 資料
router.put('/:id', (req, res) => {
	Restaurant.findById(req.params.id, (err, restaurant) => {
		restaurant.name = req.body.name,
			restaurant.name_en = req.body.name_en,
			restaurant.category = req.body.category,
			restaurant.image = req.body.image,
			restaurant.location = req.body.location,
			restaurant.phone = req.body.phone,
			restaurant.google_map = req.body.google_map,
			restaurant.rating = req.body.rating,
			restaurant.description = req.body.description,
			restaurant.timestamp = Date.now()
	

		restaurant.save((err) => {
			if (err) return console.error(err)
			return res.redirect('/restaurants/' + restaurant.id)
		})
	})
})



// 刪除 restaurant
router.delete('/:id/delete', (req, res) => {

	Restaurant.findById(req.params.id, (err, restaurant) => {
		if (err) return console.error(err)
		restaurant.remove(err => {
			if (err) return console.error(err)
			return res.redirect('/')
		})
	})

})




module.exports = router