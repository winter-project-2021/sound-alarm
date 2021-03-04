import React from 'react';
import { useCallback } from 'react';
import { GoogleLogout } from 'react-google-login';
import { updateLogout } from '../modules/LoginState';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import trans from './lang';

const clientId = `${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`


function Logout() {
    //Modal 용도
    const dispatch = useDispatch();
    const { lang } = useSelector(state => state.preferenceReducer);

    //로그아웃 성공시 실행
    const onSuccess = useCallback(() => {
        const popup = {
            head: trans[lang]['logout'][0],
            body: trans[lang]['logout'][1],
            buttonNum: 1,
            headColor: '#22d77e',
            btn1Color: '#22d77e',
            btn2Color: null,
            btn1Text: '#ffffff',
            btn2Text: null,
            callback: () => dispatch(updateLogout()),
        };
        dispatch(setOpen(popup));

    }, [dispatch, lang]);

    return (
        <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onSuccess} //성공시 실행
        ></GoogleLogout>
    );
}

export default Logout;