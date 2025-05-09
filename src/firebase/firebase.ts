// firebase.ts
import { initializeApp } from 'firebase/app';
import { Unsubscribe, addDoc, collection, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { browserLocalPersistence, getAuth, setPersistence, signInAnonymously } from 'firebase/auth';
import { Timestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDlJAn1I6NRfQdfyUJ9vy9YE9__HSBI4wg",
    authDomain: "mag-student-side.firebaseapp.com",
    projectId: "mag-student-side",
    storageBucket: "mag-student-side.firebasestorage.app",
    messagingSenderId: "246494652378",
    appId: "1:246494652378:web:ed5b784c09d1701f5602e3",
    measurementId: "G-H4E7SV3G7N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
// src/types/chat.ts

export type RoomType = "advisor-student" | "group" | /* future types */ string;

export interface Room {
    /** Firestore document ID */
    id: string;
    /** UIDs of participants (advisor & student) */
    participants: string[];
    /** Last message timestamp for ordering rooms */
    lastMessageAt: Timestamp;
}

export type MessageStatus = "waiting" | "sent" | "delivered" | "read";

export type ContentType = "text" | "file"; //later voice

export interface Message {
    /** Firestore document ID */
    id: string;
    /** UID of the sender (advisor or student) */
    senderId: string;
    /** Actual text content or file caption */
    content: string;
    /** Distinguishes plain text from an attachment */
    contentType: ContentType;
    /** Storage URL when contentType === "file" */
    fileUrl?: string;
    /** Original filename for display (e.g. “notes.pdf”) */
    fileName?: string;
    /** Message lifecycle status */
    status: MessageStatus;
    /** Creation timestamp (serverTimestamp()) */
    createdAt: Timestamp;
    /** Optional edit timestamp */
    editedAt?: Timestamp;
    /** If this message is a reply, the ID of the message being replied to */
    replyTo?: string;
    /** Denormalized original sender ID for fast rendering */
    replyToSenderId?: string;
    /** Denormalized snippet of the original message */
    replyToContentSnippet?: string;
};
export { db, auth, signInAnonymously };

function getRoomId(user1: string, user2: string): string {
    const sortedIds = [user1, user2].sort();
    console.log("roomid", sortedIds.join('-'));
    return sortedIds.join('-');
    
}

// 2️⃣ Send a plain-text message from sender → receiver
export async function sendMessage(
    senderId: string,
    receiverId: string,
    content: string
): Promise<any> {
    const roomId = getRoomId(senderId, receiverId);
    const roomRef = doc(db, "rooms", roomId);

    const participants = [senderId, receiverId].sort();

    await setDoc(
        roomRef,
        {
            participants: participants,
            lastMessageAt: serverTimestamp(),
        },
        { merge: true }
    );

    const messagesCol = collection(db, "rooms", roomId, "messages");

    const messageData = {
        senderId,
        content,
        contentType: "text",
        status: "sent",
        createdAt: serverTimestamp(), // still unresolved at this point
    };

    await addDoc(messagesCol, messageData);
    //console.log("messagefirebase", senderId,
    //    messageData.senderId, content);
    return  messageData;
}
// 3️⃣ Subscribe to text messages in that room (ordered by time)
export function subscribeToMessages(
    userA: string,
    userB: string,
    onUpdate: (messages: Message[]) => void
): Unsubscribe {
    const roomId = getRoomId(userA, userB);
    const messagesCol = collection(db, "rooms", roomId, "messages");
    const q = query(messagesCol, orderBy("createdAt", "asc"));

    // onSnapshot returns an unsubscribe function
    return onSnapshot(q, (snap) => {
        const msgs: Message[] = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Message[];
        onUpdate(msgs);
    });
}
export async function updateMessageStatus(
    messageId: string,
    senderId: string,
    receiverId: string,
    newStatus: MessageStatus
): Promise<void> {
    try {
        const roomId = getRoomId(senderId, receiverId);
        console.log("Updating path:", `rooms/${roomId}/messages/${messageId}`);
        const messageRef = doc(db, `rooms/${roomId}/messages/${messageId}`);

        await updateDoc(messageRef, {
            status: newStatus,
            ...(newStatus === 'read' && { readAt: serverTimestamp() })
        });

        // Update room's last activity timestamp
        const roomRef = doc(db, "rooms", roomId);
        await updateDoc(roomRef, {
            lastMessageAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error updating message status:", error);
        throw new Error("Failed to update message status");
    }
}