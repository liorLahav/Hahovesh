import { realtimeDb } from "@/FirebaseConfig";
import { get, onChildAdded, onValue, ref } from "firebase/database";

const getEvents = async () => {
    try {
        const eventsRef = ref(realtimeDb, "events");
        const data = await get(eventsRef);
        if (!data.exists()) {
            console.log("No data available");
            return null;
        }
        
        return data.val();
    } catch (error) {
        console.error("Error fetching events: ", error);
        return null;
    }   
}
const onChildappend = (callback: (data: any) => void) => {
    const eventsRef = ref(realtimeDb, "events");
    onChildAdded(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log("New event added: ", data);
            callback(data.val());
        }
    }
    );
}
export { getEvents ,onChildappend};