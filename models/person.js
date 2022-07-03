const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .catch(error => {
    console.log('Error connecting to database', error.message)
  })

const phonebookSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message: props => `${props.value} is not a valid phone number`,
    },
    required: true,
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', phonebookSchema)
