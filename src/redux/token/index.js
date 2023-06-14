import { createSlice } from '@reduxjs/toolkit';

export const Token = createSlice({
    name: 'Token',
    initialState: '',
    reducers: {
        setToken: (state, actions) => {
            state = actions.payload;
            return state;
        },
    },
});

export const { setToken } = Token.actions;

export const selectToken = (state) => state.Token;

export default Token.reducer;
