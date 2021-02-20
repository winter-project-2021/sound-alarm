import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import '../style/App.scss';

function Loading() {

    const { loading } = useSelector(state => state.loading);

    return (
        <>
            {loading ? (<div className='Modal'>
                        <div className='Loading'><ReactLoading type={'balls'} color={'#ffffff'} height={250} width={350} /></div>
                       </div>) : null}
        </>
    );
}

export default Loading;