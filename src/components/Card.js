import { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Guide from './Guide';
import SoundSetting from './SoundSetting';
import TextSetting from './TextSetting';
import Preference from './Preference';
import Error from './Error';
import Login from './Login';
import Logout from './Logout';
import '../style/Card.scss';

function Card() {

    // 현재 선택 중인 메뉴 값
    const [menu, setMenu] = useState(0);
    // 선택가능한 메뉴 리스트
    const menuList = useMemo(() => ["가이드", "텍스트 설정", "소리 설정", "설정", ], []);

    // login 여부
    // 리덕스 적용 로그인 여부와 사용자 이름, 썸네일 이미지를 가져옴
    const login = useSelector(state => state.updateLoginState.login);
    const name = useSelector(state => state.updateLoginState.user.name);
    const imageURL = useSelector(state => state.updateLoginState.user.imgURL);

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
        setMenu(id);
    }, [setMenu])
    
    const renderSideMenu = useCallback(() => {
        // menuList의 항목을 button list로 전환
        return menuList.map((item, i) => (<button id={i} 
                                            className={'SideButton ' + (i === menu ? 'SelectedButton' : '')}
                                            onClick={() => selectMenu(i)
                                            }>{item}</button>));
    }, [menuList, selectMenu, menu])

    const renderHeader = useCallback(() => {
        return (
            <div className='Header'>
                <div className='InfoBox'>
                    <img class='UserThumb' src={imageURL}></img>
                        <div className='UserInfo'>
                            {name}
                        </div>                    
                </div>
                Sound Alarm
                <div className='LogoutButton'>
                    <Logout/>
                </div>
            </div>
        )
    }, [imageURL, name, login])

    const renderLogin = useCallback(() => {
        return <Login/>
    }, [login])

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
                    <button className="StartButton">start</button>
                </div>
            </>
        );
    }

    return (
        <div className='CardComponent'>
            {login ? renderMainScreen() : renderLogin()}
        </div>
    );
}

export default Card;
