import { useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResult } from '../modules/ModalResult';
import trans from './lang';
import '../style/App.scss';

function Modal() {

    const {open, head, body, buttonNum, callback, cancelCallback, 
           headColor, btn1Color, btn2Color, btn1Text, btn2Text, btnText } = useSelector(state => state.setModal);
    const { lang } = useSelector(state => state.preferenceReducer);
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
                    <div className='BoxHead' style={{backgroundColor: headColor}}>{head}</div>
                    <div className='BoxBody'>{body}</div>
                    <div className={'BoxButton ' + (buttonNum > 1 ? 'DoubleBox' : '')}>
                        <button className='Button' onClick={clickOk} style={{backgroundColor: btn1Color, color: btn1Text}}>
                            {btnText.length >= 1 ? btnText[0] : trans[lang]['ok']}
                        </button>
                        {buttonNum > 1 ? <button className='Button' onClick={clickCancel}
                         style={{backgroundColor: btn2Color, color: btn2Text}}>
                             {btnText.length >= 2 ? btnText[1] : trans[lang]['cancel']}
                         </button> : null}
                    </div>
                </div>)
    }, [clickOk, clickCancel, head, body, buttonNum, headColor, btn1Color, btn2Color, btn1Text, btn2Text, btnText]);

    return (
        <>
            {open ? (<div className='Modal'>
                        {renderModal()}
                       </div>) : null}
        </>
    );
}

export default Modal;