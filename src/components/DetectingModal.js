import { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCloseDetecting, setResult, getMatchServer } from '../modules/DetectingResult';
import ReactLoading from 'react-loading';
import { MdClear, MdNotificationsActive } from "react-icons/md";
import toWav from 'audiobuffer-to-wav';
import '../style/Detecting.scss';


function DetectingModal() { 

    const { open, detect, } = useSelector(state => state.setDetecting)
    const textList = useSelector(state => state.updateTextList.textList);
    const soundList = useSelector(state => state.updateSoundList.soundList)
    const { sound, push } = useSelector(state => state.preferenceReducer);
    const USER_ID = useSelector(state => state.updateLoginState.user._id); 
    const [isRecord, setIsRecord] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [first, setFirst] = useState(false);
    const [speech, setSpeech] = useState(null);
    
    const dispatch = useDispatch();

    const audioStop = useCallback(() => {
        if(timeoutId !== null) clearTimeout(timeoutId);
        setTimeoutId(null);
        if(recorder === null) return;
        if(recorder.recorder.state !== 'inactive'){
            recorder.recorder.stop();
        }      
        recorder.context.close();
        for(let i = 0; i < recorder.stream.length; i++) {
            recorder.stream[i].stop();
        }
        
        setRecorder(null);
        setIsRecord(false);
    }, [recorder, setRecorder, setIsRecord, timeoutId, setTimeoutId]);

    const clickESC = useCallback(() => {
        dispatch(setCloseDetecting());
        setResult(false);
        setFirst(false);
        audioStop();
        setIsStart(false);        
    }, [dispatch, audioStop, setFirst, setIsStart]);

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
            var chunks = [];
          
            mediaRecorder.ondataavailable = function(evt) {
            // push each chunk (blobs) in an array
                chunks.push(evt.data);
                //console.log(Math.max(...chunks));   
            };

            mediaRecorder.onstop = function(e) {
                var blob = new Blob(chunks, { 'type' : 'audio/wav' });
                blob.arrayBuffer().then(buffer => {
                    audioCtx.decodeAudioData(buffer, function(b){
                        let wav = toWav(b);
                        const blob = new Blob([wav], {type: 'audio/wav'});
                        const form = new FormData();
                        form.append('data', blob);
                        form.append('_id', USER_ID);
                        form.append('mode', 'compare');
                        dispatch(getMatchServer(form));

                        mediaRecorder.start();
                        clearTimeout(timeoutId);
                        const timeId = setTimeout(() => {
                            mediaRecorder.stop();
                        }, 5000);
                        setTimeoutId(timeId); 

                    }, function(e) {
                        return;
                    })
                });

                chunks=[];
            }

            if(!isRecord) {
                setIsRecord(true);
                mediaRecorder.start();
                const timeId = setTimeout(() => {
                    mediaRecorder.stop();
                }, 5000);
                setTimeoutId(timeId);     
            }
        },
  
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
        );
    }, [setRecorder, USER_ID, isRecord, timeoutId, setIsRecord, setTimeoutId, dispatch]);

    const stopStt = useCallback(() => {
        if(speech === null) return;
        if(!detect) {
            speech.start();
        }
        else {
            setSpeech(null);
        }
        
    }, [setSpeech, speech, detect]);

    const startSTT = useCallback(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.interimResults = true;
        recognition.lang = 'ko-KR';
        setSpeech(recognition);
        recognition.start();

        recognition.onresult = (e) => {
            let texts = String(Array.from(e.results)
            .map(result => result[0].transcript).join(""));
            console.log(texts);
            const split = texts.split(" ");
            for(const text of split) {
                for(const t of textList) {
                    if(t.text === text) {
                        dispatch(setResult(true));
                        recognition.stop();
                        return;
                    }
                }
            }
        }
    }, [textList, dispatch, audioStop]);

    const clickDetect = useCallback(() => {
        dispatch(setResult(false));
        setFirst(false);
        audioStart();
        startSTT();
    }, [dispatch, setFirst, audioStart, startSTT]);

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

    useEffect(() => {
        if(open && !isStart) {
            setIsStart(true);
            if(soundList.length > 0) audioStart();
            if(textList.length > 0) startSTT();
        }
        if(!open) {
            audioStop();
            stopStt();
        }

        if(detect && !first && open) {
            setFirst(true);
            testAlarm();
            audioStop();
            stopStt();
        }

        if(speech !== null) {
            speech.onend = () => {
                stopStt();
            }
        }
    }, [audioStart, audioStop, open, isStart, setIsStart, detect, testAlarm, first, setFirst, startSTT, stopStt, soundList, textList, speech]);

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
                        <button className='DetectTest' onClick={clickDetect}>재시작</button>
                    </div>
                    <div className='DetectingHead'>
                        <button className='ESC' onClick={clickESC}><MdClear size={35}/></button>
                    </div>
                    <div className='DetectingBoxBody'>
                        <div className='ProgressIcon'>{detect || first ? <MdNotificationsActive size={100}/> : (<ReactLoading type={'spinningBubbles'} color={'#383838'} width={100} />)}</div>
                        <div className='ProgressText'>{detect || first ? '감지 되었습니다!' : '감지중 입니다.' }</div>
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
    }, [clickESC, clickDetect, renderTextList, renderSoundList, detect, first]);


    return (
        <>
                {open ? (<div className='Detecting'>
                    {renderModal()}
                    </div>) : null}
        </>
    );
}

export default DetectingModal;