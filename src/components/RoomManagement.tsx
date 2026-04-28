import { useState } from 'react';

//  אובייקט של חדר
interface Room {
  id: number;          // מזהה ייחודי לכל חדר
  roomNumber: string;  // מספר החדר (למשל: '101')
  floor: number;       // קומה
  wing: string;        // אגף (למשל: 'א')
  capacity: number;    // מספר מקומות בחדר
  hasProjector: boolean; // האם יש מקרן? (true/false)
}

export default function RoomManagement() { 
  // rooms מכיל את רשימת החדרים הנוכחית, ו-setRooms היא הפונקציה שמעדכנת את הרשימה.
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, roomNumber: '101', floor: 1, wing: 'א', capacity: 30, hasProjector: true },
    { id: 2, roomNumber: '205', floor: 2, wing: 'ב', capacity: 25, hasProjector: false },
    { id: 3, roomNumber: '102', floor: 1, wing: 'א', capacity: 40, hasProjector: true },
    { id: 4, roomNumber: '301', floor: 3, wing: 'ג', capacity: 20, hasProjector: false }, 
  ]);

  // פונקציה למחיקת חדר בודד מהרשימה
  const handleDelete = (roomId: number) => {
    //  בקשת אישור מהמשתמש 
    const isConfirmed = window.confirm('האם את בטוחה שברצונך למחוק חדר זה?');
    
    //  אם המשתמש אישר, נבצע את המחיקה
    if (isConfirmed) {
      // רשימה חדשה שמכילה את כל החדרים בלי החדר שמחקנו  
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      setRooms(updatedRooms);
    }
  };

  // פונקציה למיון הרשימה לפי עמודה מסוימת (למשל לפי קומה או אגף)
  const handleSort = (key: keyof Room) => {
    //  יוצרים עותק של הרשימה 
    const sortedRooms = [...rooms];
    
    //  משתמש בפונקציית sort המובנית של JavaScript
    sortedRooms.sort((a, b) => {
      // אם הערך ב-a קטן מ-b, הוא יופיע קודם
      if (a[key] < b[key]) return -1;
      // אם הערך ב-a גדול מ-b, הוא יופיע אחר כך
      if (a[key] > b[key]) return 1;
      return 0; // אם הם שווים, לא משנים את הסדר
    });
    
    //  מעדכנים את הזיכרון עם הרשימה הממוינת החדשה
    setRooms(sortedRooms);
  };

  // פונקציה לניקוי כל השיבוצים 
  const handleClearAllBookings = () => {
    //  בקשת אישור מהמשתמש 
    const isConfirmed = window.confirm('אזהרה: האם את בטוחה שברצונך למחוק את כל השיבוצים מכל החדרים במערכת?');
    
    if (isConfirmed) {
      // בעתיד, כאן תתבצע פנייה לשרת (Server) שתנקה את מסד הנתונים.
      alert('כל השיבוצים במערכת נוקו בהצלחה (סימולציה).');
    }
  };

  return (
    <div style={{ padding: '20px', direction: 'rtl' }}>
      <h2>ניהול חדרים</h2>
      
      {/* סרגל הכלים העליון עם כפתורי המיון וכפתור הניקוי */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
        <div>
          <strong>מיון רשימה לפי: </strong>
          <button onClick={() => handleSort('roomNumber')} style={{ marginRight: '10px', cursor: 'pointer' }}>מספר חדר</button>
          <button onClick={() => handleSort('floor')} style={{ marginRight: '10px', cursor: 'pointer' }}>קומה</button>
          <button onClick={() => handleSort('wing')} style={{ marginRight: '10px', cursor: 'pointer' }}>אגף</button>
        </div>
        
        {/* כפתור אדום לניקוי כל השיבוצים */}
        <button 
          onClick={handleClearAllBookings} 
          style={{ backgroundColor: '#ff4d4d', color: 'white', fontWeight: 'bold', cursor: 'pointer', border: 'none', padding: '5px 15px', borderRadius: '4px' }}
        >
          ניקוי כל השיבוצים במערכת
        </button>
      </div>

      {/* טבלת החדרים */}
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>מספר חדר</th>
            <th>קומה</th>
            <th>אגף</th>
            <th>קיבולת</th>
            <th>מקרן</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {/* אנחנו עוברים על כל חדר ברשימה (map) ומייצרים עבורו שורה בטבלה */}
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.roomNumber}</td>
              <td>{room.floor}</td>
              <td>{room.wing}</td>
              <td>{room.capacity}</td>
              <td>{room.hasProjector ? 'יש' : 'אין'}</td>
              <td>
                <button style={{ cursor: 'pointer', marginLeft: '5px' }}>צפייה</button>
                <button style={{ cursor: 'pointer', marginLeft: '5px' }}>עריכה</button>
                {/* כפתור מחיקה שקורא לפונקציית המחיקה עם ה-ID של החדר הספציפי */}
                <button 
                  style={{ color: 'red', cursor: 'pointer' }} 
                  onClick={() => handleDelete(room.id)}
                >
                  מחיקה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}