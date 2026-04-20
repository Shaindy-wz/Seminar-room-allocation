const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    roomNumber: { type: String, required: true, unique: true }, // מספר חדר חד-ערכי
    wing: { type: String, required: true },                    // אגף
    floor: { type: Number, required: true },                   // קומה
    capacity: { type: Number, required: true },                // כמה בנות נכנסות
    hasProjector: { type: Boolean, default: false },           // מקרן (כן/לא)

    // מערכת קבועה - נשמרת כאן כי היא קטנה וסטטית יחסית
    weeklySchedule: [{
        dayOfWeek: { type: Number, min: 1, max: 7 },           // 1=ראשון...
        lessonNumber: { type: Number, min: 1, max: 9 },        // מספר שיעור
        subject: String,                                       // שם השיעור/הכיתה
    }]
});

module.exports = mongoose.model('Room', RoomSchema);