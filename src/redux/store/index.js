import { configureStore } from '@reduxjs/toolkit';
import UserObjectReducer from '../userobject';
import AccountReducer from '../account';
import TokenReducer from '../token';

export default configureStore({
    reducer: {
        UserObject: UserObjectReducer,
        Account: AccountReducer,
        Token: TokenReducer,
    },
});
