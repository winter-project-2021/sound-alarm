import { createAction, handleActions } from 'redux-actions';
import createRequestSaga from './sagaTemplate';
import { getScore } from './api';
import { takeLatest } from 'redux-saga/effects';

const SET_OPEN = 'SensitivityResult/SET_OPEN';
const SET_RESULT = 'SensitivityResult/SET_RESULT';
const GET_SCORE_SERVER = 'SensitivityResult/GET_SCORE_SERVER';
const GET_SCORE_SERVER_SUCCESS = 'SensitivityResult/GET_SCORE_SERVER_SUCCESS';
const OP_FAILURE = 'SensitivityResult/FAILURE';

export const setResult = createAction(SET_RESULT, value => value);
export const setOpenSensitivity = createAction(SET_OPEN, value => value);
export const getScoreServer = createAction(GET_SCORE_SERVER, blob => blob);

const getScoreServerSaga = createRequestSaga('SensitivityResult', GET_SCORE_SERVER, getScore);

export function* sensitivitySaga() {
    yield takeLatest(GET_SCORE_SERVER, getScoreServerSaga);
}

const initialState = {
    result: false,
    id: 0,
    score: 60,
    name: '',
    open: false,
    click: false,
    scoreFromServer: null,
    error: false,
}

const setSensitivity = handleActions(
    {
        [SET_OPEN]: (state, action) => ({
            ...state,
            id: action.payload.id,
            score: action.payload.score,
            open: true,
            click: false,
            name: action.payload.name,
            error: false,
        }),

        [SET_RESULT]: (state, action) => ({
            ...state,
            result: action.payload,
            open: false,
            click: true,
            error: false,
        }),

        [GET_SCORE_SERVER_SUCCESS]: (state, action) => ({
            ...state,
            scoreFromServer: action.payload.score,
            error: false,
        }),

        [OP_FAILURE]: (state, action) => ({
            ...state,
            ...action.payload,
            error: true,
        }),
    },

    initialState,
);

export default setSensitivity;