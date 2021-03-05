import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import { MdDeleteForever, MdModeEdit, MdDone } from "react-icons/md"
import trans from './lang';
import '../style/TextSetting.scss';

function TextListItem(props) {

    const { name, order, clickItem, isClick, updateName, deleteName, setDelete, setUpdate } = props;
    const { lang } = useSelector(state => state.preferenceReducer);
    const dispatch = useDispatch();

    // 항목 수정된 이름
    const [inputName, setInputName] = useState(name);

    // 현재 수정/ 삭제 중 인지
    const [change, setChange] = useState(false);
   
    useEffect(() => {
        // 새롭게 리렌더링 될 때마다 항목의 수정 이름은
        // 본인의 기본 이름과 같도록 세팅 
        setInputName(name);
    }, [name, setInputName]);

    const renderName = useCallback((len) => {
        // 글자 수 len + 3 이상이면 자르고 ... 로 렌더링
        if(name.length < len + 3) return name;
        return name.substring(0, len) + "...";
    }, [name]);

    const deleteItem = useCallback(() => {
        
        // 삭제중임을 명시
        setDelete(true);
        setUpdate(false);
        setChange(false);

        // 팝업 객체
        const popup = {
            head: trans[lang]['delete'][0],
            body: lang === 'ko' ? `${renderName(5)} ${trans[lang]['delete'][1]}` : `${trans[lang]['delete'][1]}${renderName(5)}?`,
            callback: () => deleteName(order),
            headColor: '#ff3547',
            btn1Color: '#ff3547',
            btn2Color: '#f2f3f4',
            btn1Text: '#ffffff',
            btn2Text: '#000000',
            btnText: [trans[lang]['delete'][2], trans[lang]['cancel']],
        };

        // popup open
        dispatch(setOpen(popup));
        
        setDelete(false);
        clickItem(-1);
    }, [deleteName, order, clickItem, setUpdate, setChange, setDelete, dispatch, renderName, lang]);

    const clickUpdate = useCallback(() => {
        // 수정 시작
        setUpdate(true);
        setChange(true);
    }, [setUpdate, setChange]);

    const updateItem = useCallback(() => {
        // 항목 수정 후 초기화
        updateName(order, inputName);
        setInputName(name);
        setUpdate(false);
        setChange(false);
        clickItem(-1);
    }, [updateName, inputName, setUpdate, order, clickItem, setChange, setInputName, name]);

    const changeInput = useCallback((e) => {
        // 항목 이름 수정값 받아오기
        setInputName(e.target.value);
    }, [setInputName]);


    const onClick = useCallback(() => {
        // 이 항목 클릭
        clickItem(order);
    }, [clickItem, order]);

    const renderButton = useCallback(() => {
        // 수정/삭제 버튼 렌더링
        // 수정버튼 클릭 시 아이콘 변경되는 것 적용
        return (<div className='ChangeButton'>
                    {change ? <MdDone className='Button' onClick={updateItem}/> :
                    <MdModeEdit className='Button' onClick={clickUpdate}/>}
                    <MdDeleteForever className='Button' onClick={deleteItem}/>
                </div>)
    }, [deleteItem, clickUpdate, updateItem, change]);

    return (
        <div className='TextListItem'>
            <div className="ItemName" onClick={onClick} >
                {change ? <input name='name' value={inputName} onChange={changeInput} className='EditInput'/> : renderName(10)}
            </div>
            {isClick ? renderButton() : null}
        </div>
    );
}

export default TextListItem;