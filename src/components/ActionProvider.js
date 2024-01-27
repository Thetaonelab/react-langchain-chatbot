import { createClientMessage, createCustomMessage } from "react-chatbot-kit";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  sendUserResponse(message) {
    const clientMessage = createClientMessage(message);
    this.updateChatbotState(clientMessage);
    return clientMessage;
  }

  sendSuggestions(suggestions, mParser) {
    for (const sugg of suggestions) {
      this.updateChatbotState(
        createCustomMessage(sugg, "custom", { payload: { text: sugg, mParser } })
      );
    }
  }

  sendBotResponse(message) {
    const botMessage = this.createChatBotMessage(message);
    this.updateChatbotState(botMessage);
    return botMessage;
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
