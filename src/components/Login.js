import { useCallback } from 'react';
import { GoogleLogin } from 'react-google-login';
import { updateLogin, updateLogout } from '../modules/LoginState';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import '../style/Login.scss';

const clientId = `${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`


function Login() {
    //Modal 용도
    const dispatch = useDispatch();
    
    //로그인 성공시 실행
    const onSuccess = useCallback((res) => {
        const userInfo = {name: res.profileObj.name, imgURL: res.profileObj.imageUrl};

        const popup = {
            head: '로그인 성공',
            body: `${res.profileObj.name}님 환영합니다. See_console_for_full_profile_object.`,
            buttonNum: 1,
            callback: () => dispatch(updateLogin(userInfo)),
        };
        dispatch(setOpen(popup));
        refreshTokenSetup(res);

        console.log('Login Success: currentUser:', res.profileObj, res.tokenObj);
    }, [dispatch]);
    
    //로그인 실패시 실행
    const onFailure = useCallback((res) => {

        const popup = {
            head: '로그인 실패',
            body: `로그인에 실패하였습니다. ${res.error}`,
            buttonNum: 1,
            callback: () => dispatch(updateLogout()),
        };
        dispatch(setOpen(popup));

        console.log('Login failed: res:', res);
    }, [dispatch]);
    
    //로그인후 1시간이 지나면 기존의 tokenId가 만료되기 때문에 token을 갱신.
    const refreshTokenSetup = (res) => {
        // Timing to renew access token
        let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;
      
        const refreshToken = async () => {
          const newAuthRes = await res.reloadAuthResponse();
          refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
          console.log('newAuthRes:', newAuthRes);

          // saveUserToken(newAuthRes.access_token);  <-- save new token
          localStorage.setItem('authToken', newAuthRes.id_token);
      
          // Setup the other timer after the first one
          setTimeout(refreshToken, refreshTiming);
        };
      
        // Setup first refresh timer
        setTimeout(refreshToken, refreshTiming);
    };

    return (
        <div className='LoginComponent'>
            <div className='LoginBoxWrap'>
                <div className='LoginBox'>
                    <div className='LoginText'>
                        LOGIN
                    </div>
                    <div className='GoogleLoginButton'>
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Login with Google"
                            onSuccess={onSuccess} // 성공시 실행
                            onFailure={onFailure} // 실패시 실행
                            cookiePolicy={'single_host_origin'}
                            />
                    </div>
                </div>
                
            </div>
            <div className='IntroBoxWrap'>
                <div className='IntroBox'>
                    <h1>Welcome!</h1>
                    <div className='IntroText'>                        
                        <p>This website is for detecting any sound and text you want and notifing to you</p>
                    </div>                    
                </div>
            </div>
        </div>
        
    );
}

export default Login;