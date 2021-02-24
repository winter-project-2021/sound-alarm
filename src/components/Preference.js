import { useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { postPreference } from '../modules/PreferenceResult';
import { MdMoreVert, MdVolumeDown, MdVolumeUp, MdPlayCircleOutline } from "react-icons/md"
import Logout from './Logout';
import Switch from "react-switch";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Menu from '@material-ui/core/Menu';
import '../style/Preference.scss';

function Preference() {

    const currentPreference = useSelector(state => state.preferenceReducer);
    const USER_ID = useSelector(state => state.updateLoginState.user._id);
    const [preference, setCurPreference] = useState({...currentPreference});
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const bellTypes = useMemo(() => ({"0": "/alarm.mp3", "1": "/alarm.mp3", "2": "/alarm.mp3", "3": "/alarm.mp3", }), []);

    const handleChange = useCallback((event, newValue) => {
        const sound = document.getElementById('alarmTest');
        sound.volume = (newValue / 100);
    }, []);

    const clickPlay = useCallback(() => {
        const sound = document.getElementById('alarmTest');
        // bell소리 선택에 따라 소스 설정
        sound.src = bellTypes[preference.bell];
        sound.play();

    }, [preference, bellTypes]);

    const handleClick = useCallback((event) => {
        if(!preference.sound) return;
        setAnchorEl(event.currentTarget);
    }, [setAnchorEl, preference]);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
        const sound = document.getElementById('alarmTest');
        setCurPreference(prefer => ({...prefer, volume: sound.volume * 100}));
    }, [setAnchorEl, setCurPreference]);

    const dispatch = useDispatch();

    // 소리, 푸쉬 알림 설정
    const setProperty = useCallback((checked, name) => {
        if(name === 'push' && checked){
            Notification.requestPermission().then(permission => {
                if(permission === 'granted'){
                    setCurPreference(prefer => ({...prefer, [name]: checked}));
                }
            });
        }
        else
          setCurPreference(prefer => ({...prefer, [name]: checked}));
    }, [setCurPreference]);

    // 언어 설정
    /*
    const setLang = useCallback((e) => {
        setCurPreference(prefer => ({...prefer, lang: e.target.value}));
    }, [setCurPreference]);
    */

    // 벨 타입 설정
    const setBell = useCallback((e) => {
        setCurPreference(prefer => ({...prefer, bell: e.target.value}));
    }, [setCurPreference]);

    // 최종 설정 값 적용
    const applyPreference = useCallback(() => {
        const item = {
            _id: USER_ID,
            alarm: preference.sound,
            alarmpush: preference.push,
            //language: preference.lang,
            alarmvolume: preference.volume,
            alarmsound: preference.bell,
        };
        
        dispatch(postPreference(item));
        const sound = document.getElementById('alarm');
        sound.src = bellTypes[preference.bell];
        sound.volume = preference.volume / 100;

    }, [dispatch, preference, bellTypes, USER_ID]);

    return (
      <>
        <div className='PreferenceBody'>
            <div className='PreferenceItem'>
                <div className='ItemText'>
                    알림 소리 설정
                </div>
                <audio id='alarmTest' style={{display: 'none'}}/>
                <div className='ItemSwitch'>
                    <Switch onChange={(e) => setProperty(e, 'sound')} checked={preference.sound}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}/>
                </div>  

                <div className='ItemDetail'>
                    <MdMoreVert size={15} onClick={handleClick} className='DetailButton'/>
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
                        <MenuItem key='volume' disableRipple style={{backgroundColor: 'transparent'}}>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <MdVolumeDown size={30}/>
                                </Grid>
                                <Grid item xs>
                                    <Slider onChange={handleChange} aria-labelledby="continuous-slider"
                                     defaultValue={currentPreference.volume}
                                     style={{marginTop: 2}}
                                     min={0}
                                     max={100}/>
                                </Grid>
                                <Grid item>
                                    <MdVolumeUp size={30}/>
                                </Grid>
                                
                                <Grid item>
                                    <MdPlayCircleOutline onClick={clickPlay} size={30}/>
                                </Grid>
                            </Grid>
                        </MenuItem>

                        <MenuItem key='bellType' disableRipple style={{backgroundColor: 'transparent'}}>
                            벨소리 설정
                            <Select
                                style={{minWidth: 100, marginLeft: 15}}
                                value={preference.bell}
                                onChange={setBell}
                                inputProps={{
                                    name: 'bell',
                                    id: 'bell-type',
                                }}
                            >
                                <MenuItem value={'0'}>알람 1</MenuItem>
                                <MenuItem value={'1'}>알람 2</MenuItem>
                                <MenuItem value={'2'}>알람 3</MenuItem>
                            </Select>
                            <MdPlayCircleOutline onClick={clickPlay} style={{marginLeft: 48}} size={30}/>
                        </MenuItem>
                    </Menu>
                </div> 
            </div>

            <div className='PreferenceItem'>
                <div className='ItemText'>
                   알림 푸쉬 설정
                </div>
              
                <div className='ItemSwitch'>
                    <Switch onChange={(e) => setProperty(e, 'push')} checked={preference.push}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}/>
                </div> 
                
            </div>
            {/*
            <div className='PreferenceItem'>
                <div className='ItemText'>
                    언어 설정
                </div>
                <Select
                  style={{minWidth: 100,}}
                  value={preference.lang}
                  onChange={setLang}
                  inputProps={{
                      name: 'lang',
                      id: 'lang-id',
                  }}
                >
                  <MenuItem value={'ko'}>한글</MenuItem>
                  <MenuItem value={'en'}>English</MenuItem>
                </Select>
            </div>
            */}
            <div className='PreferenceItem'>
                <div className='ItemText'>
                    로그아웃
                </div>
                <div className='LogoutButton'>
                    <Logout/>
                </div>
            </div>

            
        </div>
        <button className="ApplyButton" onClick={applyPreference}>적용</button>
      </>
    );
}

export default Preference;