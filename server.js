const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://127.0.0.1:27017/appointment-scheduler', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


const slotSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    isBooked: Boolean,
  });
  
const appointmentSchema = new mongoose.Schema({
slotId: mongoose.Schema.Types.ObjectId,
userDetails: {
    name: String,
    email: String,
},
});

const Slot = mongoose.model('Slot', slotSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
