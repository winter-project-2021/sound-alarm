import { useCallback } from 'react';
import { GoogleLogin } from 'react-google-login';
import { updateLogin, updateLogout } from '../modules/LoginState';
import { useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import { setList } from '../modules/SoundList';
import { setTextList } from '../modules/TextList';
import { setPreference } from '../modules/PreferenceResult';
import { startLoading, finishLoading } from '../modules/loading';
import axios from 'axios';
import '../style/Login.scss';

const clientId = `${process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}`
const END_POINT = `${process.env.END_POINT}`;

function Login() {
    //Modal 용도
    const dispatch = useDispatch();


    //로그인 성공시 실행
    const onSuccess = useCallback((res) => {
        let userInfo = {name: res.profileObj.name, imgURL: res.profileObj.imageUrl, username: String(res.profileObj.googleId)};
        dispatch(startLoading(null));
        axios.post('/login',{username: userInfo.username})
        .then((response) => {
            //Object.assign(userInfo, response.data);
            userInfo = {...userInfo, _id: response.data._id}
            const text = response.data.stt
            let textList = []
            for(const t of text) {
                const item = {
                    id : t._id,
                    text : t.text
                };
                textList.push(item)
            }
            dispatch(setTextList(textList))

            const audio = response.data.audio
            let soundList = []
            for(const a of audio) {
                const item = {
                    id: a._id,
                    name: a.name,
                    blob: JSON.stringify(Array.from(new Uint8Array(a.buffer.data))),
                    score: a.sensitivity   
                    };
                soundList.push(item)
            }
            dispatch(setList(soundList))
    
            const pref = {
                alarm: response.data.alarm,
                alarmpush: response.data.alarmpush,
                alarmsound: response.data.alarmsound,
                alarmvolume: response.data.alarmvolume,
                language: String(response.data.language).toLowerCase(),
            }
            dispatch(setPreference(pref));
            dispatch(finishLoading(null));

            const popup = {
                head: '로그인 성공',
                body: `${res.profileObj.name}님 환영합니다.`,
                buttonNum: 1,
                headColor: '#22d77e',
                btn1Color: '#22d77e',
                btn2Color: null,
                btn1Text: '#ffffff',
                btn2Text: null,
                callback: () => dispatch(updateLogin(userInfo)),
            };
            dispatch(setOpen(popup));
            refreshTokenSetup(res);
            
            console.log('Login Success: currentUser:', res.profileObj);
            console.log('User Info from Server :', userInfo);
        })

        

    }, [dispatch]);
    
    //로그인 실패시 실행
    const onFailure = useCallback((res) => {

        const popup = {
            head: '로그인 실패',
            body: `로그인에 실패하였습니다. ${res.error}`,
            buttonNum: 1,
            headColor: '#ff3547',
            btn1Color: '#f2f3f4',
            btn2Color: null,
            btn1Text: '#000000',
            btn2Text: null,
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
            <div className='LoginBox'>
                <div className='Favicon'>
                    <img src='/faviconcircle150.png' id='loginfavicon'></img>
                </div>
                <div className='LoginText'>
                    Sound Alarm
                </div>
                <div className='Description'>
                    Sound notification service
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
        
    );
}

export default Login;