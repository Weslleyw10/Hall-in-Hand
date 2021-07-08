const express = require('express')
const Busboy = require('busboy')

const AWS = require('../services/aws')

const Hall = require('../models/Hall')
const Service = require('../models/Service')
const Media = require('../models/Media')
const { request, response } = require('express')
const { route } = require('./hall.routes')
const aws = require('../services/aws')

const router = express.Router()

router.post('/', async (request, response) => {
    var busboy = new Busboy({ headers: request.headers })
    busboy.on('finish', async () => {
        try {
            const { hallId } = request.body
            const data = request.body

            let errs = []
            let files = []

            if(request.files && Object.keys(request.files).length > 0) {
                for (let key of Object.keys(request.files)) {
                    const file = request.files[key]

                    const fileNameParts = file.name.split('.') //[filename, jpg]
                    const newFileName = `${new Date().getTime()}.${fileNameParts[1]}`

                    const path = `services/${hallId}/${newFileName}`
                    const response = await AWS.uploadToS3(file, path)

                    if(response.error) {
                        errs.push({error: true, message: response.message})
                    } else {
                        files.push(path)
                    }
                }
            }

            if (errs.length > 0) {
                response.json(errs[0])
                return false
            }

            // create service
            let serviceJSON = JSON.parse(data.service)
            const service = await Service(serviceJSON).save()

            // create file
            files = files.map(file => ({
                refId: service._id,
                model: 'Service',
                path: file,
            }))

            await Media.insertMany(files)

            response.json({
                service: service, 
                files: files
            })

        } catch (err) {
            response.json({error: true, message: err.message})
        }
    })
    
    request.pipe(busboy)
})

router.put('/:id', async (request, response) => {
    var busboy = new Busboy({ headers: request.headers })
    busboy.on('finish', async () => {
        try {
            const { hallId } = request.body
            const data = request.body

            let errs = []
            let files = []

            if(request.files && Object.keys(request.files).length > 0) {
                for (let key of Object.keys(request.files)) {
                    const file = request.files[key]

                    const fileNameParts = file.name.split('.') //[filename, jpg]
                    const newFileName = `${new Date().getTime()}.${fileNameParts[fileNameParts.length -1]}`

                    const path = `services/${hallId}/${newFileName}`
                    const response = await AWS.uploadToS3(
                        file, path
                    )

                    if(response.error) {
                        errs.push({error: true, message: response.message})
                    } else {
                        files.push(path)
                    }
                }
            }

            if (errs.length > 0) {
                response.json(errs[0])
                return false
            }

            // update service
            let serviceJSON = JSON.parse(data.service)

            console.log('ID',request.params.id)
            console.log('serviceJSON',serviceJSON)


            const service = await Service.findByIdAndUpdate(request.params.id, serviceJSON)

            // create file
            files = files.map(file => ({
                refId: service._id,
                model: 'Service',
                path: file,
            }))

            await Media.insertMany(files)

            response.json({
                service: service, 
                files: files
            })

        } catch (err) {
            response.json({error: true, message: err.message})
        }
    })

    request.pipe(busboy)

})

router.delete('/:id', async(request, response) => {
    try {
        const { id } = request.params
        await Service.findByIdAndUpdate(id, { status: "deleted" })

        response.json("Service deleted.")

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.post('/media', async (request, response) => {
    try {
        let { key } = request.body

        // delete AWS
        await aws.deleteFileS3(key)

        // delete database
        await Media.findOneAndDelete({ path: key })

        response.json("File deleted.")

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.get('/hall/:id', async (request, response) => {
    try {
        let serviceSerializer = []
        const { id } = request.params
        const services = await Service.find({
            hall: id,
            status: { $ne: 'deleted'}
        })

        for (let service of services) {
            const medias = await Media.find({
                model: 'Service',
                refId: service._id
            })
            serviceSerializer.push({ ...service._doc, medias})
        }

        response.json(serviceSerializer)

    } catch (err) {
        response.json({error: true, message: err.message})
    }

    

})

module.exports = router
