import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${USER_API_END_POINT}/chat/messages`, {
        withCredentials: true,
      });

      return response.data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load messages.");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [], loading: false, error: null },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);

      state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },
    setMessages: (state, action) => {
      state.messages = action.payload.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
