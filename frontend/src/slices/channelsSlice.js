/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  defaultChannel: null,
});

export const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: (state, { payload }) => {
      channelsAdapter.removeOne(state, payload);
      state.defaultChannel = (state.defaultChannel.id === payload) ? { name: 'general', id: 1 } : state.defaultChannel;
    },
    updateChannel: channelsAdapter.updateOne,
    setDefaultChannel: (state, action) => {
      state.defaultChannel = action.payload;
    },
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export const { actions } = channelsSlice;

export default channelsSlice.reducer;
