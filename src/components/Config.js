// Config starter code
import { createChatBotMessage, createCustomMessage } from "react-chatbot-kit";
import BodhiLogo from "../assets/bodhi-ai.png";
import SuggestionCustomMessage from "./SuggestionCustomMessage";
import SuggestionImageMessage from "./SuggestionImageMessage";
import Header from "./Header";

const config = {
  // change this to the message you want to be sent to the user when they first open the chatbot
  initialMessages: [
    createChatBotMessage(`Hey there! I am Bodhi AI. How can I help you ?`),
    /* createCustomMessage("hello", "imageBox", {
      payload: { text: "Download invoice for Custobridge Private Limite" },
      widget: "imageBox",
    }), */
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#9b51e0",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
  customComponents: {
    botAvatar: () => <img src={BodhiLogo} alt="B" className="bodhi-logo" />,
    header: (props) => <Header  {...props}/>,
  },
  customMessages: {
    custom: (props) => <SuggestionCustomMessage {...props} />,
    imageBox: (props) => <SuggestionImageMessage {...props} />,
  },
};

export default config;
