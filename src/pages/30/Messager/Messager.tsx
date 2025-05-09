import { useEffect, useRef, useState } from "react";
import { MessageBox, SystemMessage } from "react-chat-elements";
import { List } from "antd";
import { useUser } from "../../../Context/UserContext";

import { subscribeToMessages, updateMessageStatus, sendMessage, Message } from "../../../firebase/firebase";
import ChatComposer from "./Input";
import { Timestamp } from "firebase/firestore";
import { UserProfile, showProfile } from "../../../apiMAG/user";
import { useQuery } from "react-query/types/react/useQuery";
import { QueryClientProvider } from "react-query/types/react/QueryClientProvider";
import { QueryClient } from "react-query/types/core/queryClient";



interface ChatInterfaceProps {
    receiverId: string;
}

interface ChatMessage {
    id: string;
    text: string;
    position: 'left' | 'right';
    type: 'text' | 'file';
    date: Date;
    title: string;
    status: 'waiting' | 'sent' | 'delivered' | 'read';
    notch: boolean;
    retracted: boolean;
    removeButton: boolean;
    replyButton: boolean;
    forwarded: boolean;
    titleColor: string;
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
        queryFn: () => getUserProfile(receiverId),
        enabled: !!receiverId, // Only fetch when receiverId exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 2,
    });
};

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
    const listRef = useRef<HTMLDivElement>(null);
    const { profile, usertype } = useUser();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const currentUserId = localStorage.getItem('userId') ?? '';
    
    const receiverId = currentUserId === '1' ? '8' : '1';
    const receiverProfile = useReceiverProfile(receiverId);

    useEffect(() => {
        if (!currentUserId) return;

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
            } ));
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
        titleColor: '#000'
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
            title: msg.senderId === currentUserId ? 'You' : `Advisor ${profile?.fullname}`,
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

    

    return (
        <div className="chat-container">
            <div ref={listRef} style={{
                height: "75vh",
                overflowY: 'auto',
                padding: 8,
                scrollBehavior: 'smooth'
            }}>
                <List
                    split={false}
                    locale={{ emptyText: <SystemMessage text="Start a conversation" /> }}
                    style={{ width: "100%" }}
                    bordered={false}
                    dataSource={messages}
                    renderItem={(item) => (
                        <List.Item
                            key={item.id}
                            style={{
                                display: 'flex',
                                justifyContent: item.position === 'right'
                                    ? 'flex-end'
                                    : 'flex-start',
                                padding: '8px 0'
                            }}
                        >
                            <MessageBox
                                {...item}
                                notch={item.position === 'right'}
                                retracted={false}
                                onTitleClick={() => {/* Handle profile click */ }}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <ChatComposer
                onSend={handleSend}
                
               
            />
        </div>
    );
};
interface ChatInterfaceWrapperProps {
    receiverId: string;
}
const ChatInterfaceWrapper: React.FC<ChatInterfaceWrapperProps> = ({ receiverId }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ChatInterface receiverId={receiverId} />
        </QueryClientProvider>
    );
};
export default ChatInterfaceWrapper