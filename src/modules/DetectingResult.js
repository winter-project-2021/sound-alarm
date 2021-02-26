import { createAction, handleActions } from 'redux-actions';



const SET_OPEN = 'DetectingResult/SET_OPEN';
const SET_RESULT = 'DetectingResult/SET_RESULT';
const SET_CLOSE = 'DetectingResult/SET_CLOSE';
//const GET_SCORE_SERVER = 'DetectingResult/GET_SCORE_SERVER';
//const GET_SCORE_SERVER_SUCCESS = 'DetectingResult/GET_SCORE_SERVER_SUCCESS';
const OP_FAILURE = 'DetectingResult/OP_FAILURE';




export const setResult = createAction(SET_RESULT, value => value);
export const setOpenDetecting = createAction(SET_OPEN, value => value);
export const setCloseDetecting = createAction(SET_CLOSE)
//export const getScoreServer = createAction(GET_SCORE_SERVER, blob => blob);

// Modal 열고 닫기에는 open만 사용되었음. 나머지 수정가능

const initialState = {
    result: false,
    open: false,
    detect: false,
    scoreFromServer: null,
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
            result: action.payload,
            open: true,
            detect: true,
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

export default setDetecting;