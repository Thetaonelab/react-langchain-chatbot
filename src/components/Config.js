// Config starter code
import { createChatBotMessage } from "react-chatbot-kit";
import BodhiLogo from "../assets/bodhi-ai.png";
import SuggestionCustomMessage from "./SuggestionCustomMessage";

const config = {
  // change this to the message you want to be sent to the user when they first open the chatbot
  initialMessages: [
    createChatBotMessage(`Hey there! I am Bodhi AI. How can I help you ?`),
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
    botAvatar: () => <img src={BodhiLogo} alt="B" className="bodhi-logo"/>,
  },
  customMessages: {
    custom: (props) => <SuggestionCustomMessage {...props} />,
  },
};

export default config;
