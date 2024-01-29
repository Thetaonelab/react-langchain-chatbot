import React from "react";


const SuggestionCustomMessage = (props) => {
  // console.log("SuggestionImageMessage props", props);
  const {
    actionProvider,
    payload: { text, mParser },
  } = props;
  return (
    <div style={{ width: "100%" }}>
      <div
        className="suggestion"
        onClick={() => {
          actionProvider.sendUserResponse(text);
          mParser.parse(text);
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default SuggestionCustomMessage;
