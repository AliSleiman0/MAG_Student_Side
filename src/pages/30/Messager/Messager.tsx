// Messager.tsx
// ---------------------------
// 1. IMPORTS & DEPENDENCIES
// ---------------------------
// React Core
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// Third-party Components
import { ChatList, IChatListProps, MessageBox, SystemMessage } from "react-chat-elements";
import { Col, List, Row } from "antd";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

// Firebase & Types
import { Timestamp } from "firebase/firestore";
import {
    subscribeToMessages, updateMessageStatus, sendMessage,
    Message, RoomWithLastMsg, subscribeToUserRooms, resetUnreadCount
} from "../../../firebase/firebase";

// Context & Hooks
import { useUser } from "../../../Context/UserContext";
import { useResponsive } from "../../../hooks/useResponsive";

// API & Utilities
import { getUserProfile } from "../../../apiMAG/user";
import "./Messager.styles.css"
import ChatComposer from "./Input";

// ---------------------------
// 2. TYPE DEFINITIONS
// ---------------------------
interface ChatInterfaceProps {
    receiverId: string;
    onSelectRoom: (receiverId: string) => void;
}

interface ChatMessage {
    id: string;
    text: string;
    position: 'left' | 'right';
    type: 'text' | 'file';
    date: Date;
    title?: string;
    status: 'waiting' | 'sent' | 'received' | 'read';
    notch: boolean;
    retracted: boolean;
    removeButton: boolean;
    replyButton: boolean;
    forwarded: boolean;
    titleColor: string;
    senderId: string;
    statusColorType: string;
    data?: {
        uri: string;
        status: { click: boolean; loading: number };
        name?: string;
    };
}

// ---------------------------
// 3. QUERY CLIENT CONFIG
// ---------------------------
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,  // Prevent refetch on window focus
            retry: 2,                     // Retry failed queries twice
            staleTime: 1000 * 60 * 5      // 5 minutes cache lifetime
        }
    }
});

// ---------------------------
// 4. CUSTOM HOOKS
// ---------------------------
const useReceiverProfile = (receiverId: string) => {
    return useQuery({
        queryKey: ['receiverProfile', receiverId],
        queryFn: () => getUserProfile(Number(receiverId)),
        enabled: !!receiverId,            // Only fetch when ID exists
        staleTime: 1000 * 60 * 5,         // 5 minute cache
        retry: 2,                         // Retry twice on failure
    });
};

// ---------------------------
// 5. MAIN COMPONENT
// ---------------------------
const ChatInterface: React.FC<ChatInterfaceProps> = ({ receiverId = "1", onSelectRoom }) => {
    // ---------------------------
    // 5.1 COMPONENT STATE & REFS
    // ---------------------------
    const { mobileOnly } = useResponsive();
    const listRef = useRef<HTMLDivElement>(null);  // Reference to messages container
    const { profile, usertype } = useUser();       // User context data
    const [messages, setMessages] = useState<ChatMessage[]>([]);//messages
    const [isSending, setIsSending] = useState(false); //message is sending?
    const currentUserId = localStorage.getItem('userId') ?? ''; //Current userid
    const [chatRooms, setChatRooms] = useState<IChatListProps['dataSource']>([]); // rooms associated with the current user
    const { data: receiverProfile, isLoading, error } = useReceiverProfile(receiverId); //gets the receiver profile from its id

    // ---------------------------
    // 5.2 CHAT ROOM SUBSCRIPTION
    // ---------------------------
    useEffect(() => {
        if (!currentUserId) return;

        const unsub = subscribeToUserRooms(
            String(currentUserId),
            async (rooms: RoomWithLastMsg[]) => {
                const ds = await Promise.all(
                    rooms.map(async (room) => {
                        // find the “other” participant
                        const otherId = room.participants.find(
                            (id) => id !== String(currentUserId)
                        )!;

                        // load their profile
                        const other = await getUserProfile(Number(otherId));

                        // determine slots A/B for this room
                        const [userA, userB] = [...room.participants].sort();

                        // pick the right unread count for currentUser
                        const unread =
                            String(currentUserId) === userA
                                ? room.unreadCountA
                                : room.unreadCountB;

                        return {
                            id: other.userid,
                            avatar: other.image,
                            alt: other.fullname,
                            title: other.fullname,
                            subtitle: room.lastMessage.content || "New chat",
                            date: room.lastMessageAt?.toDate() || new Date(),
                            unread,
                            statusColorType:"badge",
                            onClick: async () => {
                                onSelectRoom(String(other.userid));
                                await resetUnreadCount(currentUserId, String(other.userid));
                            },
                        };
                    })
                );

                setChatRooms(ds);
            }
        );

        return () => unsub();
    }, [currentUserId]);
    // ---------------------------
    // 5.3 MESSAGE SUBSCRIPTION
    // ---------------------------
    useEffect(() => {
        if (!currentUserId || !receiverId) return;

        // Reset unread count when opening chat
        resetUnreadCount(currentUserId, receiverId).catch(console.error);

        // Subscribe to real-time messages
        const unsubscribe = subscribeToMessages(
            currentUserId,
            receiverId,
            (firestoreMessages: Message[]) => {
                const formattedMessages = firestoreMessages.map(msg =>
                    mapFirestoreToChatMessage(msg, currentUserId)
                );
                setMessages(formattedMessages);
            }
        );

        return () => unsubscribe();  // Cleanup on unmount
    }, [currentUserId, receiverId]);

    // ---------------------------
    // 5.4 MESSAGE STATUS UPDATES
    // ---------------------------
    useEffect(() => {
        // Mark received messages as read
        messages.forEach(async (msg) => {
            if (!currentUserId) return;
            if (msg.position === 'left' && msg.status !== 'read') { //check for received messages that are unread
                await updateMessageStatus(msg.id, receiverId, currentUserId, 'read');// change status of unread to red messages in firebase
                setMessages(prev => prev.map(m =>
                    m.id === msg.id ? { ...m, status: 'read' } : m
                ));// change status of unread to red messages in local code
            }
        });
    }, [messages]);

    // ---------------------------
    // 5.5 UI EFFECTS
    // ---------------------------
    useEffect(() => {
        // Auto-scroll to bottom on new messages
        const el = listRef.current;
        if (el) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // ---------------------------
    // 5.6 MESSAGE HANDLING
    // ---------------------------
    const handleSend = async (text: string, file?: File) => {
        if (!currentUserId || isSending) return;

        const tempId = `temp-${Date.now()}`;  // Temporary ID for optimistic update
        setIsSending(true);

        // Optimistic UI update
        setMessages(prev => [...prev, createTempMessage(tempId, text)]);

        try {
            const newMessage = await sendMessage(currentUserId, receiverId, text);

            // Replace temporary message with actual Firestore message
            setMessages(prev => prev.map(msg =>
                msg.id === tempId ? mapFirestoreToChatMessage(newMessage, currentUserId) : msg
            ));
        } catch (error) {
            // Rollback optimistic update on error
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    // ---------------------------
    // 5.7 HELPER FUNCTIONS
    // ---------------------------
    const createTempMessage = (tempId: string, text: string): ChatMessage => ({
        id: tempId,
        position: 'right',
        type: 'text',
        text,
        date: new Date(),
        title: 'You',
        status: 'waiting',
        notch: false,
        retracted: false,
        removeButton: false,
        replyButton: false,
        forwarded: false,
        titleColor: '#000',
        statusColorType: "badge",
        senderId: "temp-user"
    });

    const mapFirestoreToChatMessage = (
        msg: Message,
        currentUserId: string
    ): ChatMessage => {
        const position = msg.senderId === currentUserId ? 'right' : 'left';

        return {
            id: msg.id,
            position,
            type: msg.contentType,
            text: msg.content,
            date: msg.createdAt?.toDate() || new Date(),
            senderId: msg.senderId,
            status: msg.status,
            notch: false,
            retracted: false,
            removeButton: false,
            replyButton: false,
            forwarded: false,
            titleColor: '#000',
            statusColorType: "badge",
            ...(msg.contentType === 'file' && {
                data: {
                    uri: msg.fileUrl || '',
                    status: { click: false, loading: 0 },
                    name: msg.fileName,
                },
            }),
        };
    };

 

    return (

        <Row gutter={[16, 16]}>
            {/* Chat List Column */}
            <Col xs={0} sm={0} md={24} lg={6} xl={6} style={{ backgroundColor: "#ffffff", padding: "8px" }}>
                <ChatList
                    lazyLoadingImage="adas"
                    id={432}
                    className='chat-list'
                    dataSource={chatRooms.map(room => ({
                        ...room,
                        className: String(room.id) === receiverId ? "chat-room-selected" : ""
                    }))}
                    onClick={(item: any) => {
                        if (item && item.onClick) {
                            item.onClick(); //Explicitly invoking onclick on each item
                        }
                    }}
                />
            </Col>

            {/* Chat Messages Column */}
            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: mobileOnly ? '100vh' : '80vh',
                    width: '100%'
                }}>
                    {/* Messages Container */}
                    <div ref={listRef} style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 8,
                        scrollBehavior: 'smooth',
                        minHeight: mobileOnly ? '60vh' : 'auto'
                    }}>
                        <List
                            split={false}
                            locale={{ emptyText: <SystemMessage text="Start a conversation" /> }}
                            style={{ width: "100%", backgroundColor: "#f5fdff" }}
                            bordered={false}
                            dataSource={messages}

                            renderItem={(item) => (
                                <List.Item
                                    key={item.id}
                                    style={{
                                        width: "100%",
                                        display: 'flex',
                                        justifyContent: item.position === 'right'
                                            ? 'flex-end'
                                            : 'flex-start',
                                        padding: '8px 0'
                                    }}
                                >
                                    <MessageBox
                                        {...item}
                                        title={
                                            item.position === 'right'
                                                ? 'You'
                                                : `Advisor ${receiverProfile?.fullname}`
                                        }
                                        notch={item.position === 'right'}
                                        retracted={false}
                                        onTitleClick={() => {/* Handle profile click */ }}
                                        // only show the status ticks on your own sent messages
                                        status={item.position === 'right' ? item.status : undefined }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>

                    {/* Composer */}
                    <div style={{
                        padding: 16,
                        borderTop: '1px solid #f0f0f0',
                        position: mobileOnly ? 'fixed' : 'relative',
                        bottom: 0,
                        width: '100%',
                        background: 'white'
                    }}>
                        <ChatComposer onSend={handleSend} />
                    </div>
                </div>
            </Col>
        </Row>

    );
};

const ChatInterfaceWrapper: React.FC = () => {
    const navigate = useNavigate();
    const { receiverId } = useParams<{ receiverId: string }>();
    return (
        <QueryClientProvider client={queryClient}>
            <ChatInterface
                receiverId={receiverId!}
                onSelectRoom={(newReceiver) => {
                    navigate(`/Messager/${newReceiver}`);
                }}
            />
        </QueryClientProvider>
    );
};
export default ChatInterfaceWrapper