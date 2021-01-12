import { useState } from 'react';
import Guide from './Guide';
import SoundSetting from './SoundSetting';
import TextSetting from './TextSetting';
import Preference from './Preference';
import Error from './Error';
import '../style/Card.scss';

function Card() {

    // 현재 선택 중인 메뉴 값
    const [menu, setMenu] = useState(0);
    // 선택가능한 메뉴 리스트
    const menuList = ["가이드", "텍스트 설정", "소리 설정", "설정", ];

    const renderMenu = () => {
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
    }
    
    const selectMenu = (id) => {
        // 메뉴 버튼 클릭 시 menu값 설정
        setMenu(id);
    }

    const renderSideMenu = () => {
        // menuList의 항목을 button list로 전환
        return menuList.map((menu, i) => (<button id={i} 
                                            className='SideButton'
                                            onClick={() => selectMenu(i)
                                            }>{menu}</button>))
    }

    return (
        <div className='CardComponent'>
            <div className='CardHeader'>
                Header
            </div>
            <div className='CardSide'>
                {renderSideMenu()}
            </div>
            <div className='CardBody'>
                {renderMenu()}
            </div>
        </div>
    );
}

export default Card;
