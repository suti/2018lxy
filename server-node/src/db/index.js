import mongoose from 'mongoose'
import fileModel from './file/model'

const dbPath = 'mongodb://localhost:27017/db'

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + dbPath)
})
mongoose.connection.on('error', err => {
  console.error('Mongoose connection error: ' + err)
})
mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected')
})

mongoose.connect(dbPath).catch(err => {
  console.error('Mongoose connection error: ' + err)
})

let dbSchemas = {}

dbSchemas['file'] = mongoose.model('file', fileModel)

export default dbSchemas