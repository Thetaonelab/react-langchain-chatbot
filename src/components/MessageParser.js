import axios from "axios";
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
    const cheqdJwt = localStorage.getItem("imt__token");
    const existingPretexts = localStorage.getItem("imt__pretexts");
    const ep = JSON.parse(existingPretexts || "{}");
    const pretext = ep[cheqdJwt];

    const cheqdUser = localStorage.getItem("imt__user");
    const { company_name: companyName } = JSON.parse(cheqdUser || "{}");

    if (pretext === undefined || pretext === null)
      return { answer: "Please train the bot first", followUpQuestions: [] };

    console.log();
    const { data: resp } = await axios.post(
      "/chat",
      {
        company_name: companyName,
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
