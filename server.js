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
    

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
