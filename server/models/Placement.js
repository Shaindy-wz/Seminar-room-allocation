const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
    // קישור לחדר - משתמשים ב-ID של ה-Room כדי ליצור קשר ביניהם
    room: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    date: { type: Date, required: true },            // התאריך המדויק
    lessonNumber: { type: Number, required: true },  // מספר השיעור (1-9)
    purpose: String,                                 // סיבת השיבוץ
    bookedBy: String                                 // מי שריין את החדר
});

module.exports = mongoose.model('Placement', PlacementSchema);