const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-east-1'
});

const Busboy = require('busboy');

const BUCKET_NAME = '3ninjas-profilepic';
const IAM_USER_KEY = 'AKIAT457LS74YL4GQEGS';
const IAM_USER_SECRET = '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';
let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

function uploadToS3(file, res) {
    s3bucket.createBucket(function () {
        var params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file.data
        };
        s3bucket.upload(params, function (err, data) {
            if (err) {
                console.log('error in callback');
                console.log(err);
            }
            console.log('success');
            console.log(data.Location);
            if (res) {
                res.send(data)
            }
        });
    });
}

function getphotofroms3(x, req, res) {
    var params = {
        Bucket: BUCKET_NAME,
        Key: x
    };
    s3bucket.getObject(params, function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'image/' + x.split('.')[1]
        });
        res.write(data.Body, 'binary');
        res.end(null, 'binary');
    });
}



function uploadroute(req, res, next) {
    // This grabs the additional parameters so in this case passing in
    // "element1" with a value.
    const element1 = req.body.element1;

    var busboy = new Busboy({
        headers: req.headers
    });

    // The file upload has completed
    busboy.on('finish', function () {
        console.log('Upload finished');
        // console.log(req.file)
        const file = req.files.myfile1;
        // console.log(file);

        // Begins the upload to the AWS S3
        uploadToS3(file, res);
    });

    req.pipe(busboy);
}

function createtable() {
    var params = {
        TableName: "",
        KeySchema: [{
                AttributeName: "year",
                KeyType: "HASH"
            }, //Partition key
            {
                AttributeName: "title",
                KeyType: "RANGE"
            } //Sort key
        ],
        AttributeDefinitions: [{
                AttributeName: "year",
                AttributeType: "N"
            },
            {
                AttributeName: "title",
                AttributeType: "S"
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    dynamodb.createTable(params, function (err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}

function createitem() {
    var table = "Movies";
    var year = 2015;
    var title = "The Big New Movie";

    var params = {
        TableName: table,
        Item: {
            "year": year,
            "title": title,
            "info": {
                "plot": "Nothing happens at all.",
                "rating": 0
            }
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
}

function readitem() {
    var table = "Movies";
    var year = 2015;
    var title = "The Big New Movie";

    var params = {
        TableName: table,
        Key: {
            "year": year,
            "title": title
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}

function updateitem() {
    var table = "Movies";
    var year = 2015;
    var title = "The Big New Movie";

    var params = {
        TableName: table,
        Key: {
            "year": year,
            "title": title
        },
        UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
        ExpressionAttributeValues: {
            ":r": 5.5,
            ":p": "Everything happens all at once.",
            ":a": ["Larry", "Moe", "Curly"]
        },
        ReturnValues: "UPDATED_NEW"
    };

    console.log("Updating the item...");
    docClient.update(params, function (err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}


exports.uploadToS3 = uploadToS3
exports.upload = uploadroute
exports.getphoto = getphotofroms3