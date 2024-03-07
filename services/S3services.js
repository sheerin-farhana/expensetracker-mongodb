const AWS = require('aws-sdk');


const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
    const IAM_USER_KEY = process.env.AWS_S3_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_S3_SECRET_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        // Bucket: BUCKET_NAME,
    });
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log("something went erong");
                console.log(err);
                reject(err)
            }
            else {
                console.log("success");
                console.log(s3response);
                resolve(s3response.Location);
            }
        });
    })
}

module.exports = {
    uploadToS3,
}