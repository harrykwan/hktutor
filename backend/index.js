const express = require('express')
const app = express()
const port = 3000

app.use(express.static('html/public', {
    root: __dirname
}))
app.get('/', (req, res) => res.sendFile('html/landing.html', {
    root: __dirname
}))
app.get('/chooseside', (req, res) => res.sendFile('html/chooseside.html', {
    root: __dirname
}))
// app.get('/login', (req, res) => res.sendFile('html/login.html', { root: __dirname }))
app.get('/tutorlogin', (req, res) => res.sendFile('html/tutorlogin.html', {
    root: __dirname
}))
app.get('/studentlogin', (req, res) => res.sendFile('html/studentlogin.html', {
    root: __dirname
}))
// app.get('/register', (req, res) => res.sendFile('html/register.html', { root: __dirname }))
app.get('/tutorregister', (req, res) => res.sendFile('html/tutorregister.html', { root: __dirname }))
app.get('/studentregister', (req, res) => res.sendFile('html/studentregister.html', { root: __dirname }))
app.get('/studentprofile', (req, res) => res.sendFile('html/studentprofile.html', { root: __dirname }))
app.get('/tutorprofile', (req, res) => res.sendFile('html/tutorprofile.html', { root: __dirname }))
app.get('/home', (req, res) => res.sendFile('html/index.html', { root: __dirname }))
app.get('/emailconfirm', (req, res) => res.sendFile('html/emailconfirm.html', { root: __dirname }))
app.get('/tutorpersonalinfo', (req, res) => res.sendFile('html/tutorpersonalinfo.html', { root: __dirname }))


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))