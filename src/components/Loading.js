import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import '../style/App.scss';

function Loading() {

    const { loading } = useSelector(state => state.loading);

    return (
        <>
            {loading ? (<div className='Modal'>
                        <ReactLoading type={'balls'} color={'#ffffff'} height={350} width={350} className='Loading'/>
                       </div>) : null}
        </>
    );
}

export default Loading;