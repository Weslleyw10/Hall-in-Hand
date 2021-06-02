const mongoose = require('mongoose')

const URI = 'mongodb+srv://wls:c4aNaPlOWUE10XQL@cluster0.wdf7a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose
.connect(URI)
.then(() => console.log('Db is up.'))
.catch(() => console.log(err))
