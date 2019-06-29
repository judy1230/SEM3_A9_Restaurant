const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')
const restaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant', {useNewUrlParser: true})

const db = mongoose.connection
db.on('error', () => {
	console.log('db error')
})

db.once('open', () => {
	console.log('db connected!')
	
	for (let i = 0; i < restaurantList.results.length/2; i++){
    Restaurant.create({
			//"id": restaurantList.results[i].id,
			"name": restaurantList.results[i].name,
			"name_en": restaurantList.results[i].name_en,
			"category": restaurantList.results[i].category,
			"image": restaurantList.results[i].image,
			"location": restaurantList.results[i].location,
			"phone": restaurantList.results[i].phone,
			"google_map": restaurantList.results[i].google_map,
			"rating": restaurantList.results[i].rating,
			"description": restaurantList.results[i].description,
			"timestamp": restaurantList.results[i].timestamp
		})
		 }
	
	console.log('done')
})