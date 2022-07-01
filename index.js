require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : '')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const entry = data.find(entry => entry.id === id)

  if (entry) {
    response.json(entry)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  const { name, number } = request.body
  if (!name) {
    return response.status(400).json({ error: 'name is missing' })
  } else if (!number) {
    return response.status(400).json({ error: 'number is missing' })
  } else if (data.find(entry => entry.name === name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  const newEntry = {
    id,
    name,
    number,
  }
  data = data.concat(newEntry)

  response.status(201).json(newEntry)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const entry = data.find(entry => entry.id === id)

  if (entry) {
    data = data.filter(entry => entry.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const dateToday = Date()
  const phonebookCount = data.length
  response.send(`<p>Phonebook has info for ${phonebookCount} people</p><p>${dateToday}</p>`)
})

app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`)
})