// firestore.ts
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp,  updateDoc, doc, getDocs } from "firebase/firestore";
localStorage.setItem("userId", "123"); // Use actual MySQL user ID
// Firestore collections
const chatsCollection = collection(db, "chats");
const messagesCollection = (chatId: string) => collection(db, "chats", chatId, "messages");

// Types
interface Chat {
    id: string;
    participants: number[];
    lastMessage: string;
    timestamp: Date;
}

interface Message {
    senderId: number;
    receiverId: number;
    text: string;
    timestamp: Date;
}

// Chat functions
export const chatService = {
    // Create or get existing chat
    async getOrCreateChat(senderId: number, receiverId: number): Promise<string> {
        const participants = [senderId, receiverId].sort();
        const q = query(chatsCollection, where("participants", "==", participants));

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            return snapshot.docs[0].id;
        }

        const newChat = await addDoc(chatsCollection, {
            participants,
            lastMessage: "",
            timestamp: serverTimestamp()
        });

        return newChat.id;
    },

    // Send message
    async sendMessage(text: string, receiverId: number): Promise<void> {
        const senderId = Number(localStorage.getItem("userId"));
        const chatId = await this.getOrCreateChat(senderId, receiverId);

        await addDoc(messagesCollection(chatId), {
            senderId,
            receiverId,
            text,
            timestamp: serverTimestamp()
        });

        await updateDoc(doc(chatsCollection, chatId), {
            lastMessage: text,
            timestamp: serverTimestamp()
        });
    },

    // Real-time message listener
    listenToMessages(receiverId: number, callback: (messages: Message[]) => void) {
        const senderId = Number(localStorage.getItem("userId"));
        const participants = [senderId, receiverId].sort();

        const q = query(chatsCollection, where("participants", "==", participants));
        return onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === "modified") {
                    const messagesQuery = query(
                        messagesCollection(change.doc.id),
                        orderBy("timestamp", "asc")
                    );

                    onSnapshot(messagesQuery, (messagesSnapshot) => {
                        const messages = messagesSnapshot.docs.map(doc => doc.data() as Message);
                        callback(messages);
                    });
                }
            });
        });
    },

    // Get all chats for current user
    listenToUserChats(callback: (chats: Chat[]) => void) {
        const userId = Number(localStorage.getItem("userId"));
        const q = query(chatsCollection, where("participants", "array-contains", userId));

        return onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Chat, "id">
            }));
            callback(chats);
        });
    }
};

export const ChatComponent = ({ receiverId }: { receiverId: number }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [chats, setChats] = useState<Chat[]>([]);

    // Load messages
    useEffect(() => {
        const unsubscribe = chatService.listenToMessages(receiverId, setMessages);
        return () => unsubscribe();
    }, [receiverId]);

    // Load user's chats
    useEffect(() => {
        const unsubscribe = chatService.listenToUserChats(setChats);
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await chatService.sendMessage(newMessage.trim(), receiverId);
        setNewMessage("");
    };

    return (
        <div className="chat-container">
            <div className="chat-list">
                {chats.map(chat => (
                    <div key={chat.id} className="chat-item">
                        <div>Chat with {chat.participants.find(id => id !== Number(localStorage.getItem("userId")))}</div>
                        <div className="last-message">{chat.lastMessage}</div>
                    </div>
                ))}
            </div>

            <div className="message-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.senderId === Number(localStorage.getItem("userId")) ? "sent" : "received"}`}>
                        <div className="message-text">{message.text}</div>
                        <div className="message-time">{new Date(message.timestamp).toLocaleTimeString()}</div>
                    </div>
                ))}

                <form onSubmit={handleSubmit} className="message-form">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};