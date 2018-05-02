import mongoose from 'mongoose'

const model = {
  id: String,
  data: String,
  insertTime: {
    type: Date,
    default: Date.now(),
  },
  updateTime: {
    type: Date,
    default: Date.now(),
  }
}

const schema = new mongoose.Schema(model)

export default schema