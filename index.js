const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')

app.use(cors())
app.options('*', cors())
app.use(express.json())

dotenv.config({
  path: './config.env',
})

const db = require('./utils/db')
const PORT = process.env.PORT || 3333

db.getConnection((err, conn) => {
  console.log('db başarıyla bağlandı')
  conn.query()
  db.releaseConnection(conn)
})

app.post('/register', (req, res, next) => {
  const { username, name, password } = req.body

  const sql = `INSERT INTO users (username,name,password) VALUES ("${username}" , "${name}" , "${password}" )`

  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    res.json({
      success: true,
      data: results,
    })
  })
})

app.get('/users', (req, res, next) => {
  let sql = `SELECT * FROM users`
  db.query(sql, (err, results, fields) => {
    res.json({
      success: true,
      data: results,
    })
  })
})

app.get('/words', (req, res, next) => {
  const sql = `SELECT * FROM words`

  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    res.json({
      success: true,
      data: results,
    })
  })
})

app.get('/words/random', (req, res, next) => {
  const sql = `SELECT COUNT(*) as count FROM words`

  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    const count = results[0].count
    const randomNumber = Math.floor(Math.random() * (count - 1))
    const sql = `SELECT * FROM words LIMIT 1 OFFSET ${randomNumber}`
    db.query(sql, (err, results) => {
      res.json({
        success: true,
        data: results[0],
      })
    })
  })
})

app.post('/words', (req, res, next) => {
  const { word, meaning } = req.body
  const sql = `INSERT INTO words (word,meaning) VALUES ("${word}","${meaning}")`

  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    res.json({
      success: true,
      message: 'Kelimeniz başarıyla kaydedildi',
    })
  })
})

app.put('/words/:id', (req, res, next) => {
  const id = req.params.id
  const values = Object.entries(req.body).map((r) => `${r[0]}="${r[1]}"`)

  const sql = `UPDATE words SET ${values} WHERE id=${id}`
  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    res.json({
      success: true,
      message: 'Kelimeniz başarıyla güncellendi',
    })
  })
})

app.delete('/words/:id', (req, res, next) => {
  const sql = `DELETE FROM words WHERE id=${req.params.id}`
  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    res.json({
      success: true,
      message: 'Kelimeniz başarıyla silindi',
    })
  })
})

app.listen(PORT, () => {
  console.log('server başarıyla başlatıldı')
})
