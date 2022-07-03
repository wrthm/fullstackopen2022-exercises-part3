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

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findById(id)
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const newEntry = new Person({ name, number })
  Person
    .findOne({ name })
    .then((docs) => {
      if (docs !== null) {
        response.status(400).json({ error: 'Name must be unique' })
      } else {
        newEntry
          .save()
          .then(result => {
            response.status(201).json(result)
          })
          .catch(error => next(error))
      }
    })
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person
    .findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  Person
    .findByIdAndUpdate(
      id,
      { name, number },
      { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const dateToday = Date()
  Person.find({}).then(result => {
    const phonebookCount = result.length
    response.send(`<p>Phonebook has info for ${phonebookCount} people</p><p>${dateToday}</p>`)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  response.status(500).json({ error: 'Internal server error' })
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server now running on port ${PORT}`)
})