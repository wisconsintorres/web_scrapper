const  mongoose = require("mongoose")

//data from congressional meetings
let meet;
const meetingSchema = require('./userSchema.js')
const meeting_data = require('./congressional-meetings.json')
const Meeting = mongoose.model("Meeting", meetingSchema);

//Assign MongoDB connection string to Uri and declare options settings
const uri = "mongodb+srv://wisconsintorres:PASSWORD@cluster0.5v5gv.mongodb.net/test?retryWrites=true&w=majority";

// Declare a variable named option and assign optional settings
const  options = {
    useNewUrlParser:  true,

};


// Connect MongoDB Atlas using mongoose connect method
let db;
mongoose.connect(uri, options).then((dbConnection) => {
        console.log("Database connection established!");
        db = dbConnection;
        afterwards();
    },
    err  => {
        {
            console.log("Error connecting Database instance due to:", err);
        }
    });


//Congressional meeting data to Mongo
//grab all of the array data from meeting obj
for(let i =0; i< meeting_data.length; i++){

    meet = new Meeting(meeting_data[i]);
    meet.save(function (err) {
        if (err) return handleError(err);
        // saved!
    });

}



//disconnect
function afterwards(){



    //disconnect
    db.disconnect();
    console.log('db closed')
}


