import { createAction, handleActions } from 'redux-actions';

/*
    modal 생성 및 결과 적용을 위한 redux
*/ 

const SET_OPEN = 'ModalResult/SET_OPEN';
const SET_RESULT = 'ModalResult/SET_RESULT';

export const setResult = createAction(SET_RESULT, value => value);
export const setOpen = createAction(SET_OPEN, value => value);

const initialState = {
    result: false,
    head: '',
    body: '',
    open: false,
    click: false,
    callback: null,
}

const setModal = handleActions(
    {
        [SET_OPEN]: (state, action) => ({
            ...state,
            head: action.payload.head,
            body: action.payload.body,
            callback: action.payload.callback,
            open: true,
            click: false,
        }),

        [SET_RESULT]: (state, action) => ({
            ...state,
            result: action.payload,
            open: false,
            click: true,
        }),
    },

    initialState,
);

export default setModal;