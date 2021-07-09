const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send("Hello World!")
})

require('./controllers/pwController')(app)

app.listen(process.env.PORT || 5000)

