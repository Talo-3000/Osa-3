const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "040-5858585"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-6969696"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "040-3554545"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  const size = persons.length
  response.send(`Phone book has info for ${size} people <br> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const names = persons.map(person => person.name.toLowerCase())
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'person must have a name and a number' 
    })
  }
  if (names.includes(body.name.toLowerCase())) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: Math.floor(Math.random() * 15000)
  }

  persons = persons.concat(person)
  response.json(person)
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})