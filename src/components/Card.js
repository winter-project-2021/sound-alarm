import { useState, useCallback, useMemo, useEffect } from 'react';
// test for alarm method
import { useSelector, useDispatch } from 'react-redux';
import { updateLogout } from '../modules/LoginState';
import { setLang } from '../modules/PreferenceResult';
import { setOpenDetecting } from '../modules/DetectingResult';
import Guide from './Guide';
import SoundSetting from './SoundSetting';
import TextSetting from './TextSetting';
import Preference from './Preference';
import Error from './Error';
import Login from './Login';
import trans from './lang';
import '../style/Card.scss';

function Card() {

    // 현재 선택 중인 메뉴 값
    const [menu, setMenu] = useState(0);
    // 선택가능한 메뉴 리스트
    const [classes, setClasses] = useState(['SideButton select', 'SideButton', 'SideButton', 'SideButton'])

    // login 여부
    // 로그인 여부와 사용자 이름, 썸네일 이미지를 리덕스에서 가져옴
    const login = useSelector(state => state.updateLoginState.login);
    const userName = useSelector(state => state.updateLoginState.user.name);
    const imageURL = useSelector(state => state.updateLoginState.user.imgURL);

    const { lang } = useSelector(state => state.preferenceReducer);
    const menuList = useMemo(() => trans[lang]['menu'], [lang]);

    const dispatch = useDispatch();

    const renderMenu = useCallback(() => {
        // 선택한 메뉴에 따라 다른 컴포넌트 렌더링
        switch(menu){
        case 0:
            return <Guide/>
        case 1:
            return <TextSetting/>
        case 2:
            return <SoundSetting/>
        case 3:
            return <Preference/>
        default:
            return <Error/>
        }
    }, [menu])
    
    const selectMenu = useCallback((id) => {
        // 메뉴 버튼 클릭 시 menu값 설정
        if(id === menu) return;
        let newClasses = [];
        for(let i = 0; i < 4; i++){
            if(i === menu) newClasses.push('SideButton deSelect');
            else if(i === id) newClasses.push('SideButton select');
            else newClasses.push('SideButton');
        }
        setClasses(newClasses);
        setMenu(id);
    }, [setMenu, menu, setClasses])
    
    const renderSideMenu = useCallback(() => {
        // menuList의 항목을 button list로 전환
        return menuList.map((item, i) => (<button id={i} 
                                            key={i}
                                            className={classes[i]}
                                            onClick={() => selectMenu(i)
                                            }>{item}</button>));
    }, [menuList, selectMenu, classes])

    const selectLang = useCallback((lang) => {
        dispatch(setLang(lang));  
    }, [dispatch]);    

    const renderHeader = useCallback(() => {
        //Header 왼쪽에 유저 썸네일이랑 이름
        return (
            <div className='Header'>
                <div className='InfoBox'>
                    <img className='UserThumb' src={imageURL} alt='userThumb'></img>
                        <div className='UserInfo'>
                            {userName}
                        </div>                    
                </div>
                <div className='Language'>
                    <div className='buttonbackground'></div>
                    <div className={'selectedbackground' + (lang === 'ko' ? 'left' : 'right')}></div>
                    <button className={'ko' + (lang === 'ko' ? ' select' : '')} onClick={() => selectLang('ko')}>한국어</button>
                    <button className={'en' + (lang === 'en' ? ' select' : '')} onClick={() => selectLang('en')}>English</button>
                </div>
            </div>
        )
    }, [imageURL, userName, lang, selectLang])

    const renderLogin = () => {
        return <Login/>
    }

    const renderDetecting = useCallback(() => {
        dispatch(setOpenDetecting());
    }, [dispatch])
    


    // 로그인이 된 상태면 메인 화면을, 아니면 로그인 화면을 보여주기 위해
    // 메인 화면 렌더링을 따로 함수로 분리
    const renderMainScreen = () => {
        return (
            <>
                <div className='CardHeader'>
                    {renderHeader()}
                </div>
                <div className='CardSide'>
                    {renderSideMenu()}
                </div>
                <div className='CardBody'>
                    {renderMenu()}
                    {menu !== 3 ? <button className="StartButton" onClick={renderDetecting}>{trans[lang]['detectStart']}</button> : null}
                </div>
            </>
        );
    }


    useEffect(() => {
        //console.log("Card component did mount with useEffect")
        return () => {
            //console.log("Card component did umount with useEffect")
            dispatch(updateLogout());
        }
    }, [dispatch]);

    return (
        <>
        <div className='CardComponent'>
            <img className='CardFavicon' src='/favicon270.png' alt='SoundAlarmIcon'></img>
            {login ? renderMainScreen() : null}
            <audio style={{display: 'none'}} src='/alarm.mp3' id='alarm'/>
        </div>
        {login ? null : renderLogin()}
        </>
    );
}

export default Card;
