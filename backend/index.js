const express = require('express')
const app = express()
const port = 3000

app.use(express.static('html/public'))
app.get('/', (req, res) => res.sendfile('html/landing.html'))
app.get('/chooseside', (req, res) => res.sendfile('html/chooseside.html'))
// app.get('/login', (req, res) => res.sendfile('html/login.html'))
app.get('/logintutor', (req, res) => res.sendfile('html/tutorlogin.html'))
app.get('/loginstudent', (req, res) => res.sendfile('html/studentlogin.html'))
// app.get('/register', (req, res) => res.sendfile('html/register.html'))
app.get('/registertutor', (req, res) => res.sendfile('html/tutorregister.html'))
app.get('/registerstudent', (req, res) => res.sendfile('html/studentregister.html'))
app.get('/profile', (req, res) => res.sendfile('html/profile.html'))
app.get('/home', (req, res) => res.sendfile('html/index.html'))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))