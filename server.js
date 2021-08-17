const express = require('express')
const app = express()
const ejs = require('ejs')
const { generateHash, confirmHash } = require('./modules/bcrypt.js')
require('dotenv').config()

const PORT = process.env.PORT || 5500

app.use( express.json())
app.use( express.urlencoded({extended: true}))
app.use( express.static('./public'))
app.use( express.static('./node_modules/bootstrap/dist'))
app.set('view engine', 'ejs')


app.listen(PORT, () => console.log("Server is running on localhost:" + PORT))

let data = []

app.get('/', (req, res) => {
	res.render('index', {
		data: ""
	})
})

app.get('/login', (req, res) => {
	res.render('login', {
		error: ""
	})
})
app.post('/login', async (req, res) => {
	try {
		console.log("Data", data)
		let { login, password } = req.body
		if(login && password) {
			login = login.toLowerCase()
			let user = await data.find(x => x.signup === login)
			if(!user) throw new Error('User not found!')
				let isTrue = await confirmHash(password, user.password)
			if(isTrue) {
				res.redirect('/')
			} else {
				throw new Error('The password is incorrect!')
			}
		}
	} catch (err) {
		res.render('login', {
			error: err + ''
		})
	}
	
})

app.get('/signup', (req, res) => {
	res.render('signup', {
		error: ""
	})
})

app.post('/signup', async (req, res) => {
	try {
		let { signup, password } = req.body
		if( signup && password ){
			signup = signup.toLowerCase()
			let hash = await generateHash(password)	
			if(data.find(user => user.signup == signup)){
				throw new Error("The user already exists!")
			} else {
				data.push({
					signup,
					password: hash
				})
				res.redirect('/')
			}
		} else {
			res.redirect('/signup')
		}
	} catch (err) {
		res.render('signup', {
			error: err + ''
		})
	}
})