import mongoose from 'mongoose'

var MessageSubscriptionSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
})

export default mongoose.model('MessageSubscription', MessageSubscriptionSchema)
