if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const {Pool,Client} = require('pg')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const db = require('./db')



const pool = new Pool({
  user:"postgres",
  host:"localhost",
  database:"postgres",
  password:"postgres",
  port:"5432"
})

require('./passport-config')(passport, db)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'savan',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs')
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs' )
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const username = req.body.username;
    const password = hashedPassword; 
    pool.query(`INSERT INTO users("username","password") VALUES('${username}','${password}')`,(err,res)=>{

    })

    // users.push({
    //   id: Date.now().toString(),
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: hashedPassword
    // })

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)
