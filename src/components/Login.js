import { useState } from 'react';
import '../style/Login.scss';

function Login(props) {

    // test용으로 props를 통해 setLogin을 Card로부터 받아옴
    // 리덕스 적용 후에는 리덕스를 사용
    // 만약 구현시 props가 더 낫다고 판단되면 props 써도 무방
    const { setLogin } = props;

    // 테스트용으로 로그인 버튼
    const logIn = () => {
        setLogin(true);
    }

    return (
        <div className='LoginComponent'>
            Login 화면
            <button onClick={logIn}>LogIn!!!</button>
        </div>
    );
}

export default Login;
