import { ChatList, MessageBox, SystemMessage, IMessageBoxProps, I } from "react-chat-elements"
import { Input } from 'react-chat-elements'

import './Messager.styles.css'
import 'react-chat-elements/dist/main.css';
import { Row, Col, List } from "antd";
import { useEffect, useRef, useState } from "react";
import ChatComposer from "./Input";
interface ChatMessage {
    // ensure `id` and `text` are present
    id: string;
    text: string;
    position: string;
    type: string,

    date: Date,
    title: string,
    status: string,
    notch: boolean,
    retracted: boolean,
    removeButton: boolean,
    replyButton: boolean,
    forwarded: boolean,
    titleColor: string,
};
const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const listRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = listRef.current;
        if (el) {
            // Option A: scroll the container
            el.scrollTop = el.scrollHeight;                                                     // :contentReference[oaicite:0]{index=0}
            // Option B: or scroll the last child into view:
            // el.lastElementChild?.scrollIntoView({ behavior: 'smooth' });                     // :contentReference[oaicite:1]{index=1}
        }
    }, [messages]);
    const handleSend = (msg: string, file?: File) => {
        const newId = (messages.length + 1).toString();
        if (file) {
            const fileUrl = URL.createObjectURL(file);             // createObjectURL API 
            setMessages([
                ...messages,
                {
                    id: newId,
                    position: 'right',
                    type: 'text',
                    text: msg,
                    date: new Date(),
                    title: 'You',
                    status: 'sent',
                    notch: false,
                    retracted: false,
                    removeButton: false,
                    replyButton: false,
                    forwarded: false,
                    titleColor: '#000',
                    // file-specific props:


                    // Optional: Use `fileUrl` to enable download link in a custom renderer
                    // you could extend MessageBoxProps to include it
                },
            ]);
        } else {
            setMessages([
                ...messages,
                {
                    id: newId,
                    position: 'right',
                    type: 'text',
                    text: msg,
                    date: new Date(),
                    title: 'You',
                    status: 'read',
                    notch: false,
                    retracted: false,
                    removeButton: false,
                    replyButton: false,
                    forwarded: false,
                    titleColor: '#000',
                },
            ]);
        }
    };
    return (
        <Row>
            <Col lg={8} xl={8}>
                <ChatList
                    id="helloThere"
                    lazyLoadingImage="www.com"
                    className='chat-list'
                    dataSource={[
                        {
                            id: "hi",
                            avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                            alt: 'kursat_avatar',
                            title: 'Kursat',
                            subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                            date: new Date(),
                            unread: 3,
                        },
                        {
                            id: "hi",
                            avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                            alt: 'kursat_avatar',
                            title: 'Kursat',
                            subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                            date: new Date(),
                            unread: 3,
                        },
                        {
                            id: "hi",
                            avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                            alt: 'kursat_avatar',
                            title: 'Kursat',
                            subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                            date: new Date(),
                            unread: 3,
                        },
                        {
                            id: "hi",
                            avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                            alt: 'kursat_avatar',
                            title: 'Kursat',
                            subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                            date: new Date(),
                            unread: 3,
                        },
                        {
                            id: "hi",
                            avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                            alt: 'kursat_avatar',
                            title: 'Kursat',
                            subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                            date: new Date(),
                            unread: 3,
                        },
                        {
                            id: "hi",
                            avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                            alt: 'kursat_avatar',
                            title: 'Kursat',
                            subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                            date: new Date(),
                            unread: 3,
                        }

                    ]} /></Col>
            <Col style={{ width: "100%" }} lg={16} xl={16}>
                <div
                    ref={listRef}
                    style={{
                        height: "75vh",
                        overflowY: 'auto',
                        border: '1px solid #eee',
                        padding: 8,
                        //position:"relative"
                    }}
                >
                    <MessageBox

                        className="custom-message-box"
                        position={"right"}
                        type={"text"}
                        title={"Me"}
                        text="Here is a text type message box"
                        id="unique-id-123"
                        focus={false}
                        date={new Date()}
                        status="waiting"
                        titleColor="#000000"
                        forwarded={false}
                        replyButton={false}
                        removeButton={false}
                        onClick={() => { }}
                        onOpen={() => { }}

                        // Add these required props
                        notch={false}       // Controls message bubble notch visibility
                        retracted={false}   // Marks message as deleted/retracted
                    />
                    <br></br>
                    <MessageBox

                        notch={false}        // Required boolean
                        retracted={false}    // Required boolean
                        status="received"
                        date={new Date()}
                        titleColor="#000000"
                        forwarded={false}
                        id="audio-message-3"
                        focus={false}
                        replyButton={false}  // Required boolean
                        removeButton={false} // Required boolean
                        reply={{
                            title: "Emre",
                            titleColor: "#8717ae",
                            borderLeft: "4px solid purple",
                            message: "Nice to meet you",

                        }}
                        position={"left"}
                        type={"text"}
                        title="Esra"
                        text={
                            "Nice to meet you too !"
                        }
                    />
                    <br></br>
                    <MessageBox

                        position={"right"}
                        type={"audio"}
                        title={"Me"}
                        id="audio-message-1"  // Required unique identifier
                        text=""  // Optional subtitle
                        focus={false}        // Required boolean
                        date={new Date()}    // Required Date object
                        status="sent"
                        titleColor="#000000" // Required color string
                        forwarded={false}    // Required boolean
                        replyButton={false}  // Required boolean
                        removeButton={false} // Required boolean
                        notch={false}        // Required boolean
                        retracted={false}    // Required boolean

                        // Required audio data
                        data={{

                            audioURL: "https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3",
                            duration: 30, // Required duration in seconds

                        }}

                        // Optional but recommended
                        onClick={() => { }}
                        onOpen={() => { }}
                    />
                    <br></br>
                    <MessageBox

                        notch={false}        // Required boolean
                        retracted={false}    // Required boolean
                        status="read"
                        title={"Emre"}
                        forwarded={false}
                        id="audio-message-3"  // Required unique identifier
                        date={new Date()}
                        focus={false}        // Required boolean
                        position={"left"}
                        replyButton={false}  // Required boolean
                        removeButton={false} // Required boolean
                        type={"file"}
                        titleColor="#000000"
                        text="Sample PDF"
                        data={{
                            uri: "https://www.sample-videos.com/pdf/Sample-pdf-5mb.pdf",
                            status: {
                                click: false,
                                loading: 0,
                            },
                        }}
                    />
                    <br></br>
                    <MessageBox
                        replyButton={false}  // Required boolean
                        removeButton={false} // Required boolean
                        notch={false}        // Required boolean
                        retracted={false}    // Required boolean
                        status="read"
                        title={"Me"}
                        forwarded={false}
                        id="audio-message-s3"  // Required unique identifier
                        date={new Date()}
                        focus={false}        // Required boolean
                        position="right"
                        titleColor="#000000"
                        type="meetingLink"
                        text="Click to join the meeting"
                    />
                    <br></br>
                 
                    <List
                        split={false}
                        locale={{ emptyText: <SystemMessage text="End of Conversation"/> }}  
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
                                }}
                            >
                                <MessageBox {...item} />
                            </List.Item>
                        )}

                    />
                    <br></br>
                    <ChatComposer onSend={handleSend} />
                </div>
               
               
              
            </Col>
         
        </Row>
    )
}

export default App;