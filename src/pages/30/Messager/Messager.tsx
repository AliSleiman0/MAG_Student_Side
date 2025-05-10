import { useEffect, useRef, useState } from "react";
import { ChatList, IChatListProps, MessageBox, SystemMessage } from "react-chat-elements";
import { Col, List, Row } from "antd";
import { useUser } from "../../../Context/UserContext";
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToMessages, updateMessageStatus, sendMessage, Message, RoomWithLastMsg, subscribeToUserRooms, resetUnreadCount } from "../../../firebase/firebase";
import ChatComposer from "./Input";
import { Timestamp } from "firebase/firestore";
import { ReceiverProfile, UserProfile, getUserProfile, showProfile } from "../../../apiMAG/user";
import "./Messager.styles.css"

import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useResponsive } from "../../../hooks/useResponsive";



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
    status: 'waiting' | 'sent' | 'delivered' | 'read';
    notch: boolean;
    retracted: boolean;
    removeButton: boolean;
    replyButton: boolean;
    forwarded: boolean;
    titleColor: string;
    senderId: string,
    data?: {
        uri: string;
        status: { click: boolean; loading: number };
        name?: string;
    };
}
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 1000 * 60 * 5 // 5 minutes cache
        }
    }
});
const useReceiverProfile = (receiverId: string) => {
    return useQuery({
        queryKey: ['receiverProfile', receiverId],
        queryFn: () => getUserProfile(Number(receiverId)),
        enabled: !!receiverId, // Only fetch when receiverId exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 2,
    });
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ receiverId="1", onSelectRoom }) => {
   
    const { mobileOnly } = useResponsive();
    const listRef = useRef<HTMLDivElement>(null);
    const { profile, usertype } = useUser();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const currentUserId = localStorage.getItem('userId') ?? '';
 
   
    const { data: receiverProfile, isLoading, error } = useReceiverProfile(receiverId);

    const [chatRooms, setChatRooms] = useState<IChatListProps['dataSource']>([]);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("currentUserId", currentUserId);
        if (!currentUserId) return;
        const unsub = subscribeToUserRooms(String(currentUserId), async (rooms: RoomWithLastMsg[]) => {
            console.log("▶️ Firestore rooms snapshot:", rooms);
            const ds = await Promise.all(
                rooms.map(async (room) => {
                    const otherId = room.participants.find((id) => Number(id) !== Number(currentUserId))!;
                    const other = await getUserProfile(Number(otherId));
                    console.log("room", room);
                    return {
                        id: other.userid,
                        avatar: other.image,
                        alt: other.fullname,
                        title: other.fullname,
                        subtitle: room.lastMessage.content || "debugging starts",
                        date: room.lastMessageAt
                            ? room.lastMessageAt.toDate()
                            : new Date(),
                        unread: room.unreadCount[currentUserId] || 0,
                        onClick: () => onSelectRoom(String(other.userid)),
                     
                    };
                })
            );
            console.log("ds", ds);
            setChatRooms(ds);
        }
        );
        return () => unsub();
    }, [currentUserId]);
    useEffect(() => {
        if (!currentUserId || !receiverId) return;

        // reset my unread count for this room
        resetUnreadCount(currentUserId, receiverId).catch(console.error);

        const unsubscribe = subscribeToMessages(
            currentUserId,
            receiverId,
            (firestoreMessages: any) => {
                const formattedMessages = firestoreMessages.map((msg: Message) =>
                    mapFirestoreToChatMessage(msg, currentUserId)
                );
                setMessages(formattedMessages);
            }
        );

        return () => unsubscribe();
    }, [currentUserId, receiverId]);

    useEffect(() => {
        // Mark messages as read
        messages.forEach(async (msg) => {
            if (!currentUserId) return
            if (msg.position === 'left' && msg.status !== 'read') {
                await updateMessageStatus(msg.id, receiverId, currentUserId, 'read');
                setMessages(prev => prev.map(m =>
                    m.id === msg.id ? { ...m, status: 'read' } : m
                ));
            }
        });
    }, [messages]);

    useEffect(() => {
        const el = listRef.current;
        if (el) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleSend = async (text: string, file?: File) => {
        if (!currentUserId || isSending) return;

        const tempId = `temp-${Date.now()}`;
        setIsSending(true);

        // Optimistic update
        setMessages(prev => [...prev, createTempMessage(tempId, text)]);

        try {
            const newMessage = await sendMessage(currentUserId, receiverId, text);


            setMessages(prev => prev.map(msg => {
                //console.log(msg.id === currentUserId ? 'right' : 'left');
                return msg.id === tempId ? mapFirestoreToChatMessage(newMessage, currentUserId) : msg
            }));
        } catch (error) {
            //console.error("Failed to send message:", error);
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            alert('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };



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
        senderId: "1232"
    });
    const mapFirestoreToChatMessage = (
        msg: Message,
        currentUserId: string
    ): ChatMessage => {
        // compute & log position
        const position = msg.senderId === currentUserId ? 'right' : 'left';


        // build and return ChatMessage
        return {
            id: msg.id,
            position,                     // use the computed value
            type: msg.contentType,
            text: msg.content,
            date: msg.createdAt
                ? typeof (msg.createdAt as any).toDate === 'function'
                    ? (msg.createdAt as Timestamp).toDate()
                    : (msg.createdAt as unknown as Date)
                : new Date(),
            senderId: msg.senderId,
            status: msg.status,
            notch: false,
            retracted: false,
            removeButton: false,
            replyButton: false,
            forwarded: false,
            titleColor: '#000',
            ...(msg.contentType === 'file' && {
                data: {
                    uri: msg.fileUrl || '',
                    status: { click: false, loading: 0 },
                    name: msg.fileName,
                },
            }),
        };
    };

    //id: 432,
    //    avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
    //        alt: 'kursat_avatar',
    //            title: 'Kursat',
    //                subtitle: "Why don't we go to the No Way Home movie this weekend ?",
    //                    date: new Date(),
    //                        unread: 3,

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
                                        status={item.position === 'right' ? item.status : undefined}
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