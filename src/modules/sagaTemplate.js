import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from './loading';

export default function createRequestSaga (prefix, type, request) {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${prefix}/FAILURE`;

    return function* (action) {
        // 우선 로딩중에 true를 넘김
        yield put(startLoading(type));
        
        try {
            // request를 이용해서 서버랑 통신
            const response = yield call(request, action.payload);
            // 정상적으로 성공하면 성공한 값을 redux로 넘김
            yield put({
                type: SUCCESS,
                payload: response.data,
            });
        } catch (e){
            // 통신에 실패하여 에러가 나면 error를 리덕스로 넘김
            yield put({
                type: FAILURE,
                payload: e
            });
        }

        // 로딩 종료
        yield put(finishLoading(type));
    }
}