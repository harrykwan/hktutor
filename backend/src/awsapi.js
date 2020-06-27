const AWS = require('aws-sdk');
const BUCKET_NAME = '3ninjas-profilepic';
const IAM_USER_KEY = 'AKIAT457LS74YL4GQEGS';
const IAM_USER_SECRET = '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';

AWS.config.update({
    region: 'ap-east-1',
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
});

const Busboy = require('busboy');

let s3bucket = new AWS.S3({
    // accessKeyId: IAM_USER_KEY,
    // secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

function uploadToS3(file, res, callback) {
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
            if (callback) {
                callback()
            }
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
    // const element1 = req.body.element1;

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

function cvupload(req, res, next) {
    var busboy = new Busboy({
        headers: req.headers
    });

    // The file upload has completed
    busboy.on('finish', function () {
        console.log('Upload finished');
        // console.log(req.file)
        const file = req.files.file;
        // console.log(file);

        // Begins the upload to the AWS S3
        uploadToS3(file, res);
    });

    req.pipe(busboy);
}

function createtable_userprofiledata() {
    var params = {
        TableName: "userprofiledata",
        KeySchema: [{
            AttributeName: "uid",
            KeyType: "HASH"
        }],
        AttributeDefinitions: [{
            AttributeName: "uid",
            AttributeType: "S"
        }],
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

function createtable_videodata() {
    var params = {
        TableName: "videodata",
        KeySchema: [{
            AttributeName: "vid",
            KeyType: "HASH"
        }],
        AttributeDefinitions: [{
            AttributeName: "vid",
            AttributeType: "S"
        }],
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

// createtable_videodata()



function createtable_videocomment() {
    var params = {
        TableName: "videocomment",
        KeySchema: [{
            AttributeName: "vid",
            KeyType: "HASH"
        }],
        AttributeDefinitions: [{
            AttributeName: "vid",
            AttributeType: "S"
        }],
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

// createtable_videocomment()

function createtable_videodata() {
    var params = {
        TableName: "videodata",
        KeySchema: [{
            AttributeName: "vid",
            KeyType: "HASH"
        }],
        AttributeDefinitions: [{
            AttributeName: "vid",
            AttributeType: "S"
        }],
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




function createitem(table, item, req, res) {

    var params = {
        TableName: table,
        Item: item
    };

    console.log("Adding a new item...");
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            if (res) {
                res.send(data)
            }
            console.log("Added item:", data);
        }
    });
}

// createitem({
//     uid: "testuid",
//     testdata: "testdata"
// })

function readitem(table, uid, req, res, callback) {

    var params = {
        TableName: table,
        Key: {
            "uid": uid,
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {

            if (callback) {
                callback(data)
            }
            if (res) {
                res.send(data)

            }
            console.log("GetItem succeeded:", data);
        }
    });
}

// readitem('testuid')



function awsquery(params, callback) {

    docClient.query(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            if (callback) {
                callback(data)
            }
            // data.Items.forEach(function (item) {
            //     console.log(" -", item);
            // });
        }
    });
}


function awsscan(params, callback) {

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // print all the movies
            console.log("Scan succeeded.");
            if (callback)
                callback(data)
            // data.Items.forEach(function (result) {
            //     console.log(result);
            // });

            // continue scanning if we have more movies, because
            // scan can retrieve a maximum of 1MB of data
            if (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
    }
}


exports.uploadToS3 = uploadToS3
exports.upload = uploadroute
exports.getphoto = getphotofroms3
// exports.createtable = createtable
exports.createitem = createitem
exports.readitem = readitem
exports.cvupload = cvupload
exports.awsquery = awsquery
exports.awsscan = awsscan