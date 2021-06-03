const AWS = require('aws-sdk')

module.exports = {
    IAM_USER_KEY: 'AKIAWDACSAWMQICOCL4W',
    IAM_USER_SECRET: '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',
    BUCKET_NAME: 'hall-in-hand-wls-bucket',
    AWS_REGION: '',

    uploadToS3: function (file, filename, acl = 'public-read'){
        return new Promise((resolve, reject) =>{
            let IAM_USER_KEY = this.IAM_USER_KEY
            let IAM_USER_SECRET = this.IAM_USER_SECRET
            let BUCKET_NAME = this.BUCKET_NAME

            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
                Bucket: BUCKET_NAME
            })

            s3bucket.createBucket(() => {
                var params = {
                    Bucket: BUCKET_NAME,
                    Key: filename,
                    Body: file.data,
                    ACL: acl
                }

                s3bucket.upload(params, ((err, data) => {
                    if(err) {
                        console.log(err)
                        return resolve({error: true, message: err.message})
                    } else {
                        console.log(data)
                        return resolve({error: false, message: data})
                    }
                }))
            })
        })
    },

    deleteFileS3: function(key) {
        return new Promise((resolve, reject) => {
            let IAM_USER_KEY = this.IAM_USER_KEY
            let IAM_USER_SECRET = this.IAM_USER_SECRET
            let BUCKET_NAME = this.BUCKET_NAME

            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
                Bucket: BUCKET_NAME
            })

            s3bucket.createBucket(() => {
                s3bucket.deleteObject(
                    {
                        Bucket: BUCKET_NAME,
                        Key: key,
                    },

                    ((err, data) => {
                        if(err) {
                            console.log(err)
                            return resolve({error: true, message: err.message})
                        } else {
                            console.log(data)
                            return resolve({error: false, message: data})
                        }
                    })
                )
            })
        }) 
    }
}