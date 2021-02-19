import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga from './sagaTemplate';
import { addSoundItem, removeSoundItem, updateSoundItem , updateSoundSensitivity} from './api';
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
export const addItem = createAction(ADD_ITEM, name => name);
export const removeItem = createAction(REMOVE_ITEM, id => id);
export const updateItem = createAction(UPDATE_ITEM, item => item);
export const setList = createAction(SET_LIST, list => list);
//export const operationFailed = createAction(OP_FAILURE, e => e);

// 비동기 미들웨어 추가
const addItemSaga = createRequestSaga('TextList', ADD_ITEM, addSoundItem);
const removeItemSaga = createRequestSaga('TextList', REMOVE_ITEM, removeSoundItem);
const updateItemSaga = createRequestSaga('TextList', UPDATE_ITEM, updateSoundItem);

// workers
export function* textSaga() { 
    yield takeLatest(ADD_ITEM, addItemSaga);
    yield takeLatest(REMOVE_ITEM, removeItemSaga);
    yield takeLatest(UPDATE_ITEM, updateItemSaga);
}

// 초기 상태
const initialState = {
    textList: [{id: 1, name: '카톡'}, {id: 2, name: '홍길동'}, {id:3 , name: '김철수'}],
    textNextId: 4,
}

// action을 위한 reducer
const updateTextList = handleActions(
    {
        [ADD_ITEM]: (state, action) => {
            // name을 추가하면 id값을 증가시키고 list에 추가
            const item = {
                id: state.textNextId,
                name: action.payload,
            }

            return {
                ...state,
                textNextId: state.textNextId + 1,
                textList: state.textList.concat(item),
            }

        },

        [REMOVE_ITEM]: (state, action) => (
            // 해당 id의 원소 삭제
            {
                ...state,
                textList: state.textList.filter(item => item.id !== action.payload),
            }
        ),

        [UPDATE_ITEM]: (state, action) => (
            // 해당 item의 id값에 해당하는 name을 변경
            {
                ...state,
                textList: state.textList.map(item => item.id === action.payload.id ?
                                               {...item, name: action.payload.name} : item),
            }
        ),
    },

    initialState,
)

export default updateTextList;