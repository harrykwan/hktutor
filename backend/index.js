const express = require('express')
const app = express()
const port = 3000

app.use(express.static('html/public', { root: __dirname }))
app.get('/', (req, res) => res.sendFile('html/landing.html', { root: __dirname }))
app.get('/chooseside', (req, res) => res.sendFile('html/chooseside.html', { root: __dirname }))
// app.get('/login', (req, res) => res.sendFile('html/login.html', { root: __dirname }))
app.get('/logintutor', (req, res) => res.sendFile('html/tutorlogin.html', { root: __dirname }))
app.get('/loginstudent', (req, res) => res.sendFile('html/studentlogin.html', { root: __dirname }))
// app.get('/register', (req, res) => res.sendFile('html/register.html', { root: __dirname }))
app.get('/registertutor', (req, res) => res.sendFile('html/tutorregister.html', { root: __dirname }))
app.get('/registerstudent', (req, res) => res.sendFile('html/studentregister.html', { root: __dirname }))
app.get('/profile', (req, res) => res.sendFile('html/profile.html', { root: __dirname }))
app.get('/home', (req, res) => res.sendFile('html/index.html', { root: __dirname }))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))