import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga from './sagaTemplate';
import { addSoundItem, removeSoundItem, updateSoundItem , updateSoundSensitivity} from './api';

/*
    설정한 소리 파일 리스트를 위한 redux 모듈
*/

// 각각 추가, 삭제, 이름 변경에 대한 action type
const ADD_ITEM = 'SoundList/ADD_ITEM';
const REMOVE_ITEM = 'SoundList/REMOVE_ITEM';
const UPDATE_ITEM = 'SoundList/UPDATE_ITEM';
const UPDATE_SENSITIVITY = 'SoundList/UPDATE_SENSITIVITY';

// 각각의 요청이 성공했을 경우
const ADD_ITEM_SUCCESS = 'SoundList/ADD_ITEM_SUCCESS';
const REMOVE_ITEM_SUCCESS = 'SoundList/REMOVE_ITEM_SUCCESS';
const UPDATE_ITEM_SUCCESS = 'SoundList/UPDATE_ITEM_SUCCESS';
const UPDATE_SENSITIVITY_SUCCESS = 'SoundList/UPDATE_SENSITIVITY_SUCCESS';

// 불러온 값 할당
const SET_LIST = 'SoundList/SET_LIST';
// 작업에 실패했을 경우
const OP_FAILURE = 'SoundList/FAILURE';

// 각 action type에 대한 action 생성
export const addItem = createAction(ADD_ITEM, item => item);
export const removeItem = createAction(REMOVE_ITEM, id => id);
export const updateItem = createAction(UPDATE_ITEM, item => item);
export const setList = createAction(SET_LIST, list => list);
//export const operationFailed = createAction(OP_FAILURE, e => e);
export const updateSensitivity = createAction(UPDATE_SENSITIVITY, sens => sens);

// 비동기 미들웨어 추가
const addItemSaga = createRequestSaga('SoundList', ADD_ITEM, addSoundItem);
const removeItemSaga = createRequestSaga('SoundList', REMOVE_ITEM, removeSoundItem);
const updateItemSaga = createRequestSaga('SoundList', UPDATE_ITEM, updateSoundItem);
const updateSensitivitySaga = createRequestSaga('SoundList', UPDATE_SENSITIVITY, updateSoundSensitivity);

// workers
export function* soundSaga() { 
    yield takeLatest(ADD_ITEM, addItemSaga);
    yield takeLatest(REMOVE_ITEM, removeItemSaga);
    yield takeLatest(UPDATE_ITEM, updateItemSaga);
    yield takeLatest(UPDATE_SENSITIVITY, updateSensitivitySaga);
}

// 초기 상태
const initialState = {
    soundList: [],
    // 원래는 서버에서 받아온 id를 넣어줘야되는데
    // 지금 클라에서 테스트하기 위한 용도의 변수값
    error: false, 
}

// action을 위한 reducer
// 각 요청을 성공했을 경우 수행으로 변경해야함
// ADD_ITEM => ADD_ITEM_SUCCESS로, 지금은 서버 개발전 테스트를 위해 보류
const updateSoundList = handleActions(
    {
        [ADD_ITEM_SUCCESS]: (state, action) => {
            
            // name을 추가하면 id값을 증가시키고 list에 추가
            const item = {
                id: action.payload._id,
                name: action.payload.name,
                blob: JSON.stringify(Array.from(new Uint8Array(action.payload.buffer.data))),
                score: 60,
            }

            return {
                ...state,
                soundList: state.soundList.concat(item),
                error: false,
            }

        },

        [REMOVE_ITEM_SUCCESS]: (state, action) => (
            // 해당 id의 원소 삭제
            {
                ...state,
                soundList: state.soundList.filter(item => item.id !== action.payload.audioid),
                error: false,
            }
        ),

        [UPDATE_ITEM_SUCCESS]: (state, action) => (
            // 해당 item의 id값에 해당하는 name을 변경
            {
                ...state,
                soundList: state.soundList.map(item => item.id === action.payload.audioid ?
                                               {...item, name: action.payload.name} : item),
                error: false,
            }
        ),
        
        [UPDATE_SENSITIVITY_SUCCESS]: (state, action) => ({
            ...state,
            soundList: state.soundList.map(item => item.id === action.payload.audioid ?
                                               {...item, score: action.payload.sensitivity} : item),
            error: false,
        }),

        // 맨 처음 로그인 시 통째로 받아올 때
        [SET_LIST]: (state, action) => ({
            soundList: action.payload,
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

export default updateSoundList;