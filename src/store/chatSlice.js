import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import runChat from '../config/gemini';

// Async thunk for sending chat messages
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (prompt, { getState }) => {
    const response = await runChat(prompt);
    return response;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    input: '',
    recentPrompt: '',
    prevPrompts: [],
    showResult: false,
    loading: false,
    resultData: '',
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setRecentPrompt: (state, action) => {
      state.recentPrompt = action.payload;
    },
    setPrevPrompts: (state, action) => {
      state.prevPrompts = action.payload;
    },
    setShowResult: (state, action) => {
      state.showResult = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResultData: (state, action) => {
      state.resultData = action.payload;
    },
    newChat: (state) => {
      state.loading = false;
      state.showResult = false;
      state.resultData = '';
    },
    addToPrevPrompts: (state, action) => {
      state.prevPrompts.push(action.payload);
    },
    updateResultData: (state, action) => {
      state.resultData += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.showResult = true;
        state.resultData = '';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Process the response similar to the original Context logic
        let response = action.payload;
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
        state.resultData = newResponse2;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setInput,
  setRecentPrompt,
  setPrevPrompts,
  setShowResult,
  setLoading,
  setResultData,
  newChat,
  addToPrevPrompts,
  updateResultData,
} = chatSlice.actions;

export default chatSlice.reducer; 