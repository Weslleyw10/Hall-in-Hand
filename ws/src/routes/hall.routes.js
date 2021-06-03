const express = require('express')
const turf = require('@turf/turf')

const Hall = require('../models/Hall')
const Service = require('../models/Service')

const router = express.Router()


router.post('/', async (request, response) => {
    try {
        const hall = await new Hall(request.body).save()
        response.json({ hall })

    } catch (err) {
        response.json({error: true, message: err.message})
    }

})

router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params
        let hall = await Hall.findById(id)        
        .select(
            'name cover phone address.city geo.coordinates'
        )

        // distance
        const distance = turf.distance(
            turf.point(hall.geo.coordinates),
            turf.point([-30.243858, -51.203487])
        )

        response.json({hall, distance})

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.get('/services/:hall', async (request, response) => {
    try {
        const { hall } = request.params
        const services = await Service.find({
            hall,
            status: 'active'
        }).select('_id title')

        response.json({
            services: services.map(service => ({
                label: service.title,
                value: service._id
            }))
        })

    } catch (err) {
        response.json({ error: true, message: err.message })

    }
})

module.exports = router
