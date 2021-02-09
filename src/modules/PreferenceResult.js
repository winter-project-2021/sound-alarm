import { takeLatest } from 'redux-saga/effects';
import { createAction, handleActions } from 'redux-actions';
import createRequestSaga from './sagaTemplate';
import { updateSetting } from './api';

// 설정값 세팅을 위한 액션
const SET_PREFERENCE = 'PreferenceResult/SET_PREFERENCE';

// 서버 통신 관련 action
const POST_PREFERENCE = 'PreferenceResult/POST_PREFERENCE';
const POST_PREFERENCE_SUCCESS = 'PreferenceResult/POST_PREFERENCE_SUCCESS';
const POST_FAILURE = 'PreferenceResult/FAILURE';

export const setPreference = createAction(SET_PREFERENCE, state => state);
export const postPreference = createAction(POST_PREFERENCE, state => state);

const postPreferenceSaga = createRequestSaga('PreferenceResult', POST_PREFERENCE, updateSetting);

export function* preferenceSaga() {
    yield takeLatest(POST_PREFERENCE, postPreferenceSaga);
}

const initialState = {
    sound: true,
    push: false,
    lang: 'ko',
    volume: 50,
    bell: '0',
    error: false,
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
            error: false,
        }),

        [POST_PREFERENCE_SUCCESS]: (state, action) => ({
            ...state,
            sound: action.payload.sound,
            push: action.payload.push,
            lang: action.payload.lang,
            volume: action.payload.volume,
            bell: action.payload.bell,
            error: false,
        }),

        [POST_FAILURE]: (state, action) => ({
            ...state,
            ...action.payload,
            error: true,
        }),
    },

    initialState,
);

export default preferenceReducer;