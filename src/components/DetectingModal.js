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
    const USER_ID = useSelector(state => state.updateLoginState.user._id); 
    const [isRecord, setIsRecord] = useState(false);
    const [recorder, setRecorder] = useState(null);
    
    const dispatch = useDispatch();

    const clickESC = useCallback(() => {
        dispatch(setCloseDetecting());
    }, [dispatch]);

    const clickDetect = useCallback(() => {
        dispatch(setResult());
    }, [dispatch]);

    const audioStop = useCallback(() => {
        if(recorder === null) return;
        recorder.recorder.stop();
        //recorder.context.close();
        //recorder.stream[0].stop();
        //setRecorder(null);
        //setIsRecord(false);
    }, [recorder, setIsRecord, setRecorder]);

    const audioStart = useCallback(() => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        navigator.getUserMedia(
        {
            audio: true,
            video: false,
        },
  
        function(stream){
            const source = audioCtx.createMediaStreamSource(stream);
            const dest = audioCtx.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(dest.stream);
            setRecorder({recorder: mediaRecorder, context: audioCtx, stream: stream.getTracks()});
            const biquadFilter = audioCtx.createBiquadFilter();

            biquadFilter.type = "bandpass"
            biquadFilter.frequency.setValueAtTime(1200, audioCtx.currentTime);
            biquadFilter.Q.setValueAtTime(5, audioCtx.currentTime);

            source.connect(biquadFilter);
            biquadFilter.connect(dest);
            let chunks = [];
          
            mediaRecorder.ondataavailable = function(evt) {
            // push each chunk (blobs) in an array
                chunks.push(evt.data);
                var blob = new Blob(chunks, { 'type' : 'audio/wav' });
                blob.arrayBuffer().then(buffer => {
                        audioCtx.decodeAudioData(buffer, function(b){
                        let wav = toWav(b);
                        const blob = new Blob([wav], {type: 'audio/wav'});
                        const form = new FormData();
                        form.append('data', blob);
                        form.append('_id', USER_ID);
                        form.append('mode', 'compare');
                    })
                });
                mediaRecorder.start();
                setTimeout(() => {
                    audioStop();
                }, 5000);

                chunks=[]
            };

            mediaRecorder.start();
            setTimeout(() => {
                audioStop();
            }, 5000);
        },
  
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
        );
    }, [setRecorder, audioStop, USER_ID]);

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

    const renderTLI = useCallback((i) => {
        return <div className='DetectTextListItem'>{i}</div>
    }, []);

    const renderSLI = useCallback((i) => {
        return <div className='DetectSoundListItem'>{i}</div>
    }, []);

    const renderTextList = useCallback(() => {
        if(textList.length === 0){
            return;
        }
    
        return (textList.map(ele => renderTLI(ele.text)));
    }, [textList, renderTLI])

    const renderSoundList = useCallback(() => {
        if(soundList.length === 0){
            return;
        }
    
        return (soundList.map(ele => renderSLI(ele.name)));
    }, [soundList, renderSLI]);


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
    }, [clickESC, clickDetect, renderTextList, renderSoundList, detect]);


    return (
        <>
                {open ? (<div className='Detecting'>
                    {renderModal()}
                    </div>) : null}
        </>
    );
}

export default DetectingModal;