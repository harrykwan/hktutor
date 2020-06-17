const request = require('request')

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo("76d5fde2be8d470b3a4459392a77b6651d52b919", "USuwhWwQ3z4oIzBRYIwaamaP+zQJfz8gjyBOKa24ATZSOESgFhVid+jjemXzEqojq44+dNoRe2CPoJp6rAo4Ka94vpnC+xvio3XudgmbZKL1Nmdzj+B4RmWyNVIxXlzu", "dcbc9ee84db9560e4e2744fa5ac0cc50");


function upload(filepath, filename, filedes) {
    client.upload(
        filepath, {
            'name': filename,
            'description': filedes
        },
        function (uri) {
            console.log('Your video URI is: ' + uri);
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

function checkupload(uri) {
    client.request(uri + '?fields=transcode.status', function (error, body, status_code, headers) {
        if (body.transcode.status === 'complete') {
            console.log('Your video finished transcoding.')
        } else if (body.transcode.status === 'in_progress') {
            console.log('Your video is still transcoding.')
        } else {
            console.log('Your video encountered an error during transcoding.')
        }
    })
}

function getvideourl(uri) {
    client.request(uri + '?fields=transcode.status', function (error, body, status_code, headers) {
        if (body.transcode.status === 'complete') {
            console.log('Your video finished transcoding.')
        } else if (body.transcode.status === 'in_progress') {
            console.log('Your video is still transcoding.')
        } else {
            console.log('Your video encountered an error during transcoding.')
        }
    })
}

function getvideoembedvideo(url) {
    request
        .get('https://vimeo.com/api/oembed.json?url=' + url)
        .on('response', function (response) {
            if (response.statusCode >= 200 && response.statusCode <= 299) {
                //success
                console.log(response)
            }
        })
}


exports.upload = upload;
exports.checkupload = checkupload;
exports.getvideourl = getvideourl;
exports.getvideoembedvideo = getvideoembedvideo;