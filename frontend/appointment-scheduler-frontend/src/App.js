import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '' });
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({ slotId: '', userDetails: { name: '', email: '' } });

  useEffect(() => {
    // Fetch available time slots
    axios.get('http://localhost:3001/api/slots')
      .then(response => setSlots(response.data))
      .catch(error => console.error(error));

    // Fetch booked appointments
    axios.get('http://localhost:3001/api/appointments')
      .then(response => setBookedAppointments(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSlotSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/slots', newSlot)
      .then(response => setSlots([...slots, response.data]))
      .catch(error => console.error(error));
    setNewSlot({ startTime: '', endTime: '' });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/appointments', bookingDetails)
      .then(response => {
        setBookedAppointments([...bookedAppointments, response.data]);
        setSlots(slots.map(slot => (slot._id === bookingDetails.slotId ? { ...slot, isBooked: true } : slot)));
      })
      .catch(error => console.error(error));
    setBookingDetails({ slotId: '', userDetails: { name: '', email: '' } });
  };

  return (
    <div className="App">
      <h1>Appointment Scheduler</h1>

      {/* Slot Creation Interface */}
      <form onSubmit={handleSlotSubmit}>
        <label>Start Time:
          <input type="datetime-local" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} />
        </label>
        <label>End Time:
          <input type="datetime-local" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} />
        </label>
        <button type="submit">Create Slot</button>
      </form>

      {/* Display Time Slots */}
      <h2>Available Time Slots</h2>
      <ul>
        {slots.map(slot => (
          <li key={slot._id}>
            {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
            {!slot.isBooked && <button onClick={() => setBookingDetails({ slotId: slot._id, userDetails: { name: '', email: '' } })}>Book</button>}
          </li>
        ))}
      </ul>

      {/* Appointment Booking Interface */}
      <h2>Book Appointment</h2>
      <form onSubmit={handleBookingSubmit}>
        <label>Name:
          <input type="text" value={bookingDetails.userDetails.name} onChange={(e) => setBookingDetails({ ...bookingDetails, userDetails: { ...bookingDetails.userDetails, name: e.target.value } })} />
        </label>
        <label>Email:
          <input type="email" value={bookingDetails.userDetails.email} onChange={(e) => setBookingDetails({ ...bookingDetails, userDetails: { ...bookingDetails.userDetails, email: e.target.value } })} />
        </label>
        <button type="submit">Book Appointment</button>
      </form>

      {/* View Appointments */}
      <h2>Booked Appointments</h2>
      <ul>
        {bookedAppointments.map(appointment => (
          <li key={appointment._id}>
            <strong>Name:</strong> {appointment.userDetails.name} <br />
            <strong>Email:</strong> {appointment.userDetails.email} <br />
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
