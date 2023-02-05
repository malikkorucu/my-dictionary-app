const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const db = require('./utils/db')
const apiRouter = require('./router/apiRouter')
const router = require('./router')
const path = require('path')

app.use(cors())
app.options('*', cors())

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.static(path.join(__dirname, '/public/')))
app.use('/api', apiRouter)
app.use('', router)

dotenv.config({
  path: './config.env',
})

const PORT = process.env.PORT || 3333

db.connect(() => {
  console.log('connection başarılı')
})

app.listen(PORT, () => {
  console.log('server başarıyla başlatıldı')
})
