const db = require('../utils/db')
var bodyParser = require('body-parser')

const router = require('express').Router()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', (req, res, next) => {
  const sql = `SELECT * FROM words`

  db.query(sql, (err, result) => {
    res.render('home', { words: result })
  })
})

router.get('/word', (req, res, next) => {
  const sql = `SELECT * FROM words`

  db.query(sql, (err, result) => {
    res.render('word', { words: result, id: null })
  })
})

router.get('/word/:id', (req, res, next) => {
  const sql = `SELECT * FROM words WHERE id=${req.params.id}`

  db.query(sql, (err, result) => {
    res.render('word', { id: req.params.id, word: result[0] })
  })
})

router.get('/word/delete/:id', (req, res, next) => {
  const sql = `DELETE FROM words WHERE id=${req.params.id}`

  db.query(sql, (err, result) => {
    if (err) return next()
    res.redirect('/')
  })
})

router.post('/word', urlencodedParser, (req, res, next) => {
  const { word, meaning } = req.body
  const sql = `INSERT INTO words (word,meaning) VALUES ("${word}","${meaning}")`

  db.query(sql, (err, result) => {
    if (err) return next(err)
    res.redirect('/')
  })
})

router.get('/challenge', urlencodedParser, (req, res, next) => {
  const sql = `SELECT COUNT(*) as count FROM words`

  db.query(sql, (err, results) => {
    if (err) return res.json({ err }) // prettier-ignore
    const count = results[0].count
    const randomNumber = Math.floor(Math.random() * (count - 1))
    const sql = `SELECT * FROM words LIMIT 1 OFFSET ${randomNumber}`
    db.query(sql, (err, results) => {
      res.render('challenge', {
        word: results[0],
      })
    })
  })
})

router.post('/word/update/:id', urlencodedParser, (req, res, next) => {
  const id = req.params.id
  const values = Object.entries(req.body).map((r) => `${r[0]}="${r[1]}"`)
  const sql = `UPDATE words SET ${values} WHERE id=${id}`

  db.query(sql, (err, result) => {
    if (err) return next(err)
    res.redirect('/')
  })
})

module.exports = router
