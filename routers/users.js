const express =  require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//login

router.get('/login', (req, res)=> {
	//const { email, password } = req.body
	let errors=[]
	errors.push({message:req.flash('error')[0]})
	if (errors[0].message === undefined) {
		res.render('login')	
	}	else {	
	  res.render('login', {
		errors
	  })
  }
})

//login submit //登入檢查
router.post('/login', ( req, res, next) =>{ 	
	if ((!req.body.email) || (!req.body.password)) {
		req.flash('warning_msg', '所有欄位都是必填!')
	}
	passport.authenticate('local', {
	  successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next)
	
})


//register
router.get('/register', (req, res) =>{
	res.render('register')	
})

router.post('/register', (req, res) => {
	const { email, password, password2 } = req.body
	let {name} = req.body
	let defaultName = '天菜主廚'
	// 加入錯誤訊息提示
	let errors = []

	if ( !email || !password || !password2) {
		errors.push({ message: 'email, password 必填!' })
	}
	if (!name){
		name = defaultName
	}

	if (password !== password2) {
		errors.push({ message: '密碼輸入錯誤' })
	}

	if (errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email,
			password,
			password2
		})
	} else {
		User.findOne({ email: email }).then(user => {
			if (user) {
				// 加入訊息提示
				errors.push({ message: '這個 Email 已經註冊過了' })
				res.render('register', {
					errors,
					name,
					email,
					password,
					password2
				})
			} else {
				const newUser = new User({
					name,
					email,
					password
				})
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err
						newUser.password = hash

						newUser
							.save()
							.then(user => {
								res.redirect('/')
							})
							.catch(err => console.log(err))
					})
				)
			}
		})
	}
})

//logout
router.get('/logout', (req, res) => {
	req.logout()
	// 加入訊息提示
	req.flash('success_msg', '你已經成功登出')
	res.redirect('/users/login')
})

module.exports = router