const express = require("express")
const loadsh = require("loadsh")

const Schedule = require('../models/Schedule')
const EmployeeAndService = require('../models/relationships/EmployeeAndService')

const router = express.Router()


router.post('/', async (request, response) => {
    try {
        data = request.body
        const schedule = await new Schedule(data).save()
        response.json(schedule)
    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.get('/hall/:hall', async (request, response) => {
    try {
        const { hall } = request.params
        let schedules = await Schedule.find({ hall })

        response.json({ schedules })
        
    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.put('/:scheduleId', async (request, response) => {
    try {
        const { scheduleId } = request.params
        const schedule = await Schedule.findByIdAndUpdate(scheduleId, request.body)

        response.json({ schedule })
        
    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.delete('/:scheduleId', async (request, response) => {
    try {
        const { scheduleId } = request.params
        await Schedule.findByIdAndDelete(scheduleId)

        response.json({ error: false })
        
    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.post('/employees', async (request, response) => {
    try {
        const listEmployees = await EmployeeAndService.find({
            service: { $in: request.body.services },
            status: 'active'
        }).populate('employee', 'name')
        .select('employee -_id')

        const employees = loadsh.uniqBy(
            listEmployees, (employee) => employee.employee._id.toString()
        ).map(employee => ({
            label: employee.employee.name,
            value: employee.employee._id
        }))

        response.json({ employees })
        
    } catch (error) {
        response.json({error: true, error: error.message})
    }
})



module.exports = router