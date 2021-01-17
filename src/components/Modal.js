import { useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResult } from '../modules/ModalResult';
import '../style/App.scss';

function Modal() {

    const {open, head, body, callback} = useSelector(state => state.setModal);
    const dispatch = useDispatch();

    // ok 버튼 누르면 result를 true로 하고 callback 실행
    const clickOk = useCallback(() => {
        callback();
        dispatch(setResult(true));
    }, [dispatch, callback]);

    // cancel 버튼 누르면 result false로
    const clickCancel = useCallback(() => {
        dispatch(setResult(false));
    }, [dispatch]);

    const renderModal = useCallback(() => {
        return (<div className='ModalBox'>
                    <div className='BoxHead'>{head}</div>
                    <div className='BoxBody'>{body}</div>
                    <div className='BoxButton'>
                        <button className='Button' onClick={clickOk}>Confirm</button>
                        <button className='Button' onClick={clickCancel}>Cancel</button>
                    </div>
                </div>)
    }, [clickOk, clickCancel, head, body]);

    return (
        <>
            {open ? (<div className='Modal'>
                        {renderModal()}
                       </div>) : null}
        </>
    );
}

export default Modal;