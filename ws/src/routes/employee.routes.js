const express = require('express')
const mongoose = require('mongoose')

const pagarme = require('../services/pagar.me')

const Employee = require('../models/Employee')
const HallAndEmployee = require('../models/relationships/HallAndEmployee')
const EmployeeAndService = require('../models/relationships/EmployeeAndService')

const router = express.Router()

router.post('/', async (request, response) => {
    const db = mongoose.connection;
    const session = await db.startSession()
    session.startTransaction()

    try {
        const { hall, employee } = request.body
        let newEmployee = null

        console.log(employee.email)


        // verify if employee is exists
        const employeeIsExists = await Employee.findOne({
            $or: [
                { email: employee.email },
                { phone: employee.phone },
            ]
        })

        // if there isn't
        if(!employeeIsExists) {
            // (1) create account bank
            const { bankAccount } = employee

            const pagarmeBankAccount = await pagarme('/bank_accounts', {
                bank_code: bankAccount.bank,
                agencia: bankAccount.bankAgency, 
                type: bankAccount.accountType,
                conta: bankAccount.numberAccount, 
                conta_dv: bankAccount.verifyingDigit, 
                document_number: bankAccount.document, 
                legal_name: bankAccount.owner,
            })

            if (pagarmeBankAccount.error) {
                throw pagarmeBankAccount
            }

            // (2) create receiver
            const pagarmeRecipient = await pagarme('/recipients', {
                transfer_interval: "daily",
                transfer_enabled: true,
                bank_account_id: pagarmeBankAccount.data.id
            })

            if (pagarmeRecipient.error) {
                throw pagarmeRecipient
            }

            // (3) create employee in the database
            newEmployee = await Employee({
                ...employee,
                recipientId: pagarmeRecipient.data.id
            }).save({ session })
        }

        // (4) Relationship
        const employeeId = employeeIsExists ? employeeIsExists._id : newEmployee._id

        // (5) Verify if is exits relationship with in the hall
        const relationshipHallAndEmployee = await HallAndEmployee.findOne({
            hall,
            employee: employeeId,
            status: {$ne: 'deleted'}
        })

        // (6) Verify if is there ins't relationship with in the hall
        if(!relationshipHallAndEmployee) {
            await new HallAndEmployee({
                hall,
                employee: employeeId,
                status: employee.bond
            }).save({ session })
        }
        
        // verify is relationship is exists
        if(relationshipHallAndEmployee && relationshipHallAndEmployee.status === 'inactive') {
            await HallAndEmployee.findOneAndUpdate(
                {
                    hall,
                    employee: employeeId,
                },
                { status: 'active'},
                { session }
            )
        }

        // relationship with specialities
        await EmployeeAndService.insertMany(
            employee.specialities.map(service => ({
                service,
                employee: employeeId,
            })), 
            { session }
        )

        await session.commitTransaction()
        session.endSession()        

        if (employeeIsExists && relationshipHallAndEmployee) {
            response.json({ error: true, message: 'Employee already registered'})
        } else {
            response.json({ error: false })
        }

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        response.json({error: true, message: err.message})
    }
})

router.get('/', async (request, response) => {
    try {

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.put('/:employee', async (request, response) => {
    try {
        const { bondId, status, services } = request.body
        const { employee } = request.params

        // bond
        await HallAndEmployee.findByIdAndUpdate(bondId, { status })

        // delete services
        await EmployeeAndService.deleteMany({ employee })

        // create services
        await EmployeeAndService.insertMany(
            services.map(service => ({
                service,
                employee
            }))
        )

        response.json({
            error: false
        })

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.delete('/bond/:id', async (request, response) => {
    try {
        const { id } = request.params
        
        await HallAndEmployee.findByIdAndUpdate(id, {status:"deleted"})

        response.json({error: false})

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.post('/filter', async (request, response) => {
    try {
        const { filters } = request.body
        const employees = await Employee.find(filters)

        response.json({ employees })

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})

router.post('/hall/:hall', async (request, response) => {
    try {
        const { hall } = request.params
        let employeeSerializer = []

        const employees = await HallAndEmployee.find({
            hall,
            status: { $ne: 'deleted' }
        })
        .populate({path: "employee", select: '-password -recipient'})
        .select("employee status")

        for (let employee of employees) {
            const services = await EmployeeAndService.
            find({
                employee: employee.employee._id
            })

            employeeSerializer.push({
                ...employee._doc,
                services
            })
        }

        response.json({ 
            employees: employeeSerializer.map(employee => ({
                ...employee.employee._doc,
                services: employee.services,
                relationshipId: employee._id,
                relationshipStatus: employee.status,
            }))
        })

    } catch (err) {
        response.json({error: true, message: err.message})
    }
})





module.exports = router