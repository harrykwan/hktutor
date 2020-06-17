const request = require('request')

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo("76d5fde2be8d470b3a4459392a77b6651d52b919", "USuwhWwQ3z4oIzBRYIwaamaP+zQJfz8gjyBOKa24ATZSOESgFhVid+jjemXzEqojq44+dNoRe2CPoJp6rAo4Ka94vpnC+xvio3XudgmbZKL1Nmdzj+B4RmWyNVIxXlzu", "dcbc9ee84db9560e4e2744fa5ac0cc50");


function upload(filepath, filename, filedes, req, res) {
    client.upload(
        filepath, {
            'name': filename,
            'description': filedes
        },
        function (uri) {
            console.log('Your video URI is: ' + uri);
            const videoid = uri.split('/')[1]
            res.send(videoid)
        },
        function (bytes_uploaded, bytes_total) {
            var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
            console.log(bytes_uploaded, bytes_total, percentage + '%')
        },
        function (error) {
            console.log('Failed because: ' + error)
        }
    )
}

function checkupload(uri, req, res) {
    client.request('https://vimeo.com/' + uri + '?fields=transcode.status', function (error, body, status_code, headers) {
        if (body.transcode.status === 'complete') {
            console.log('Your video finished transcoding.')
        } else if (body.transcode.status === 'in_progress') {
            console.log('Your video is still transcoding.')
        } else {
            console.log('Your video encountered an error during transcoding.')
        }
    })
}

function getvideourl(uri, req, res) {

}

function getvideoembedvideo(url, req, res) {
    request
        .get('https://vimeo.com/api/oembed.json?url=' + 'vimeo.com/' + url)
        .on('response', function (response) {
            console.log(response)
            res.send('<iframe src="https://player.vimeo.com/video/' + url + '" width="640" height="480" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>')
        })
}




exports.upload = upload
exports.checkupload = checkupload
exports.getvideourl = getvideourl
exports.getvideoembedvideo = getvideoembedvideo