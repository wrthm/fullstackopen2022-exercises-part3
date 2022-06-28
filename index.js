const express = require('express')
const app = express()
const PORT = 3001

let data = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.json(data)
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