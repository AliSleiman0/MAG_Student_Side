// firestore.ts
import { useEffect, useMemo, useState } from "react";
import { db } from "./firebase";
import {
    collection, addDoc, query, where,
    onSnapshot, orderBy, serverTimestamp,
    updateDoc, doc, getDocs, Timestamp
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

// Firestore collections
const chatsCollection = collection(db, "chats");
const messagesCollection = (chatId: string) =>
    collection(db, "chats", chatId, "messages");

// Types
interface Chat {
    id: string;
    participants: string[];
    lastMessage: string;
    timestamp: Date;
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: Timestamp;
}

// Chat Service
export const chatService = {
    // Create or get existing chat
    async getOrCreateChat(senderId: string, receiverId: string): Promise<string> {
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
    async sendMessage(text: string, receiverId: string): Promise<void> {
        const senderId = localStorage.getItem("userId") || '';
        if (!senderId) throw new Error("User not authenticated");

        const chatId = await this.getOrCreateChat(senderId, receiverId);

        try {
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
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    // Real-time message listener
    listenToMessages(receiverId: string, callback: (messages: Message[]) => void) {
        const senderId = localStorage.getItem("userId") || '';
        const participants = [senderId, receiverId].sort();
        let unsubscribeMessages: () => void = () => { };

        const q = query(chatsCollection, where("participants", "==", participants));

        const unsubscribeChat = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    if (unsubscribeMessages) unsubscribeMessages();

                    const messagesQuery = query(
                        messagesCollection(change.doc.id),
                        orderBy("timestamp", "asc")
                    );

                    unsubscribeMessages = onSnapshot(messagesQuery, (messagesSnapshot) => {
                        const messages = messagesSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data() as Omit<Message, "id">
                        }));
                        callback(messages);
                    });
                }
            });
        });

        return () => {
            unsubscribeChat();
            unsubscribeMessages();
        };
    },

    // Get all chats for current user
    listenToUserChats(callback: (chats: Chat[]) => void) {
        const userId = localStorage.getItem("userId") || '';
        const q = query(chatsCollection, where("participants", "array-contains", userId));

        return onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<Chat, "id">
            }));
            callback(chats);
        });
    },

    // Typing indicators
    listenToTypingIndicator(chatId: string, userId: string, callback: (isTyping: boolean) => void) {
        const typingRef = doc(db, `chats/${chatId}/typing/${userId}`);
        return onSnapshot(typingRef, (snap) => {
            callback(snap.exists() ? snap.data()?.isTyping : false);
        });
    },

    async updateTypingStatus(chatId: string, userId: string, isTyping: boolean) {
        const typingRef = doc(db, `chats/${chatId}/typing/${userId}`);
        await updateDoc(typingRef, {
            isTyping,
            timestamp: serverTimestamp()
        });
    }
};

// Chat Component
export const Chat = () => {
    const { advisorId } = useParams<{ advisorId: string }>();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [chats, setChats] = useState<Chat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeChat, setActiveChat] = useState<string>();

    const senderId = localStorage.getItem("userId") || '';
    const receiverId = advisorId || '';

    const advisorChats = useMemo(() =>
        chats.filter(chat =>
            chat.participants.includes(receiverId) &&
            chat.participants.includes(senderId)
        ),
        [chats, receiverId, senderId]
    );

    useEffect(() => {
        if (!senderId || !receiverId) {
            setError('Invalid chat parameters');
            setLoading(false);
            navigate('/chat-error');
            return;
        }
    }, [senderId, receiverId, navigate]);

    useEffect(() => {
        const unsubscribeMessages = chatService.listenToMessages(receiverId, setMessages);
        return unsubscribeMessages;
    }, [receiverId]);

    useEffect(() => {
        const unsubscribeChats = chatService.listenToUserChats(setChats);
        return unsubscribeChats;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await chatService.sendMessage(newMessage.trim(), receiverId);
            setNewMessage("");
        } catch (error) {
            setError('Failed to send message');
        }
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="chat-container">
            <div className="chat-list">
                {advisorChats.map(chat => (
                    <div
                        key={chat.id}
                        className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                        onClick={() => setActiveChat(chat.id)}
                    >
                        <div className="chat-participant">
                            Advisor: {chat.participants.find(id => id !== senderId)}
                        </div>
                        <div className="chat-preview">
                            {chat.lastMessage}
                            <span className="timestamp">
                                {new Date(chat.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="message-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.senderId === senderId ? "sent" : "received"}`}
                    >
                        <div className="message-text">{message.text}</div>
                        <div className="message-time">
                            {message.timestamp?.toDate().toLocaleTimeString()}
                        </div>
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