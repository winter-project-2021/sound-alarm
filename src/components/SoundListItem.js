import { useCallback, useState, useEffect } from 'react';
import '../style/SoundSetting.scss';

function SoundListItem(props) {

    const { name, order, clickItem, isClick, updateName, deleteName, setDelete, setUpdate } = props;

    const [inputName, setInputName] = useState(name);
    const [change, setChange] = useState(false);
    const [nowDelete, setNowDelete] = useState(false);
   
    useEffect(() => {
        setInputName(name);
    }, [name, setInputName]);

    const deleteItem = useCallback(() => {
        setDelete(true);
        setNowDelete(true);
        setUpdate(false);
        setChange(false);

        deleteName(order);
        setDelete(false);
        setNowDelete(false);

        clickItem(-1);
    }, [deleteName, order, clickItem, setUpdate, setChange, setNowDelete, setDelete]);

    const clickUpdate = useCallback(() => {
        setUpdate(true);
        setChange(true);
    }, [setUpdate, setChange]);

    const updateItem = useCallback(() => {
        updateName(order, inputName);
        setUpdate(false);
        setChange(false);
        clickItem(-1);
    }, [updateName, inputName, setUpdate, order, clickItem, setChange]);

    const changeInput = useCallback((e) => {
        setInputName(e.target.value);
    }, [setInputName]);


    const onClick = useCallback(() => {
        clickItem(order);
    }, [clickItem, order]);

    const renderButton = useCallback(() => {
        return (<div className='ChangeButton'>
                    {change ? <button className='Button' onClick={updateItem}>완료</button> :
                     <button className='Button' onClick={clickUpdate}>수정</button>}
                    <button className='Button' onClick={deleteItem}>삭제</button>
                </div>)
    }, [deleteItem, clickUpdate, updateItem, change]);

    return (
        <div className='SoundListItem'>
            <div className='ItemName' onClick={onClick}>
                {change ? <input name='name' value={inputName} onChange={changeInput}/> : name}
            </div>
            {isClick ? renderButton() : null}
        </div>
    );
}

export default SoundListItem;