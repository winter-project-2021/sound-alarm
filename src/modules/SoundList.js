import { createAction, handleActions } from 'redux-actions';

/*
    설정한 소리 파일 리스트를 위한 redux 모듈
*/

// 각각 추가, 삭제, 이름 변경에 대한 action type
const ADD_ITEM = 'SoundList/ADD_ITEM';
const REMOVE_ITEM = 'SoundList/REMOVE_ITEM';
const UPDATE_ITEM = 'SoundList/UPDATE_ITEM';

// 각 action type에 대한 action 생성
export const addItem = createAction(ADD_ITEM, name => name);
export const removeItem = createAction(REMOVE_ITEM, id => id);
export const updateItem = createAction(UPDATE_ITEM, item => item);

// 초기 상태
const initialState = {
    soundList: [{id: 1, name: '초인종'}, {id: 2, name: '노크'}, {id:3 , name: '전화'}],
    soundNextId: 4,
}

// action을 위한 reducer
const updateSoundList = handleActions(
    {
        [ADD_ITEM]: (state, action) => {
            // name을 추가하면 id값을 증가시키고 list에 추가
            const item = {
                id: state.soundNextId,
                name: action.payload,
            }

            return {
                ...state,
                soundNextId: state.soundNextId + 1,
                soundList: state.soundList.concat(item),
            }

        },

        [REMOVE_ITEM]: (state, action) => (
            // 해당 id의 원소 삭제
            {
                ...state,
                soundList: state.soundList.filter(item => item.id !== action.payload),
            }
        ),

        [UPDATE_ITEM]: (state, action) => (
            // 해당 item의 id값에 해당하는 name을 변경
            {
                ...state,
                soundList: state.soundList.map(item => item.id === action.payload.id ?
                                               {...item, name: action.payload.name} : item),
            }
        ),
    },

    initialState,
)

export default updateSoundList;