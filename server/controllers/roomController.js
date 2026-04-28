const Room = require('../models/Room');
const Placement = require('../models/Placement');
const Cancellation = require('../models/Cancellation');


//פונקציה למציאת חדר פנוי
exports.findAvailableRooms = async (req, res) => {
    try {
        const { date, lessonNumber, capacity, hasProjector, wing, floor } = medicalQuery; // נתוני החיפוש מה-Body או ה-Query
        
        // 1. המרת התאריך ליום בשבוע (1=ראשון, כפי שהגדרת במודל)
        const searchDate = new Date(date);
        const dayOfWeek = searchDate.getDay() + 1; 

        // 2. בניית פילטר ראשוני לחדרים (לפי מאפיינים פיזיים)
        let roomFilter = {};
        if (capacity) roomFilter.capacity = { $gte: capacity };
        if (hasProjector !== undefined) roomFilter.hasProjector = hasProjector;
        if (wing) roomFilter.wing = wing;
        if (floor) roomFilter.floor = floor;

        // שליפת כל החדרים שעומדים בתנאים הפיזיים
        const rooms = await Room.find(roomFilter);

        // 3. בדיקת זמינות לכל חדר
        const availabilityResults = await Promise.all(rooms.map(async (room) => {
            
            // א. האם החדר תפוס במערכת הקבועה?
            const scheduledLesson = room.weeklySchedule.find(s => 
                s.dayOfWeek === dayOfWeek && s.lessonNumber === parseInt(lessonNumber)
            );

            // ב. האם יש ביטול לשיעור הזה בתאריך הספציפי?
            const isCancelled = await Cancellation.findOne({
                room: room._id,
                date: searchDate,
                lessonNumber: lessonNumber
            });

            // ג. האם יש שיבוץ קיים (Placement) שתופס את החדר?
            const isBooked = await Placement.findOne({
                room: room._id,
                date: searchDate,
                lessonNumber: lessonNumber
            });

            // לוגיקת הזמינות:
            // החדר פנוי אם: (אין מערכת קבועה או שיש ביטול) וגם (אין שיבוץ קיים)
            const isFree = (!scheduledLesson || isCancelled) && !isBooked;

            return isFree ? room : null;
        }));

        // סינון הערכים הריקים (null) והחזרת רשימת החדרים הפנויים
        const availableRooms = availabilityResults.filter(r => r !== null);
        
        res.json(availableRooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//פונקציה לשיבוץ חדר
exports.fitIn = async (req, res) => {
    try {
        // המשתמש שולח ב-Body את ה-roomId, התאריך, מספר השיעור וכו'
        const { room, date, lessonNumber, purpose, bookedBy } = req.body;

        // בדיקה נוספת לביטחון: האם החדר באמת עדיין פנוי? 
        // (מומלץ כדי למנוע מצב ששני אנשים שריינו את אותו חדר באותה שניה)
        const existingPlacement = await Placement.findOne({ room, date, lessonNumber });
        if (existingPlacement) {
            return res.status(400).json({ message: "מצטערים, החדר כבר נתפס ברגע זה" });
        }

        const newPlacement = new Placement({
            room,
            date,
            lessonNumber,
            purpose,
            bookedBy
        });

        const saved = await newPlacement.save();
        res.status(201).json({ message: "החדר שובץ בהצלחה!", data: saved });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};