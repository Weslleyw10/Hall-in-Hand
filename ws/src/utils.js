const moment = require('moment')

module.exports = {
    SLOT_DURATION: 30,
    // isOpened = async (schedules) => {},
    toCents: (price) => {
        return parseInt(price.toString().replace('.', '').replace(',',''))
    },
    hourToMinutes: (hourMinutes) => {
        const [hour, minutes] = hourMinutes.split(':')
        return parseInt(parseInt(hour) * 60 + parseInt(minutes))
    },
    sliceMinutes: (start, end, duration) => {
        const slices = []
        let count = 0

        // 1:30 = 90
        start = moment(start)
        // 1:30 + 1:30 = 180 = 3:00
        end = moment(end)

        while (end > start) {
            slices.push(start.format('HH:mm'))
            start = start.add(duration, 'minutes')
            count++
        }

        return slices
    },
    mergeDateTime: (date, time) => {
        const merged = `${moment(date).format('YYYY-MM-DD')}T${moment(time).format('HH:mm')}`
        return merged
    },
    splitByValue: (array, value) => {
        let newArray = [[]]
        array.forEach(item => {
            if (item !== value) {
                newArray[newArray.length - 1].push(item)
            } else {
                newArray.push([])
            }
        });
        return newArray
    }
}