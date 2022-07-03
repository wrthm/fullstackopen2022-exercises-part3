const mongoose = require('mongoose')

const argvLength = process.argv.length

if (argvLength < 3 || argvLength === 4 || argvLength > 5) {
  console.log('Usage: node mongo.js password [name] [number]')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://fsopt3:${password}@cluster0.uh2rh.mongodb.net/phonebook?retryWrites=true&w=majority`

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = new mongoose.model('Person', phonebookSchema)

const save = result => {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  return person.save()
}

mongoose
  .connect(url)
  .then(result => {
    if (argvLength === 3) {
      // list people
      return Person.find({})
    } else {
      return save(result)
    }
  })
  .then(result => {
    if (argvLength === 3) {
      console.log('Phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
    } else {
      console.log(`${result.name} (number ${result.number}) was added to phonebook`)
    }

    mongoose.connection.close()
  })
  .catch(error => console.log(error))
