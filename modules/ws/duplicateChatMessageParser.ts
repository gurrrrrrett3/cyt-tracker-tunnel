import ChatMessage from "./chatMessage";

export default class DuplicateChatMessageParser {
  public recentMessages: ChatMessage[] = [];

  public addMessage(message: ChatMessage) {
    if (this.isDuplicate(message)) return;

    this.recentMessages.push(message);

    if (this.recentMessages.length > 100) {
      this.recentMessages.shift();
    }

    return this.parseNonPublicInfo(message);
  }

  public isDuplicate(message: ChatMessage) {
    return this.recentMessages.find(
      (msg) => msg.content === message.content && message.timestamp - msg.timestamp < 2000
    );
  }

  public parseNonPublicInfo(message: ChatMessage): {
    public: boolean;
    channelType: string;
    author: string;
    content: string;
    sentBy: string;
    timestamp: number;
    otherData: {
      [key: string]: any;
    };
  } {
    let returnInfo = {
      public: false,
      channelType: "Unknown",
      author: "Unknown",
      content: message.content,
      sentBy: "Unknown",
      timestamp: message.timestamp,
      otherData: {},
    };

    // messages sent by us

    if (message.type == "outgoingPrivateMessage" || message.type == "outgoingChatMessage") {
      returnInfo.public = false;
      returnInfo.channelType = "System Message";
      returnInfo.author = "System";
      returnInfo.sentBy = "System";

      return returnInfo;
    }

    /*

    FILTER OUT NON-PUBLIC MESSAGES
    TYPES

    - Private Messages
    - Town Chat
    - Nation Chat
    - Local Chat
    - Staff Chat
    - Party Chat

    FILTER OUT NON CHAT MESSAGES
    TYPES

    - System Messages
    - Towny Messages
    - Server Messages
    - MCMMO Level Up Messages
    - Slimefun Messages
    - Blank lines
    - So much fucking more

    */

    const regex = {
      // Private Messages, we don't want to send these to the bot at all costs, if it matches any of these, it's a private message
      privateMessage: /^PM.*$/g,
      townChat: /^Town .*$/g,
      nationChat: /^Nation .*$/g,
      staffChat: /^SC .*$/g,
      localChat: /^local .*$/g,
      partyChat: / /g, // TODO: Add regex for party chat

      // public messages
      globalMessages:
        /(?<prefix1>\[.*\])(?<prefix2>\[.*\])? (?<author>[A-Za-z0-9_§]{3,24}) » (?<message>.*)$/g,
    };

    // Private Messages

    if (regex.privateMessage.test(message.content)) {
      returnInfo.public = false;
      returnInfo.channelType = "Private Message";
      returnInfo.author = "Private Message";
      returnInfo.sentBy = "Private Message";
      returnInfo.content = "Private Message";

      return returnInfo;
    }

    // Town Chat

    if (regex.townChat.test(message.content)) {
      returnInfo.public = false;
      returnInfo.channelType = "Town Chat";
      returnInfo.author = "Town Chat";
      returnInfo.sentBy = "Town Chat";
      returnInfo.content = "Town Chat";

      return returnInfo;
    }

    // Nation Chat

    if (regex.nationChat.test(message.content)) {
      returnInfo.public = false;
      returnInfo.channelType = "Nation Chat";
      returnInfo.author = "Nation Chat";
      returnInfo.sentBy = "Nation Chat";
      returnInfo.content = "Nation Chat";

      return returnInfo;
    }

    // Staff Chat

    if (regex.staffChat.test(message.content)) {
      returnInfo.public = false;
      returnInfo.channelType = "Staff Chat";
      returnInfo.author = "Staff Chat";
      returnInfo.sentBy = "Staff Chat";
      returnInfo.content = "Staff Chat";

      return returnInfo;
    }

    // Local Chat

    if (regex.localChat.test(message.content)) {
      returnInfo.public = false;
      returnInfo.channelType = "Local Chat";
      returnInfo.author = "Local Chat";
      returnInfo.sentBy = "Local Chat";
      returnInfo.content = "Local Chat";

      return returnInfo;
    }

    // Party Chat

    if (regex.partyChat.test(message.content)) {
      returnInfo.public = false;
      returnInfo.channelType = "Party Chat";
      returnInfo.author = "Party Chat";
      returnInfo.sentBy = "Party Chat";
      returnInfo.content = "Party Chat";

      return returnInfo;
    }

    // Global Messages

    if (regex.globalMessages.test(message.content)) {
      const match = regex.globalMessages.exec(message.content);

      if (match && match.groups) {
        const { groups } = match;

        returnInfo.public = true;
        returnInfo.channelType = "Global Chat";
        returnInfo.author = groups.author;
        returnInfo.content = groups.message;
        returnInfo.otherData = {
          tag: groups.prefix2 ? groups.prefix1 : "No Tag",
          rank: groups.prefix2 ? groups.prefix2 : groups.prefix1,
        };

        return returnInfo;
      }

      returnInfo.public = true;
      returnInfo.channelType = "Global Chat";
      returnInfo.author = "Unknown";
      returnInfo.content = "Unknown";

      return returnInfo;
    }

    return returnInfo;
  }
}
