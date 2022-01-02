import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
	company: {
		type: String,
		required: [true, 'A post should include the company name!'],
	},
	logo: String,
	position: String,
	postedAt: {
		type: Date,
		default: Date.now(),
	},
	closeAt: {
		type: Date,
		required: [true, 'A post should have closing date!'],
	},
	contract: String,
	location: String,
	website: String,
	description: String,
	requirements: Object,
	role: Object
})

export default mongoose.model('Job', jobSchema)
