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

// Routes

//create a new slot
app.post('/api/slots', async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        const newSlot = new Slot({ startTime, endTime, isBooked: false });
        await newSlot.save();
        res.status(201).json(newSlot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get all slots
app.get('/api/slots', async (req, res) => {
try {
    const slots = await Slot.find({ isBooked: false });
    res.status(200).json(slots);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});


// create appointment api
app.post('/api/appointments', async (req, res) => {
    try {
        const { slotId, userDetails } = req.body;
        const slot = await Slot.findById(slotId);
        if (!slot || slot.isBooked) {
        res.status(400).json({ error: 'Invalid slot or already booked' });
        return;
        }
    
        const newAppointment = new Appointment({ slotId, userDetails });
        await newAppointment.save();
    
        slot.isBooked = true;
        await slot.save();
    
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// get all appointments
app.get('/api/appointments', async (req, res) => {
try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
