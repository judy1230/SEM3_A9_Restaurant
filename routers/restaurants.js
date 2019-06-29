const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant.js')
const { authenticated } = require('../config/auth.js')

//sort restaurants
router.get('/sort', authenticated, (req, res) => {

	switch (req._parsedOriginalUrl.query) {
		case 'atoz':
			Restaurant.find({ userID: req.user._id })
				.sort({ name: 1 })
				.exec((err, restaurants) => {
					if (err) return console.error(err)
					return res.render('index', { restaurants: restaurants })
				})
			break;
		case 'time':
			Restaurant.find({ userID: req.user._id })
				.sort({ timestamp: -1 })
				.exec((err, restaurants) => {
					if (err) return console.error(err)
					return res.render('index', { restaurants: restaurants })
				})
			break;
		case 'rating':
			Restaurant.find({ userID: req.user._id })
				.sort({ rating: -1  })
				.exec((err, restaurants) => {
					if (err) return console.error(err)
					return res.render('index', { restaurants: restaurants })
				})
	}
})


// 新增一筆 restaurant 頁面
router.get('/new', authenticated, (req, res) => {
	res.render('new')
})

//new restaurant 頁面輸入資料儲存至mongodb
router.post('/', authenticated, (req, res) => {
	const { name, name_en, category, image, location, phone,
		 google_map, rating, description} = req.body
	let errors = []

	const restaurant = Restaurant({
		userID: req.user._id,
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
	
	

	if (!name || !phone || !location || !name_en || !category || !image || !google_map || !rating || !description) {
		errors.push({ message: '所有項目必填!' })
		console.log('errors.length', errors.length)
	}
  
	if (errors.length > 0) {
		res.render('new', {
			errors,
			name,
			location,
			phone
		})
	}	
	
	else {
		restaurant.save((err) => {
			if (err) return console.log(err)
			console.log(`add ${req.body.name} restaurant in mongodb!`)
			return res.redirect('/')
		})
		}
	
})

// 顯示一筆 Restaurant 的詳細內容
router.get('/:id', authenticated, (req, res) => {
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log(req.params.id)
		console.log('restaurant', restaurant)
		return res.render('show', { restaurant: restaurant })
	})
})


// redirect到修改 restaurant 頁面
router.get('/:id/edit', authenticated, (req, res) => {
	//create edit.handlebars
	Restaurant.findById(req.params.id, (err, restaurant) => {
		console.log('restaurant description', restaurant.description)
		return res.render('edit', { restaurant, restaurant })
	})
})

// 修改 restaurant 資料
router.put('/:id', authenticated, (req, res) => {
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
router.delete('/:id/delete', authenticated, (req, res) => {

	Restaurant.findById(req.params.id, (err, restaurant) => {
		if (err) return console.error(err)
		restaurant.remove(err => {
			if (err) return console.error(err)
			return res.redirect('/')
		})
	})

})


module.exports = router