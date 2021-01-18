import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';

const clientId = '198175746547-k85131r2cq580i67e2kbok9pb8u12gc2.apps.googleusercontent.com';


function Logout(props) {

    const { setLogin } = props;

    const dispatch = useDispatch();

    
    const onSuccess = () => {
        const popup = {
            head: '로그아웃 성공',
            body: `로그아웃에 성공하였습니다.`,
            callback: () => setLogin(false),
        };
        dispatch(setOpen(popup));

        console.log('Logout made successfully');
    };

    return (
        <div>
        <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onSuccess} //성공시 실행
        ></GoogleLogout>
        </div>
    );
}

export default Logout;