/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  activeChannelId: null,
});

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
      state.activeChannelId = (state.activeChannelId === payload) ? 1 : state.activeChannelId;
    },
    updateChannel: channelsAdapter.updateOne,
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload;
    },
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const { actions } = channelsSlice;

export default channelsSlice.reducer;
