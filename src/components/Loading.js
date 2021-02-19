import { useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../style/App.scss';

function Loading() {

    const { loading } = useSelector(state => state.loading);
    const dispatch = useDispatch();

    return (
        <>
            {loading ? (<div className='Modal'>
                        <div>로딩 중 입니다.</div>
                       </div>) : null}
        </>
    );
}

export default Loading;