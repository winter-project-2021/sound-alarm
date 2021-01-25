import React from 'react';
import { useCallback } from 'react';
import { GoogleLogout } from 'react-google-login';
import { updateLogout } from '../modules/LoginState';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';

const clientId = `${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`


function Logout() {
    //Modal 용도
    const dispatch = useDispatch();

    //로그아웃 성공시 실행
    const onSuccess = useCallback(() => {
        const popup = {
            head: '로그아웃 성공',
            body: `로그아웃에 성공하였습니다.`,
            buttonNum: 1,
            callback: () => dispatch(updateLogout()),
        };
        dispatch(setOpen(popup));

        console.log('Logout made successfully');
    }, [dispatch]);

    return (
        <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onSuccess} //성공시 실행
        ></GoogleLogout>
    );
}

export default Logout;