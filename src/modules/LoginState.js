import { createAction, handleActions } from 'redux-actions';

/*
    Login 상태를 위한 redux
*/

const UPDATE_Login = 'LoginState/UPDATE_Login';
const UPDATE_Logout = 'LoginState/UPDATE_Logout';

export const updateLogin = createAction(UPDATE_Login, item => item);
export const updateLogout = createAction(UPDATE_Logout, item => item);

const initialState = {
    login: false,
    user: {name: '', imgURL: ''},
}

const updateLoginState = handleActions(
    {
        [UPDATE_Login]: (state, action) => (
            {
                ...state,
                login: true,
                user: action.payload,
            }
        ),

        [UPDATE_Logout]: (state, action) => (
            {
                ...state,
                login: false,
                user: action.payload,
            }
        ),
    },

    initialState,
)

export default updateLoginState;