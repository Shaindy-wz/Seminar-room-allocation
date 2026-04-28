const mongoose = require('mongoose');

const CancellationSchema = new mongoose.Schema({
    room: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Room', 
        required: true 
    },
    date: { type: Date, required: true },            // מתי החדר מתפנה
    lessonNumber: { type: Number, required: true },  // איזה שיעור התבטל
    reason: String                                   // למה התבטל (למשל: "חופש למבחן")
});

module.exports = mongoose.model('Cancellation', CancellationSchema);