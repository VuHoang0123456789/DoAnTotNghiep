import { createSlice } from '@reduxjs/toolkit';

export const UserObjectSlice = createSlice({
    name: 'UserObject',
    initialState: '',
    reducers: {
        setState: (state, actions) => {
            state = actions.payload;
            return state;
        },
    },
});

export const { setState } = UserObjectSlice.actions;

export const selectUserObject = (state) => state.UserObject;

export default UserObjectSlice.reducer;
