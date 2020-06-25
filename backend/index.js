const express = require('express')
const awsapi = require('./src/awsapi.js');
const viemoapi = require('./src/vimeo.js');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');
const fileUpload = require('express-fileupload')

const app = express()
const port = 80


app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());



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

app.get('/tutorregister', (req, res) => res.sendFile('html/tutorregister.html', {
    root: __dirname
}))
app.get('/studentregister', (req, res) => res.sendFile('html/studentregister.html', {
    root: __dirname
}))

app.get('/tutorprofile', (req, res) => res.sendFile('html/tutorprofile.html', {
    root: __dirname
}))
app.get('/studentprofile', (req, res) => res.sendFile('html/studentprofile.html', {
    root: __dirname
}))

app.get('/home', (req, res) => res.sendFile('html/home.html', {
    root: __dirname
}))
app.get('/emailconfirm', (req, res) => res.sendFile('html/emailconfirm.html', {
    root: __dirname
}))
app.get('/tutorpersonalinfo', (req, res) => res.sendFile('html/tutorpersonalinfo.html', {
    root: __dirname
}))

app.get('/videoupload', (req, res) => res.sendFile('html/videoupload.html', {
    root: __dirname
}))

app.get('/videoshow', (req, res) => res.sendFile('html/videoshow.html', {
    root: __dirname
}))

app.get('/videohome', (req, res) => res.sendFile('html/videohome.html', {
    root: __dirname
}))



app.use(fileUpload());

app.post('/uploadtolocal/:uid', (req, res) => {
    var uid = req.params.uid;
    var file = req.files.file;
    if (uid && file) {
        const viemofilename = file.name
        var filename = uid + '_' + file.name
        file.mv('./uploads/' + filename, function (err) {
            if (err) {
                console.log(err)
            } else {
                // res.send('ok')
                viemoapi.upload('./uploads/' + filename, viemofilename, "", undefined, undefined, function (uri) {
                    awsapi.readitem("userprofiledata", uid, undefined, undefined,
                        function (data) {
                            console.log(data)
                            var tempitem = data.Item
                            console.log(tempitem)
                            if (tempitem.videolist) {
                                tempitem.videolist.push(uri)
                            } else {
                                tempitem.videolist = [uri]
                            }

                            console.log(tempitem)
                            awsapi.createitem("userprofiledata", tempitem, req, res)
                        })

                })
            }
        })
    } else {
        res.send('error')
    }

})


app.get('/getallvideo', (req, res, next) => {
    viemoapi.getallvideo(req, res)
})


app.use(busboy());
app.use(busboyBodyParser());



app.get('/vimeogetembedvideo/:url', (req, res, next) => {
    viemoapi.getvideoembedvideo(req.params.url, req, res)
})




app.post('/awsupload', (req, res, next) => {
    awsapi.upload(req, res, next)
})

app.get('/awsdownload/:key', (req, res) => {
    awsapi.getphoto(req.params.key, req, res)
})

app.post('/cvupload', (req, res, next) => {
    // console.log(req.files)
    awsapi.cvupload(req, res, next)
})


app.post('/awscreatedata', (req, res) => {
    console.log(req.body)
    awsapi.createitem("userprofiledata", req.body, req, res)
})

app.get('/awsreaddata/:uid', (req, res) => {
    awsapi.readitem("userprofiledata", req.params.uid, req, res)
})



app.post('/updatevideodata', (req, res, next) => {
    console.log(req.body)
    awsapi.createitem("videodata", req.body, req, res)
})

app.get('/readvideodata/:vid', (req, res) => {
    awsapi.readitem("videodata", req.params.vid, req, res)
})

app.get('/awsquerydata', (req, res) => {
    awsapi.awsquery(req.body, function (data) {
        res.send(data)
    })
})


app.get('/awsscandata', (req, res) => {
    awsapi.awsscan(req.body, function (data) {
        res.send(data)
    })
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))