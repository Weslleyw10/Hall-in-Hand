import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filterScheduling } from '../../store/modules/scheduling/actions'
import moment from 'moment'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import utils from '../../utils'



const localizer = momentLocalizer(moment)

const Schedulings = () => {
    const dispatch = useDispatch()

    const { schedulings } = useSelector((state) => state.schedulings )

    const formatEvent = schedulings.map((item) => ({
        title: `${item.serviceId.title} - ${item.customerId.name} - ${item.employeeId.name}`,
        start: moment(item.dateScheduling).toDate(), 
        end: moment(item.dateScheduling).add(utils.hourToMinutes(moment(item.serviceId.duration).format('HH:mm')), 'minutes').toDate()
    }))

    const formatRange = (period) => {
        let finalRange = {}
        if(Array.isArray(period)) {
            finalRange = {
                start: moment(period[0]).format('YYYY-MM-DD'),
                end: moment(period[period.length - 1]).format('YYYY-MM-DD')
            }
        } else {
            finalRange = {
                start: moment(period.start).format('YYYY-MM-DD'),
                end: moment(period.end).format('YYYY-MM-DD')
            }
        }

        return finalRange

    }


    useEffect(() => {
        dispatch(
            filterScheduling(
                moment().weekday(0).format('YYYY-MM-DD'), // start
                moment().weekday(6).format('YYYY-MM-DD') // end
            )
        )

    }, [])

    return (
        <div className="col p-5 overflow-auto h-100">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4 mt-0">Agendamentos</h2>
                    <Calendar 
                        localizer={localizer}
                        onRangeChange={(period) => {
                            const { start, end } = formatRange(period)
                            dispatch(
                                filterScheduling(
                                    start, // start
                                    end // end
                                )
                            )

                        }}
                        events={formatEvent}
                        defaultView="week"
                        selectable
                        popup
                        style={{height: 600}}
                    />
                </div>
            </div>
        </div>
    )
}

export default Schedulings