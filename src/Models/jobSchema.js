import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'A post should include the company name!']
  },
  logo: String,
  position: String,
  postedAt: {
    type: Date,
    default: Date.now()
  },
  closeAt: {
    type: Date,
    required: [true, 'A post should have closing date!']
  },
  contract: String,
  location: {
    //GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    required: [true, '!'],
    coordinates: [Number],
    address: String,
    description: String
  },
  website: String,
  description: String,
  requirements: {
    content: String,
    items: Array,
    role: {
      content: String,
      item: Array
    }
  }

})

export default mongoose.model('Job', jobSchema)