import { createAction, handleActions } from 'redux-actions';
import createRequestSaga from './sagaTemplate';
import { takeLatest } from 'redux-saga/effects';
import { getMatch } from './api';

const SET_OPEN = 'DetectingResult/SET_OPEN';
const SET_RESULT = 'DetectingResult/SET_RESULT';
const SET_CLOSE = 'DetectingResult/SET_CLOSE';
const GET_MATCH = 'DetectingResult/GET_MATCH';
const GET_MATCH_SUCCESS = 'DetectingResult/GET_MATCH_SUCCESS';
const OP_FAILURE = 'DetectingResult/OP_FAILURE';

export const setResult = createAction(SET_RESULT, value => value);
export const setOpenDetecting = createAction(SET_OPEN, value => value);
export const setCloseDetecting = createAction(SET_CLOSE)
export const getMatchServer = createAction(GET_MATCH, blob => blob);

const getMatchSaga = createRequestSaga('DetectingResult', GET_MATCH, getMatch);

export function* detectingSaga() {
    yield takeLatest(GET_MATCH, getMatchSaga);
}

// Modal 열고 닫기에는 open만 사용되었음. 나머지 수정가능

const initialState = {
    name: '',
    result: false,
    open: false,
    detect: false,
    scoreFromServer: null,
    name: "",
    error: false,
}

const setDetecting = handleActions(
    {
        [SET_OPEN]: (state) => ({
            ...state,
            open: true,
            detect: false,
            error: false,
        }),

        [SET_CLOSE]: (state) => ({
            ...state,
            open: false,
            error: false,
        }),

        [SET_RESULT]: (state, action) => ({
            ...state,
            result: action.payload.match,
            open: true,
            detect: action.payload.match,
            name: action.payload.name,
            error: false,
        }),

        [GET_MATCH_SUCCESS]: (state, action) => ({
            ...state,
            name: action.payload.name,
            detect: action.payload.match,
            name: action.payload.match ? action.payload.name : state.name,
        }),

        [OP_FAILURE]: (state, action) => ({
            ...state,
            ...action.payload,
            error: true,
        }),
    },

    initialState,
);

export default setDetecting;