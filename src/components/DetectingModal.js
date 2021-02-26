import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCloseDetecting, setResult} from '../modules/DetectingResult';
import ReactLoading from 'react-loading';
import { MdClear, MdNotificationsActive } from "react-icons/md";
import '../style/Detecting.scss';


function DetectingModal() { 

    const { open, detect, scoreFromServer } = useSelector(state => state.setDetecting)
    const textList = useSelector(state => state.updateTextList.textList);
    const soundList = useSelector(state => state.updateSoundList.soundList)
    const { sound, push } = useSelector(state => state.preferenceReducer);
    const [isRecord, setIsRecord] = useState(false);
    
    const dispatch = useDispatch();

    const clickESC = useCallback(() => {
        dispatch(setCloseDetecting());
    }, [dispatch]);

    const clickDetect = useCallback(() => {
        dispatch(setResult());
    })

    const testAlarm = useCallback(() => {
        if(sound){
            const sound = document.getElementById('alarm');
            sound.play();
        }

        if(push){
            var options = {
                body: "소리가 감지되었습니다!!!!!",
                icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
                dir: "ltr"
            };
            
            new Notification("!알람!", options);
        }
    }, [push, sound]);

    const renderTextList = useCallback(() => {
        if(textList.length === 0){
            return;
        }
    
        return (textList.map(ele => renderTLI(ele.text)));
    }, [textList])

    function renderTLI(i) {
        return <div className='DetectTextListItem'>{i}</div>
    }

    const renderSoundList = useCallback(() => {
        if(textList.length === 0){
            return;
        }
    
        return (soundList.map(ele => renderSLI(ele.name)));
    }, [soundList])

    function renderSLI(i) {
        return <div className='DetectSoundListItem'>{i}</div>
    }

    const renderModal = useCallback(() => {
        return (<div className='DetectingBox'>
                    <div>
                        <button className='DetectTest' onClick={clickDetect}>Detect!</button>
                    </div>
                    <div className='DetectingHead'>
                        <button className='ESC' onClick={clickESC}><MdClear size={35}/></button>
                    </div>
                    <div className='DetectingBoxBody'>
                        <div className='ProgressIcon'>{detect ? <MdNotificationsActive size={100}/> : (<ReactLoading type={'spinningBubbles'} color={'#383838'} width={100} />)}</div>
                        <div className='ProgressText'>{detect ? '감지 되었습니다!' : '감지중 입니다.' }</div>
                    </div>
                    <div className='DetectInfo'>
                        <div className='DetectInfoText'>텍스트 목록
                            <div className='DetectTextList'>{renderTextList()}</div>
                        </div>
                        <div className='DetectInfoSound'>음성 목록
                            <div className='DetectSoundList'>{renderSoundList()}</div>

                        </div>
                    </div>
                </div>)
    }, [clickESC, clickDetect]);


    return (
        <>
                {open ? (<div className='Detecting'>
                    {renderModal()}
                    </div>) : null}
        </>
    );
}

export default DetectingModal;