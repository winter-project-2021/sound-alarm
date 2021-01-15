import { useCallback, useState, useEffect } from 'react';
import '../style/SoundSetting.scss';
import { MdDeleteForever, MdModeEdit, MdDone } from "react-icons/md"

function SoundListItem(props) {

    const { name, order, clickItem, isClick, updateName, deleteName, setDelete, setUpdate } = props;

    // 항목 수정된 이름
    const [inputName, setInputName] = useState(name);

    // 현재 수정/ 삭제 중 인지
    const [change, setChange] = useState(false);
    const [nowDelete, setNowDelete] = useState(false);
   
    useEffect(() => {
        // 새롭게 리렌더링 될 때마다 항목의 수정 이름은
        // 본인의 기본 이름과 같도록 세팅 
        setInputName(name);
    }, [name, setInputName]);

    const deleteItem = useCallback(() => {
        
        // 삭제중임을 명시
        setDelete(true);
        setNowDelete(true);
        setUpdate(false);
        setChange(false);

        // 중간에 팝업을 넣으면 좋을 듯

        // 항목 삭제
        deleteName(order);
        setDelete(false);
        setNowDelete(false);

        clickItem(-1);
    }, [deleteName, order, clickItem, setUpdate, setChange, setNowDelete, setDelete]);

    const clickUpdate = useCallback(() => {
        // 수정 시작
        setUpdate(true);
        setChange(true);
    }, [setUpdate, setChange]);

    const updateItem = useCallback(() => {
        // 항목 수정 후 초기화
        updateName(order, inputName);
        setUpdate(false);
        setChange(false);
        clickItem(-1);
    }, [updateName, inputName, setUpdate, order, clickItem, setChange]);

    const changeInput = useCallback((e) => {
        // 항목 이름 수정값 받아오기
        setInputName(e.target.value);
    }, [setInputName]);


    const onClick = useCallback(() => {
        clickItem(order);
    }, [clickItem, order]);

    const renderButton = useCallback(() => {
        return (<div className='ChangeButton'>
                    {change ? <MdDone className='Button' onClick={updateItem}/> :
                    <MdModeEdit className='Button' onClick={clickUpdate}/>}
                    <MdDeleteForever className='Button' onClick={deleteItem}/>
                </div>)
    }, [deleteItem, clickUpdate, updateItem, change]);

    return (
        <div className='SoundListItem'>
            <div className='ItemName' onClick={onClick}>
                {change ? <input name='name' value={inputName} onChange={changeInput} className='EditInput'/> : name}
            </div>
            {isClick ? renderButton() : null}
        </div>
    );
}

export default SoundListItem;