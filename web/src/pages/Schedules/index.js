import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Drawer, Modal, Icon, TagPicker, DatePicker } from 'rsuite'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'moment/locale/pt-br'

import moment from 'moment'

import {
    allSchedules, updateSchedules
} from '../../store/modules/schedules/actions'


moment.locale('pt-br')
const localizer = momentLocalizer(moment)

const Schedules = () => {

    const dispatch = useDispatch()
    const { schedules, schedule, employees, form, components, behavior  } = useSelector(state => state.schedules)

    const daysOfWeekData = [
        new Date(2021, 3, 11, 0, 0, 0, 0),
        new Date(2021, 3, 12, 0, 0, 0, 0),
        new Date(2021, 3, 13, 0, 0, 0, 0),
        new Date(2021, 3, 14, 0, 0, 0, 0),
        new Date(2021, 3, 15, 0, 0, 0, 0),
        new Date(2021, 3, 16, 0, 0, 0, 0),
        new Date(2021, 3, 17, 0, 0, 0, 0),
    ];

    const daysOfWeek = [
        'domingo',
        'segunda',
        'terça',
        'quarta',
        'quinta',
        'sexta',
        'sabado'
    ]
    

    const formatEvents = () => {
        let listEvents = [];

        if(schedules.length > 0) {
    
            schedules.map((schedule, index) => {
                schedule.days.map((day) => {
                listEvents.push({
                //   resource: { schedule: schedule, backgroundColor: colors[index] },
                title: `${schedule.specialties.length} espec. e ${schedule.employees.length} colab. disponíveis`,
                start: new Date(
                    daysOfWeekData[day].setHours(
                    parseInt(moment(schedule.start).format('HH')),
                    parseInt(moment(schedule.start).format('mm'))
                    )
                ),
                end: new Date(
                    daysOfWeekData[day].setHours(
                    parseInt(moment(schedule.end).format('HH')),
                    parseInt(moment(schedule.end).format('mm'))
                    )
                ),
                });
            });
            });

        }
    
        return listEvents;
      };


    const setScheduleHandle = (key, value) => {
        dispatch(
            updateSchedules({
                schedule: {
                    ...schedule,
                    [key]: value
                }
            })
        )
    }

    useEffect(()=>{
        // all schedules
        dispatch(allSchedules())


        // all services

    },[])

    useEffect(() => {


    }, [schedules.services])

    return (
        <div className="col p-5 overflow-auto h-100">

            <Drawer>
                <Drawer.Body>
                    <h3>{ behavior === 'create' ? 'Criar novo' : 'Atualizar'} horário</h3>

                    <div className="row">
                        <div className="mt-3 col-12">
                            <b>Especialidades</b>
                            <TagPicker
                                size="lg"
                                block
                                data={daysOfWeek.map((label, value) => ({
                                    label,
                                    value
                                }))}
                                disabled={form.disabled && behavior === 'create'}
                                value={schedules.services}
                                onChange={value => setScheduleHandle('days', value)}
                            />
                        </div>
                    </div> 

                    <div className="row">
                        <div className="mt-3 col-6">
                            <b>Inicio</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                value={schedules.start}
                                onChange={value => setScheduleHandle('start', value)}
                            />
                        </div>
                        <div className="mt-3 col-6">
                            <b>Fim</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                value={schedules.end}
                                onChange={value => setScheduleHandle('end', value)}
                            />
                        </div>
                    </div> 

                    <div className="row">
                        <div className="mt-3 col-6">
                            <b>Inicio</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                value={schedules.start}
                                onChange={value => setScheduleHandle('start', value)}
                            />
                        </div>
                        <div className="mt-3 col-6">
                            <b>Fim</b>
                            <DatePicker
                                block
                                format="HH:mm"
                                hideMinutes={(min) => ![0, 30].includes(min)}
                                value={schedules.end}
                                onChange={value => setScheduleHandle('end', value)}
                            />
                        </div>
                    </div> 

                </Drawer.Body>
            </Drawer>


            <div className="row">
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h1 className="mb-4 mt-0">Horários</h1>
                        <div>
                            <button
                                className="btn btn-primary btn-lg"
                            // onClick={() => {
                            // dispatch(
                            //     updateCustomers({
                            //     behavior: 'create'
                            //     })
                            // )
                            // setComponent('drawer', true)
                            // }}
                            >
                                <span className="mdi mdi-plus">Novo Horário</span>
                            </button>
                        </div>
                    </div>

                    <Calendar
                        date={daysOfWeekData[moment().day()]}
                        localizer={localizer}
                        events={formatEvents()}
                        formats={{
                            dateFormat: 'dd',
                            dayFormat: (date, culture, localizer) =>
                                localizer.format(date, 'dddd', culture)
                        }}
                        toolbar={false}
                        popup
                        selectable
                        view="week"
                        style={{ height: 600 }}
                    />
                </div>
            </div>



        </div>

    )
}

export default Schedules