import { createAction, handleActions } from 'redux-actions';

// 설정값 세팅을 위한 액션
const SET_PREFERENCE = 'PreferenceResult/SET_PREFERENCE';

export const setPreference = createAction(SET_PREFERENCE, state => state);

const initialState = {
    sound: true,
    push: false,
    lang: 'ko',
    volume: 50,
    bell: '0',
};

const preferenceReducer = handleActions(
    {
        [SET_PREFERENCE]: (state, action) => ({
            ...state,
            sound: action.payload.sound,
            push: action.payload.push,
            lang: action.payload.lang,
            volume: action.payload.volume,
            bell: action.payload.bell,
        }),
    },

    initialState,
);

export default preferenceReducer;