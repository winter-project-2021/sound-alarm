import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { updateLogin, updateLogout } from '../modules/LoginState';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';

const clientId = `${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`


function Logout(props) {

    const dispatch = useDispatch();

    
    const onSuccess = () => {
        const popup = {
            head: '로그아웃 성공',
            body: `로그아웃에 성공하였습니다.`,
            callback: () => dispatch(updateLogout({})),
        };
        dispatch(setOpen(popup));

        console.log('Logout made successfully');
    };

    return (
        <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onSuccess} //성공시 실행
        ></GoogleLogout>
    );
}

export default Logout;