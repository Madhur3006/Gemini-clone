import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessage,
  setInput,
  setRecentPrompt,
  addToPrevPrompts,
  updateResultData,
  setResultData,
} from '../store/chatSlice';

export const useChat = () => {
  const dispatch = useDispatch();
  const {
    input,
    recentPrompt,
    prevPrompts,
    showResult,
    loading,
    resultData,
  } = useSelector((state) => state.chat);

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      dispatch(updateResultData(nextWord));
    }, 75 * index);
  };

  const onSent = async (prompt) => {
    let messageToSend;
    if (prompt !== undefined) {
      messageToSend = prompt;
      dispatch(setRecentPrompt(prompt));
    } else {
      dispatch(addToPrevPrompts(input));
      dispatch(setRecentPrompt(input));
      messageToSend = input;
    }

    // Clear result data and start loading
    dispatch(setResultData(''));
    
    try {
      const response = await dispatch(sendMessage(messageToSend)).unwrap();
      
      // Process response for delayed animation
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");
      
      // Clear result data before starting animation
      dispatch(setResultData(''));
      
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      
      // Clear input after sending
      dispatch(setInput(""));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    input,
    setInput: (value) => dispatch(setInput(value)),
    recentPrompt,
    setRecentPrompt: (value) => dispatch(setRecentPrompt(value)),
    prevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
  };
}; 