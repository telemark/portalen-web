import mongoose from 'mongoose'
import SearchPlugin from 'mongoose-search-plugin'

var MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date_from: {
    type: Date,
    default: Date.now
  },
  date_to: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Object
  },
  likes: {
    type: Array
  },
  hidefor: {
    type: Array
  },
  role: {
    type: Array,
    required: true
  }
})

MessageSchema.plugin(SearchPlugin, {
  fields: ['title', 'text']
})

export default mongoose.model('Message', MessageSchema)
