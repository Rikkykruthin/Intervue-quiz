import { useState, useEffect, useRef } from "react";
import { Popover, OverlayTrigger, Tab, Nav } from "react-bootstrap";
import Chat from "./Chat";
import io from "socket.io-client";
import "./Chat.css";
import chatIcon from "../../assets/chat.svg";

let apiUrl =
    import.meta.env.VITE_NODE_ENV === "production"
        ? import.meta.env.VITE_API_BASE_URL
        : "http://localhost:3000";

const socket = io(apiUrl);

const ChatPopover = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [participants, setParticipants] = useState([]);
    const chatWindowRef = useRef(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }

        // Don't join room again - the parent page should handle this
        // Just set up chat-specific listeners
        const handleChatMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        const handleParticipantsUpdate = (participantsList) => {
            if (Array.isArray(participantsList)) {
                setParticipants(participantsList);
            }
        };

        socket.on("chatMessage", handleChatMessage);
        socket.on("participantsUpdate", handleParticipantsUpdate);

        return () => {
            socket.off("participantsUpdate", handleParticipantsUpdate);
            socket.off("chatMessage", handleChatMessage);
        };
    }, []);

    const username = sessionStorage.getItem("username");

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = { user: username, text: newMessage };
            socket.emit("chatMessage", message);
            setNewMessage("");
        }
    };

    const handleKickOut = (participantUsername) => {
        socket.emit("kickStudent", { username: participantUsername });
    };

    const participantsTab = (
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {!Array.isArray(participants) || participants.filter(p => p && p.role !== 'teacher').length === 0 ? (
                <div>No students connected</div>
            ) : (
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            {username && username.startsWith("teacher") ? <th>Actions</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {participants
                            .filter(participant => participant && participant.role !== 'teacher') // Only show students
                            .map((participant, index) => (
                            <tr key={participant.username || index}>
                                <td>{participant.displayName || participant.username || 'Unknown'}</td>
                                {username && username.startsWith("teacher") ? (
                                    <td>
                                        <button
                                            style={{ fontSize: "10px", color: "#5767D0" }}
                                            onClick={() => handleKickOut(participant.username)}
                                            className="btn btn-link"
                                            disabled={!participant.username}
                                        >
                                            Kick Out
                                        </button>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const popover = (
        <Popover
            id="chat-popover"
            style={{ width: "400px", height: "400px", fontSize: "12px" }}
        >
            <Popover.Body style={{ height: "100%" }}>
                <Tab.Container defaultActiveKey="chat">
                    <Nav variant="underline">
                        <Nav.Item>
                            <Nav.Link className="tab-item message-form" eventKey="chat">
                                Chat
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className="tab-item" eventKey="participants">
                                Participants
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content className="mt-3">
                        <Tab.Pane eventKey="chat">
                            <Chat
                                messages={messages}
                                newMessage={newMessage}
                                onMessageChange={setNewMessage}
                                onSendMessage={handleSendMessage}
                            />
                        </Tab.Pane>
                        <Tab.Pane eventKey="participants">{participantsTab}</Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger
            trigger="click"
            placement="left"
            overlay={popover}
            rootClose
        >
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    padding: "10px",
                    background: "#7765DA",
                    borderRadius: "100%",
                    cursor: "pointer",
                }}
            >
                <img
                    style={{ width: "30px", height: "30px" }}
                    src={chatIcon}
                    alt="chat icon"
                />
            </div>
        </OverlayTrigger>
    );
};

export default ChatPopover;