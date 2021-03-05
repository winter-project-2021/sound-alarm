import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from './loading';

export default function createRequestSaga (prefix, type, request) {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${prefix}/FAILURE`;
    return function* (action) {
        // 우선 로딩중에 true를 넘김
        if(prefix !== 'DetectingResult')
            yield put(startLoading(type));
        
        try {
            // request를 이용해서 서버랑 통신
            const response = yield call(request, action.payload);
            // 정상적으로 성공하면 성공한 값을 redux로 넘김
            //console.log(response);
            if(response.data.result !== 'success'){
                yield put({
                    type: FAILURE,
                    payload: response.data.msg,
                });

                const popup = {
                    head: "Error!",
                    body: response.data,
                    buttonNum: 1,
                    callback: () => {},
                    headColor: '#ff3547',
                    btn1Color: '#f2f3f4',
                    btn2Color: null,
                    btn1Text: '#000000',
                    btn2Text: null,
                };
                
                yield put({
                    type: 'ModalResult/SET_OPEN',
                    payload: popup,
                });
            }
            else {
                
                yield put({
                    type: SUCCESS,
                    payload: response.data,
                });
            }
            
        } catch (e){
            // 통신에 실패하여 에러가 나면 error를 리덕스로 넘김
            yield put({
                type: FAILURE,
                payload: e
            });


        }
        finally {
            // 로딩 종료
            yield put(finishLoading(type));
        }
    }
}