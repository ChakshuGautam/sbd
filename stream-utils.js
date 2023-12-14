const timer2 = 10000;
const isOnline = true;

let allmessages = {};

let bufferStore = {};

const setBuffer = (key, text, sentenceCount) => {
    bufferStore[key] = { text, sentenceCount };
};

const getBuffer = (key) => {
    return bufferStore[key];
};

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const translate = async (
    text,
    index
) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ text: `${text} translated ${index}`, index });
        }, randomIntFromInterval(100, 1000));
    });
};

const setMessageByMessageID = (messageID, msg, state) => {
    allmessages[messageID] = {
        message: msg,
        state: state,
    };
};

const getMessagesByMessageID = (messageID) => {
    if (messageID in allmessages) {
        console.log("Found older message");
        return allmessages[messageID];
    } else {
        console.log("Creating new message");
        // Create New
        let intermediateReponse = [];
        for (let i = 0; i < 10; i++) {
            intermediateReponse[i] = null;
        }
        let state = {
            index: -1, //to use 0th index
            intermediateReponse: intermediateReponse,
            totalTextEnglish: "",
            oldTextState: "",
            currentPrint: "",
            newText: "",
        };
        setMessageByMessageID(messageID, null, state);
        return { message: null, state: state };
    }
};

const updateMsgState = async (message, messageID) => {
    // slice and then pass
    console.log(message);
    message.state.totalTextEnglish = message.message;
    message.state.newText = message.state.totalTextEnglish.slice(
        message.state.oldTextState.length + 1,
        message.state.totalTextEnglish.length
    );

    if (message.state.oldTextState === "")
        message.state.newText = message.message;

    message.state.oldTextState = message.message;

    // console.log(message.state);
    const ir = await translate(message.state.newText, message.state.index);
    message.state.intermediateReponse[ir.index] = ir;

    setMessageByMessageID(messageID, message.message, message.state);

    let currentPrint = "";
    for (let i = 0; i < message.state.intermediateReponse.length; i++) {
        if (message.state.intermediateReponse[i] !== null) {
            currentPrint += message.state.intermediateReponse[i].text;
        } else {
            break;
        }
    }
    message.state.currentPrint = currentPrint;
    setMessageByMessageID(messageID, message.message, message.state);

    console.log(message.state.currentPrint);
    console.log("\n");
};

const manageStreamMessage = async (msg) => {
    // sync
    let message = getMessagesByMessageID(msg.content.id);
    let index = message.state.index + 1;
    // sync
    setMessageByMessageID(msg.content.id, msg, {
        ...message.state,
        index: index,
    });

    message = getMessagesByMessageID(msg.content.id);
    await updateMsgState(message, msg.content.id);
};

// Test code

let messages = [
    "AI:",
    "AI: I",
    "AI: I'm",
    "AI: I'm sorry",
    "AI: I'm sorry,",
    "AI: I'm sorry, but",
    "AI: I'm sorry, but as",
    "AI: I'm sorry, but as an",
    "AI: I'm sorry, but as an AI",
    "AI: I'm sorry, but as an AI chat",
    "AI: I'm sorry, but as an AI chatbot",
    "AI: I'm sorry, but as an AI chatbot,",
    "AI: I'm sorry, but as an AI chatbot, I",
    "AI: I'm sorry, but as an AI chatbot, I don",
    "AI: I'm sorry, but as an AI chatbot, I don't",
    "AI: I'm sorry, but as an AI chatbot, I don't have",
    "AI: I'm sorry, but as an AI chatbot, I don't have access",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information.",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore,",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name.",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I can",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I can help",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I can help you",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I can help you with",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I can help you with?",
    "AI: I'm sorry, but as an AI chatbot, I don't have access to personal information. Therefore, I am unable to know your name. Is there anything else I can help you with?",
];

const socketMessages = [];

for (const msg of messages) {
    socketMessages.push({ id: "abcd", msg_type: "text", title: msg });
}

const simulateStream = () => {
    for (let i = 0; i < socketMessages.length; i++) {
        setTimeout(processStream, i * 50, socketMessages[i]);
    }
};

const getSentenceCount = (message) => {
    return message.split(".").length;
};

const processStream = async (message) => {
    let olderData = getBuffer(message.id) || {};
    if ("text" in olderData) {
        let currentSentenceCount = getSentenceCount(message.title);
        setBuffer(message.id, message.title, currentSentenceCount);

        if (currentSentenceCount > olderData.sentenceCount) {
            for (let i = 0; i < message.title.length; i++) {
                //When there is a new sentence. Send everthing.
                if (message.title[i] === ".") {
                    const msg = {
                        content: {
                            id: "abcd",
                            msg_type: "text",
                            title: message.title.slice(0, i),
                            timeTaken: 1000,
                        },
                    };
                    await manageStreamMessage(msg);
                }
            }
        }
    } else {
        setBuffer(message.id, message.title, 0);
    }
};

simulateStream();
