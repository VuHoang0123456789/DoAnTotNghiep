import { createSlice } from '@reduxjs/toolkit';

export const Account = createSlice({
    name: 'Account',
    initialState: '',
    reducers: {
        setAccount: (state, actions) => {
            state = actions.payload;
            return state;
        },
    },
});

export const { setAccount } = Account.actions;

export const selectAccount = (state) => state.Account;

export default Account.reducer;
