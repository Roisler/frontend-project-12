import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const channelId = action.payload;
      const restMessages = Object.values(state.entities)
        .filter((message) => message.channelId !== channelId);
      messagesAdapter.setAll(state, restMessages);
    });
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const { actions } = messagesSlice;

export default messagesSlice.reducer;
