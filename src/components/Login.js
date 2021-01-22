import { useCallback } from 'react';
import { GoogleLogin } from 'react-google-login';
import { updateLogin, updateLogout } from '../modules/LoginState';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import '../style/Login.scss';

const clientId = `${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`


function Login() {

    // test용으로 props를 통해 setLogin을 Card로부터 받아옴
    // 리덕스 적용 후에는 리덕스를 사용
    // 만약 구현시 props가 더 낫다고 판단되면 props 써도 무방
    //const { setLogin } = props;

    const dispatch = useDispatch();
    

    const onSuccess = (res) => {
        const userInfo = {name: res.profileObj.name, imgURL: res.profileObj.imageUrl};

        const popup = {
            head: '로그인 성공',
            body: `${res.profileObj.name}님 환영합니다. See console for full profile object.`,
            callback: () => dispatch(updateLogin(userInfo)),
        };
        dispatch(setOpen(popup));
        refreshTokenSetup(res);

        console.log('Login Success: currentUser:', res.profileObj, res.tokenObj);
    }
    
    const onFailure = (res) => {

        const popup = {
            head: '로그인 실패',
            body: `로그인에 실패하였습니다. ${res.error}`,
            callback: () => dispatch(updateLogout('')),
        };
        dispatch(setOpen(popup));

        console.log('Login failed: res:', res);
    };
    
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
                            isSignedIn={false} //true일때 새로고침해도 로그인이 유지됨.(onSuccess callback)
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
