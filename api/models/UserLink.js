import mongoose from 'mongoose'

var UserLinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
})

export default mongoose.model('UserLink', UserLinkSchema)
