import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import { setOpenSensitivity } from '../modules/SensitivityResult';
import { setError } from '../modules/SoundList';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { MdDeleteForever, MdModeEdit, MdDone, MdPlayCircleOutline, MdVolumeUp, MdVolumeDown } from "react-icons/md"
import { FaRegStopCircle, FaVolumeDown } from 'react-icons/fa';
import trans from './lang';
import '../style/SoundSetting.scss';

function SoundListItem(props) {

    const { name, order, clickItem, isClick, updateName, deleteName, setDelete, setUpdate, blob, score } = props;
    const dispatch = useDispatch();
    const { lang } = useSelector(state => state.preferenceReducer);

    const LightTooltip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: theme.palette.common.white,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[2],
            fontSize: 11,
            margin: 5,
        },
    }))(Tooltip);

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
        setInputName(name);
        handleClose();
    }, [setUpdate, setChange, handleClose, setInputName, name]);

    const updateItem = useCallback(() => {
        // 항목 수정 후 초기화
        updateName(order, inputName, score);
        setUpdate(false);
        setChange(false);
        clickItem(-1);
    }, [updateName, inputName, setUpdate, order, clickItem, score, setChange]);

    const changeInput = useCallback((e) => {
        // 항목 이름 수정값 받아오기
        setInputName(e.target.value);
    }, [setInputName]);


    const onClick = useCallback(() => {
        // 이 항목 클릭
        clickItem(order);
    }, [clickItem, order]);

    const onPlay = useCallback(() => {
        const audio = document.getElementById(`audio${order}`);
        const url = URL.createObjectURL(new Blob([new Uint8Array(JSON.parse(blob)).buffer]));
        console.log(url);
        audio.src = url;
        audio.play();
    }, [order, blob]);

    const onStop = useCallback(() => {
        const audio = document.getElementById(`audio${order}`);
        audio.pause();
        audio.src = blob;
    }, [order, blob]);

    const changeVolume = useCallback((e, newValue) => {
        const audio = document.getElementById(`audio${order}`);
        audio.volume = newValue / 100;
    }, [order]);

    const volumeSlider = useCallback(() => {
        const audio = document.getElementById(`audio${order}`);
        return (<div>
                    <MdVolumeDown size={30}/>
                    <Slider onChange={changeVolume}
                         defaultValue={audio === null ? 100 : audio.volume * 100}
                         aria-labelledby="continuous-slider" style={{width: 100, marginLeft: 3, marginRight: 3}}
                         min={0}
                         max={100}/>
                    <MdVolumeUp size={30}/>
                </div>)
    }, [changeVolume, order]);

    const renderPlay = useCallback(() => {
        //const url = URL.createObjectURL(blob);
        //console.log(url);
        return (<div className='Play'>
                    <audio id={`audio${order}`} style={{display: 'none'}}/>
                    <MdPlayCircleOutline className='start' size={35} onClick={onPlay}/>
                    <FaRegStopCircle className='stop' size={30} onClick={onStop}/>
                    <div className='volume'>
                    <LightTooltip title={volumeSlider()} interactive placement="top" disableFocusListener disableTouchListener>
                        <div style={{display: 'inline-block'}}><FaVolumeDown size={35}/></div>
                    </LightTooltip>
                    </div>
                </div>);
    }, [order, onPlay, onStop, volumeSlider]);

    const clickSensitivity = useCallback(() => {
        const popup = {
            id: order,
            name: renderName(10),
            score: score,
        };
        // popup open
        dispatch(setError(false));
        dispatch(setOpenSensitivity(popup));
        handleClose();
    }, [dispatch, order, renderName, handleClose, score]);


    return (
        <div className='SoundListItem'>
            <div className='ItemName' onClick={onClick}>
                {change ? <input name='name' value={inputName} onChange={changeInput} className='EditInput'/> :
                 <div className='NameText'>{renderName(10)}</div>}
                <div className='ItemScore'>
                    {trans[lang]['sensitivity'][0]}: {score}
                </div>
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
                                width: '27ch',
                            },
                        }}
                    >
                        <MenuItem key='name' onClick={clickUpdate}>{trans[lang]['name']}</MenuItem>
                        <MenuItem key='sensitivity' onClick={clickSensitivity}>{trans[lang]['sens']}</MenuItem>
                </Menu>
                <MdDeleteForever className='Button' onClick={deleteItem}/>
            </div>
        </div>
    );
}

export default SoundListItem;