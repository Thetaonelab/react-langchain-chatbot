import React from "react";
import pdfIcon from "../assets/pdf-icon.png";

const SuggestionImageMessage = (props) => {
  console.log("SuggestionCustomMessage props", props);
  const {
    actionProvider,
    payload: { text },
  } = props;
  return (
    <div className="image-message-wrapper">
      <div className="image-message">
        <img src={pdfIcon} alt="pdf-icon" style={{width: 40, height: 40}}/>
        <div>{text}</div>
      </div>
    </div>
  );
};

export default SuggestionImageMessage;
