const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    hearing_name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    committee_name: {
        type: String,
        required:true
    },
    hearing_details: {
        type:String,
        required: true
    }

})


module.exports = meetingSchema;