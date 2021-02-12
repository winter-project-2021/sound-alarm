import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import { setOpenSensitivity } from '../modules/SensitivityResult';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { MdDeleteForever, MdModeEdit, MdDone } from "react-icons/md"
import '../style/SoundSetting.scss';

function SoundListItem(props) {

    const { name, order, clickItem, isClick, updateName, deleteName, setDelete, setUpdate, blob, score } = props;
    const dispatch = useDispatch();

    // 항목 수정된 이름
    const [inputName, setInputName] = useState(name);

    // 현재 수정/ 삭제 중 인지
    const [change, setChange] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((e) => {
        setAnchorEl(e.currentTarget);
    }, [setAnchorEl]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, [setAnchorEl]);

    useEffect(() => {
        // 새롭게 리렌더링 될 때마다 항목의 수정 이름은
        // 본인의 기본 이름과 같도록 세팅 
        setInputName(name);
        const buttons = document.getElementById('Change' + order);
        buttons.style.display = isClick || change ? 'inline-block' : 'none';
    }, [name, setInputName, isClick, order, change]);

    const renderName = useCallback((len) => {
        // 글자 수 len + 3 이상이면 자르고 ... 로 렌더링
        if(String(name).length < len + 3) return name;
        return String(name).substring(0, len) + "...";
    }, [name]);

    const deleteItem = useCallback(() => {
        
        // 삭제중임을 명시
        setDelete(true);
        setUpdate(false);
        setChange(false);

        // 팝업 객체
        const popup = {
            head: '알림!',
            body: `${renderName(5)} 을(를) 정말로 삭제하시겠습니까?`,
            callback: () => deleteName(order),
        };

        // popup open
        dispatch(setOpen(popup));
        
        setDelete(false);
        clickItem(-1);
    }, [deleteName, order, clickItem, setUpdate, setChange, setDelete, dispatch, renderName]);

    const clickUpdate = useCallback(() => {
        // 수정 시작
        setUpdate(true);
        setChange(true);
        handleClose();
    }, [setUpdate, setChange, handleClose]);

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
        // 이 항목 클릭
        clickItem(order);
    }, [clickItem, order]);

    const renderPlay = useCallback(() => {
        return (<div className='Play'>
                    <audio className='Control' src={blob} controls controlsList="nodownload"/>
                </div>);
    }, [blob]);

    const clickSensitivity = useCallback(() => {
        const popup = {
            id: order,
            name: renderName(10),
            score: score,
        };
        // popup open
        dispatch(setOpenSensitivity(popup));
        handleClose();
    }, [dispatch, order, renderName, handleClose, score]);

    return (
        <div className='SoundListItem'>
            <div className='ItemName' onClick={onClick}>
                {change ? <input name='name' value={inputName} onChange={changeInput} className='EditInput'/> :
                 <div className='NameText'>{renderName(10)}</div>}
                {renderPlay()}
            </div>
            <div id={'Change' + order} className='ChangeButton' style={{display: 'none'}}>
                {change ? <MdDone className='Button' onClick={updateItem}/> :
                <MdModeEdit className='Button' onClick={handleClick}/>}
                <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: '36ch',
                            },
                        }}
                    >
                        <MenuItem key='name' onClick={clickUpdate}>이름 변경</MenuItem>
                        <MenuItem key='sensitivity' onClick={clickSensitivity}>민감도 변경</MenuItem>
                </Menu>
                <MdDeleteForever className='Button' onClick={deleteItem}/>
            </div>
        </div>
    );
}

export default SoundListItem;