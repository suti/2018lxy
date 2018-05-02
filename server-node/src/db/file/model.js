import mongoose from 'mongoose'

const model = {
  name: String,
  type: String,
  md5: String,
  insertTime: {
    type: Date,
    default: Date.now(),
  },
}

const schema = new mongoose.Schema(model)

export default schema