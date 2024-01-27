import axios from "axios";
import findata from "../data/cheqd-data";

const pretext = findata.map((fd) => fd.join("\n")).join("\n");
console.log(pretext);

class MessageParser {
  constructor(actionProvider, state, createChatBotMessage) {
    this.actionProvider = actionProvider;
    this.state = state;
    this.createChatBotMessage = createChatBotMessage;
  }

  async parse(incomingMessage) {
    try {
      const { answer, followUpQuestions } = await this.getReply(
        incomingMessage
      );
      // Send the reply using the actionProvider
      this.actionProvider.sendBotResponse(answer);
      this.actionProvider.sendSuggestions(followUpQuestions, this);
    } catch (ex) {
      this.actionProvider.sendBotResponse(
        "Oops. Something went wrong. Please try again."
      );
      this.actionProvider.sendSuggestions([incomingMessage], this);
    }
  }

  async getReply(userMessage) {
    const { data: resp } = await axios.post(
      "/chat",
      {
        company_name: "THETA ONE",
        pretext: pretext,
        session_id: this.state["session_id"] || "",
        question: userMessage,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(resp);
    this.state.sessionId = resp.session_id;
    return resp;
  }
}

export default MessageParser;
