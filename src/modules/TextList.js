import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga from './sagaTemplate';
import { addTextItem, removeTextItem, updateTextItem } from './api';
/*
    설정한 text 파일 리스트를 위한 redux 모듈
*/

// 각각 추가, 삭제, 이름 변경에 대한 action type
const ADD_ITEM = 'TextList/ADD_ITEM';
const REMOVE_ITEM = 'TextList/REMOVE_ITEM';
const UPDATE_ITEM = 'TextList/UPDATE_ITEM';

// 각각의 요청이 성공했을 경우
const ADD_ITEM_SUCCESS = 'TextList/ADD_ITEM_SUCCESS';
const REMOVE_ITEM_SUCCESS = 'TextList/REMOVE_ITEM_SUCCESS';
const UPDATE_ITEM_SUCCESS = 'TextList/UPDATE_ITEM_SUCCESS';

// 불러온 값 할당
const SET_LIST = 'TextList/SET_LIST';
// 작업에 실패했을 경우
const OP_FAILURE = 'TextList/FAILURE';

// 각 action type에 대한 action 생성
export const addItem = createAction(ADD_ITEM, item => item);
export const removeItem = createAction(REMOVE_ITEM, id => id);
export const updateItem = createAction(UPDATE_ITEM, item => item);
export const setTextList = createAction(SET_LIST, list => list);
//export const operationFailed = createAction(OP_FAILURE, e => e);

// 비동기 미들웨어 추가
const addItemSaga = createRequestSaga('TextList', ADD_ITEM, addTextItem);
const removeItemSaga = createRequestSaga('TextList', REMOVE_ITEM, removeTextItem);
const updateItemSaga = createRequestSaga('TextList', UPDATE_ITEM, updateTextItem);

// workers
export function* textSaga() { 
    yield takeLatest(ADD_ITEM, addItemSaga);
    yield takeLatest(REMOVE_ITEM, removeItemSaga);
    yield takeLatest(UPDATE_ITEM, updateItemSaga);
}

// 초기 상태
const initialState = {
    textList: [],
    error: false,
}

// action을 위한 reducer
const updateTextList = handleActions(
    {
        [ADD_ITEM_SUCCESS]: (state, action) => {
            // name을 추가하면 id값을 증가시키고 list에 추가
            const item = {
                id: action.payload._id,
                text: action.payload.text,
            }

            return {
                ...state,
                textList: state.textList.concat(item),
                error: false,
            }

        },

        [REMOVE_ITEM_SUCCESS]: (state, action) => (
            // 해당 id의 원소 삭제
            {
                ...state,
                textList: state.textList.filter(item => item.id !== action.payload.textid),
                error: false,
            }
        ),

        [UPDATE_ITEM_SUCCESS]: (state, action) => (
            // 해당 item의 id값에 해당하는 name을 변경
            {
                ...state,
                textList: state.textList.map(item => item.id === action.payload.textid ?
                                               {...item, text: action.payload.text} : item),
                error: false,
            }
        ),

        // 맨 처음 로그인 시 통째로 받아올 때
        [SET_LIST]: (state, action) => ({
            textList: action.payload,
            error: false,
        }),

        // 서버 요청이 실패했을 경우
        [OP_FAILURE]: (state, action) => ({
            ...state,
            ...action.payload,
            error: true,
        })

    },

    initialState,
)

export default updateTextList;