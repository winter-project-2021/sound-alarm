import { useState, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPreference } from '../modules/PreferenceResult';
import { MdMoreVert, MdVolumeDown, MdVolumeUp, MdPlayCircleOutline } from "react-icons/md"
import Logout from './Logout';
import Switch from "react-switch";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import '../style/Preference.scss';

function Preference() {

    const currentPreference = useSelector(state => state.preferenceReducer);
    const [preference, setCurPreference] = useState({...currentPreference});
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
    const setLang = useCallback((e) => {
        setCurPreference(prefer => ({...prefer, lang: e.target.value}));
    }, [setCurPreference]);

    // 최종 설정 값 적용
    const applyPreference = useCallback(() => {
        dispatch(setPreference(preference));
    }, [dispatch, preference]);

    return (
      <>
        <div className='PreferenceBody'>
            <div className='PreferenceItem'>
                <div className='ItemText'>
                    알림 소리 설정
                </div>
              
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