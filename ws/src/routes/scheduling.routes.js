const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const loadsh = require('loadsh')

const Scheduling = require('../models/Scheduling')
const Customer = require('../models/Customer')
const Employee = require('../models/Employee')
const Service = require('../models/Service')
const Hall = require('../models/Hall')
const Schedule = require('../models/Schedule')

const pagarme = require('../services/pagar.me')
const utils = require('../utils')
const keys = require('../data/keys.json')

const router = express.Router()

router.post('/', async (request, response) => {
    const db = mongoose.connection
    const session = await db.startSession()
    session.startTransaction()

    try {        
        /** 
         * Verificar se o horario ainda está disponivel 
         * */

        const { hallId, serviceId, employeeId, customerId } = request.body

        // (1) get customer
        const customer = await Customer.findById(customerId).select('name address externalId')

        // (2) get employee
        const employee = await Employee.findById(employeeId).select('recipientId')

        // (3) get service
        const service = await Service.findById(serviceId).select('title price commission')

        // (4) get hall
        const hall = await Hall.findById(hallId).select('recipientId')

        // make transaction
        const totalPrice = utils.toCents(service.price) * 100

        // employee split rules
        const employeeSplitRules = {
            recipient_id: employee.recipientId,
            amount: parseInt(totalPrice * (service.commission / 100))
        }

        const transaction = await pagarme('/transactions', {
            amount: totalPrice,
            
            // card data
            card_number: "4111111111111111",
            card_cvv: "123",
            card_expiration_date: "0922",
            card_holder_name: "Morpheus Fishburne",
            
            // customer data        
            customer: {
                id: customer.externalId
            },

            // customer address data
            billing: {
                name: customer.name,
                address: {
                country: customer.address.country,
                state: customer.address.state,
                city: customer.address.city,
                street: customer.address.address,
                street_number: String(customer.address.number),
                zipcode: customer.address.zipcode
              }
            },

            // items/service data
            items: [
              {
                id: serviceId,
                title: service.title,
                unit_price: totalPrice,
                quantity: 1,
                tangible: false
              },              
            ],

            split_rules: [
                // rate employee
                employeeSplitRules,

                // rate hall
                {
                    recipient_id: hall.recipientId,
                    amount: totalPrice - keys.app_fee - employeeSplitRules.amount
                },
                
                // rate app
                {
                    recipient_id: keys.recipient_id,
                    amount: keys.app_fee
                }
            ]

        })



        if (transaction.error) {
            throw transaction
        }

        console.log('employee.recipientId',employee.recipientId)
        console.log('hall.recipientId',hall.recipientId)

        console.log('TOTAL =>', totalPrice)
        console.log('SALAO =>', totalPrice - keys.app_fee - employeeSplitRules.amount)
        console.log('Employee =>', parseInt(totalPrice * (service.commission / 100)))
        console.log('APP =>', keys.app_fee)

        // create scheduling
        const scheduling = await new Scheduling({
            ...request.body,
            transactionId: transaction.data.id,
            commission: service.commission,
            value: service.price

        }).save({ session })
       
        await session.commitTransaction()
        session.endSession()

        response.json(transaction)
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        response.json({error: true, message: error.message})
    }
})

router.post('/filter', async(request, response) => {
    try {
        const { period, hallId } = request.body

        const schedulings = await Scheduling.find({
            status: 'confirmed',
            hallId,
            dateScheduling: {
                $gte: moment(period.start).startOf('day'),
                $lte: moment(period.end).endOf('day'),
            }
            //$gte => maior ou igual
            //$lte => menor ou igual
        }).populate([
            { path: 'hallId', select: 'name'},
            { path: 'customerId', select: 'name'},
            { path: 'employeeId', select: 'name'},
            { path: 'serviceId', select: 'title duration'},
        ])

        response.json(schedulings)

        
    } catch (error) {
        response.json({error: true, message: error.message})
    }
})

router.post('/days/avaible', async (request, response) => {
    try {
        const { date, hallId, serviceId } = request.body
        const hours = await Schedule.find({ hall: hallId })
        const service = await Service.findById(serviceId)

        let schedule = []
        let employees = []
        let lastDay = moment(date)
        let minutes = moment(service.duration).format('HH:mm')

        // service duration
        const serviceMinutes = utils.hourToMinutes(
            moment(service.duration).format('HH:mm')
        )

        // service slots
        const serviceSlots = utils.sliceMinutes(
            service.duration,
            moment(service.duration).add(serviceMinutes, 'minutes'),
            utils.SLOT_DURATION
        ).length


        /**
         * Busque nos proximos 365 dias até 
         * a agenda contér 7 dias disponíveis
         */
        for (let i = 0; i <= 365 && schedule.length <= 7; i++) {
            const hoursAvaible = hours.filter(hour => {
                // verificar o dia da semana
                const weekDayAvaible = hour.days.includes(moment(lastDay).day()) // 0 - 6

                // verificar serviço disponível
                const serviceAvaible = hour.specialties.includes(serviceId)

                return weekDayAvaible && serviceAvaible
            })

            /**
             * Todos os colaboradores disponíveis no dia
             * e seu horarios
             */

            if (hoursAvaible.length > 0) {
                let allHoursByDay = {}

                for (let space of hoursAvaible) {
                    for (let employee of space.employees) {
                        if (!allHoursByDay[employee._id]) {
                            allHoursByDay[employee._id] = []
                        }

                        /**
                         * Pegar todos os horários do espaço
                         * e jogar dentro do colaborador
                         */

                         allHoursByDay[employee._id] = [
                             ...allHoursByDay[employee._id],
                             ...utils.sliceMinutes(
                                 utils.mergeDateTime(lastDay, space.start),
                                 utils.mergeDateTime(lastDay, space.end),
                                 utils.SLOT_DURATION
                             )
                         ]
                    }
                }

                /**
                 * ocupação de cada especialista no dia
                 */
                for (let employeeId of Object.keys(allHoursByDay)) {
                    console.log(lastDay.format('DD/MM/1234'))
                    const schedulings = await Scheduling.find({
                        employeeId,
                        dateScheduling: {
                            $gte: moment(lastDay).startOf('day'),
                            $lte: moment(lastDay).endOf('day')
                        },
                    }).select('dateScheduling serviceId -_id')
                    .populate('serviceId', 'duration')

                    /**
                     * recuperar horarios agendados
                     */
                    let scheduleTimes = schedulings.map(schedule => ({
                        start: moment(schedule.dateScheduling),
                        end: moment(schedule.dateScheduling).add(utils.hourToMinutes(
                            moment(schedule.serviceId.duration).format('HH:mm')
                        ), 'minutes')
                    }))

                    // recuperar todos os slots entre os agendamentos
                    scheduleTimes = scheduleTimes.map(hour => (
                        utils.sliceMinutes(
                            hour.start, 
                            hour.end, 
                            utils.SLOT_DURATION)
                    )).flat()

                    // remove todos os horarios ocupados
                    let hoursAvaible = utils.splitByValue(allHoursByDay[employeeId].map((avaible) => {
                        return scheduleTimes.includes(avaible) 
                        ? '-' : avaible
                    }),'-').filter(space => space.length > 0)

                    /**
                     * verifica se existe espaço suficiente no slot para 
                     * agendamento de serviço
                     */
                     hoursAvaible = hoursAvaible.filter(hours => 
                        hours.length >= serviceSlots
                     )

                     /**
                      * verifica se os horarios dentro dos slots tem a quantidade necessario 
                      */
                     hoursAvaible = hoursAvaible.map((slot) => 
                        slot.filter((hour, index) => slot.length - index >= serviceSlots)
                     ).flat()

                     /**
                      * separa slots de dois em dois
                      */
                     hoursAvaible = loadsh.chunk(hoursAvaible, 2)

                     /**
                      * remover colaborador caso nao tenha
                      * espaço na agenda
                      */
                     if (hoursAvaible.length === 0) {
                        allHoursByDay = loadsh.omit(allHoursByDay, employeeId)

                     } else {
                         allHoursByDay[employeeId] = hoursAvaible
                     }
                } 

                /**
                 * valida se tem empregado disponivel no dia
                 */
                const totalEmployees = Object.keys(allHoursByDay).length
                if (totalEmployees > 0) {
                    employees.push(Object.keys(allHoursByDay))
                    schedule.push({
                        [lastDay.format('YYYY-MM-DD')]: allHoursByDay
                    })
                }
            }
            lastDay = lastDay.add(1, 'day')
        }

        /**
         * recupera dados dos colaboradores
         */
        employees = loadsh.uniq(employees.flat())
        employees = await Employee.find({
            _id: { $in: employees },
        }).select('name cover')

        employees = employees.map(employee => ({
            ...employee._doc,
            name: employee.name.split(' ')[0]
        }))

        response.json({
            schedule,
            employees
        })
        
    } catch (error) {
        response.json({error:true, message:error.message})
    }
})

module.exports = router 