export default class ChatMessage {
    type: "incomingChatMessage" | "outgoingChatMessage" | "outgoingPrivateMessage";
    content: string;
    timestamp: number = Date.now();
    sentBy: string = "Unknown";

    constructor(type: "incomingChatMessage" | "outgoingChatMessage" | "outgoingPrivateMessage", content: string, sentBy: string, timestamp: number) {
        this.type = type;
        this.content = content;
        this.sentBy = sentBy;
        this.timestamp = timestamp;
    }
}