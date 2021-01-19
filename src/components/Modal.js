import { useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResult } from '../modules/ModalResult';
import '../style/App.scss';

function Modal() {

    const {open, head, body, buttonNum, callback, cancelCallback} = useSelector(state => state.setModal);
    const dispatch = useDispatch();

    // ok 버튼 누르면 result를 true로 하고 callback 실행
    const clickOk = useCallback(() => {
        callback();
        dispatch(setResult(true));
    }, [dispatch, callback]);

    // cancel 버튼 누르면 result false로
    const clickCancel = useCallback(() => {
        cancelCallback();
        dispatch(setResult(false));
    }, [dispatch, cancelCallback]);

    const renderModal = useCallback(() => {
        return (<div className='ModalBox'>
                    <div className='BoxHead'>{head}</div>
                    <div className='BoxBody'>{body}</div>
                    <div className={'BoxButton ' + (buttonNum > 1 ? 'DoubleBox' : '')}>
                        <button className='Button' onClick={clickOk}>확인</button>
                        {buttonNum > 1 ? <button className='Button' onClick={clickCancel}>취소</button> : null}
                    </div>
                </div>)
    }, [clickOk, clickCancel, head, body, buttonNum]);

    return (
        <>
            {open ? (<div className='Modal'>
                        {renderModal()}
                       </div>) : null}
        </>
    );
}

export default Modal;