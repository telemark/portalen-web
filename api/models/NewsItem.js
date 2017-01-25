import mongoose from 'mongoose'

var NewsItemSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
})

export default mongoose.model('NewsItem', NewsItemSchema)
