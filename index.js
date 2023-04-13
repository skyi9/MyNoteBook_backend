const connected = require('./db');
const express = require('express')
var cors = require('cors')

connected();

const app = express()
const port = 5000

//middleware without writing it in a separate file
app.use(express.json())
app.use(cors())

app.use('/mynotebook/auth', require('./routes/userRoute'))
app.use('/mynotebook/notes', require('./routes/noteRoute'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})