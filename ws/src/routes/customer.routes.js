const express = require('express')
const mongoose = require('mongoose')

const Customer = require('../models/Customer')
const HallAndCustomer = require('../models/relationships/HallAndCustomer')

const pagarme = require('../services/pagar.me')

const router = express.Router()

router.post('/', async (request, response) => {
    const db = mongoose.connection
    const session = await db.startSession()
    session.startTransaction()

    try {
        const { hall, customer } = request.body
        let newCustomer = null

        // check if it already exists
        const customerIsAlready = await Customer.findOne({
            $or:[
                {email: customer.email},
                {phone: customer.phone}
            ]
        })

        // if customer there int's
        if(!customerIsAlready){            
            const _id = mongoose.Types.ObjectId()

            // create cutomer in pagarme
            const customerPagarme = await pagarme('/customers', {
                external_id: _id,
                name: customer.name,
                type: customer.document.documentType === 'cpf' ? 'individual' : 'corporation',
                country: customer.address.country,
                email: customer.email,
                documents: [
                    {
                        type: customer.document.documentType,
                        number: customer.document.document
                    }
                ],
                phone_numbers: [
                    customer.phone
                ],
                birthday: customer.birthday
            })

            if (customerPagarme.error) {
                throw customerPagarme
            }

            // create new customer
            newCustomer = await Customer({
                _id,
                ...customer,
                externalId: customerPagarme.data.id
            }).save({ session })
        } 

        // Relationship
        const customerId = customerIsAlready ? customerIsAlready._id : newCustomer._id

        const relationshipHallAndCustomerIsAlready = await HallAndCustomer.findOne({
            hall,
            customer: customerId
        })

        // Check if it already relationship with in the hall
        if (!relationshipHallAndCustomerIsAlready) {
            await new HallAndCustomer({
                hall,
                customer: customerId
            }).save({ session })
        }

        await session.commitTransaction();
        session.endSession()

        if (relationshipHallAndCustomerIsAlready && relationshipHallAndCustomerIsAlready.status === 'active' &&
        customerIsAlready) {
            response.json({ error: false, message: 'customer it already'})
        } else {
            response.json(newCustomer)
        }

    } catch (error) {        
        await session.abortTransaction();
        session.endSession();
        response.json({error: true, message:error.message})
    }
})

router.get('/filters', async (request, response) => {
    try {
        const customers = await Customer.find(request.body)
        response.json(customers)

    } catch (error) {
        response.json({error: true, message:error.message})
    }
})

router.get('/hall/:hall', async (request, response) => {
    try {
        const { hall } = request.params

        const customers = await HallAndCustomer.find({
            hall,
            status: {$ne: 'deleted'}
        })
        .populate({path: 'customer', select: '-__v'})
        .select('-status -hall -createdAt -__v')

        response.json({
            customers: customers.map(customer => ({
                ...customer.customer._doc,
                hallRelationship: customer._id

            }))
        })

    } catch (error) {
        response.json({error: true, message:error.message})
    }
})

router.delete('/hall/relationship/:id', async (request, response) => {
    try {
        const { id } = request.params
        await HallAndCustomer.findByIdAndUpdate(id, {
            status: 'deleted'
        })
        response.json({message: 'relationship deleted.'})
    } catch (error) {
        response.json({error: true, message:error.message})
    }
})

module.exports = router