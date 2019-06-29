const mongoose = require('mongoose')
const Restaurant = require('../restaurant.js')
const restaurantList = require('./restaurant.json')
const User = require('../user.js')
const bcrypt = require('bcryptjs')

const templeUser = [{ name: '', email: 'user1@example.com', password: '12345678' },
{ name: '', email: 'user2@example.com', password: '12345678' }]


mongoose.connect('mongodb://localhost/restaurant', {useNewUrlParser: true})

const db = mongoose.connection
db.on('error', () => {
	console.log('db error')
})

db.once('open', () => {
	console.log('db connected!')
	
	for (let i =0; i < templeUser.length; i++){
		name = templeUser[i].name
		if(name==[]){
			name = '天菜主廚'
		}
		email = templeUser[i].email
		password = templeUser[i].password
		index = i
		console.log('name',name)
		console.log('email', email)
		console.log('password', password)
		generateNewUser(name, email, password, index)
	}										
	
	  function generateNewUser(name, email, password, index) {
			const newUser = new User({ name, email, password })
			
	    bcrypt.genSalt(10, (err, salt) =>
			  bcrypt.hash(newUser.password, salt, (err, hash) => {
				  if (err) throw err
				  newUser.password = hash
				  newUser.save().then((user) => {
						console.log('user',user)
						console.log('user._id', user._id)
						for (let i = 3 * index + 1; i <= 3 * (index + 1); i++) {
						  Restaurant.create({
							  "userID": user._id,
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
					})
			})
		)

		console.log('done')
	}
})	

	
	
	
	
