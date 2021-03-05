import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCloseDetecting, setResult, getMatchServer } from '../modules/DetectingResult';
import ReactLoading from 'react-loading';
import { MdClear, MdNotificationsActive, MdRefresh } from "react-icons/md";
import toWav from 'audiobuffer-to-wav';
import trans from './lang';
import '../style/Detecting.scss';


function DetectingModal() { 

    const { open, detect, name, } = useSelector(state => state.setDetecting)
    const textList = useSelector(state => state.updateTextList.textList);
    const soundList = useSelector(state => state.updateSoundList.soundList)
    const { sound, push, volume, lang, bell } = useSelector(state => state.preferenceReducer);
    const bellTypes = useMemo(() => ({"0": "/alarm.mp3", "1": "/alarm2.mp3", "2": "/alarm3.mp3",}), []);
    const USER_ID = useSelector(state => state.updateLoginState.user._id); 
    const [isRecord, setIsRecord] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);
    const [recorder, setRecorder] = useState(null);
    const [first, setFirst] = useState(false);
    const [speech, setSpeech] = useState(null);
    const [detectName, setDetectName] = useState("");
    
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
        setResult({match: false, name: ""});
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
                        }, 10000);
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
                }, 10000);
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
        if(!detect && open) {
            speech.start();
        }
        else {
            speech.stop();
            setSpeech(null);
            speech.stop();
        }
        
    }, [setSpeech, speech, detect, open]);

    const startSTT = useCallback(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

        recognition.interimResults = true;
        recognition.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
        setSpeech(recognition);
        recognition.start();

        recognition.onresult = (e) => {
            let texts = String(Array.from(e.results)
            .map(result => result[0].transcript).join(""));
            const split = texts.split(" ");
            for(const text of split) {
                for(const t of textList) {
                    if(t.text === text) {
                        dispatch(setResult({match: true, name: text}));
                        recognition.stop();
                        return;
                    }
                }
            }
        }
    }, [textList, dispatch, lang,]);

    const clickDetect = useCallback(() => {
        if(!detect && !first) return;
        dispatch(setResult({match: false, name: ""}));
        setFirst(false);
        audioStart();
        startSTT();
    }, [dispatch, setFirst, audioStart, startSTT, detect, first]);

    const testAlarm = useCallback(() => {
        if(sound){
            const sound = document.getElementById('alarm');
            sound.src = bellTypes[bell];
            sound.volume = volume / 100;
            sound.play();
        }

        if(push){
            var options = {
                body: detectName + " " + trans[lang]['push'][0],
                icon: "/faviconcircle.png",
                dir: "ltr"
            };
            
            new Notification("Sound Alarm!", options);
        }
    }, [push, sound, volume, bell, bellTypes, detectName, lang]);

    const setDetected = useCallback(() => {
        if(String(name).length > 0) setDetectName(String(name));
    }, [name, setDetectName]);

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
            setDetected();
            audioStop();
            stopStt();
            testAlarm();            
        }

        if(speech !== null) {
            speech.onend = () => {
                stopStt();                
            }
        }
    }, [audioStart, audioStop, open, isStart, setIsStart, detect, testAlarm, first, setFirst, startSTT, stopStt,
         soundList, textList, speech, setDetected]);

    const renderTLI = useCallback((i, idx) => {
        return <div className='DetectTextListItem' key={idx}>{i}</div>
    }, []);

    const renderSLI = useCallback((i, idx) => {
        return <div className='DetectSoundListItem' key={idx}>{i}</div>
    }, []);

    const renderTextList = useCallback(() => {
        if(textList.length === 0){
            return;
        }
    
        return (textList.map((ele, idx) => renderTLI(ele.text, idx)));
    }, [textList, renderTLI])

    const renderSoundList = useCallback(() => {
        if(soundList.length === 0){
            return;
        }
    
        return (soundList.map((ele, idx) => renderSLI(ele.name, idx)));
    }, [soundList, renderSLI]);


    const renderModal = useCallback(() => {
        return (<div className='DetectingBox'>
                    <div className='Retry'>
                        <MdRefresh onClick={clickDetect} size={50}/>
                    </div>
                    <div className='DetectingHead'>
                        <button className='ESC' onClick={clickESC}><MdClear size={35}/></button>
                    </div>
                    <div className='DetectingBoxBody'>
                        <div className='ProgressIcon'>{detect || first ? <MdNotificationsActive size={100}/> : (<ReactLoading type={'spinningBubbles'} color={'#383838'} width={100} />)}</div>
                        <div className='ProgressText'>{detect || first ? (detectName + " " + trans[lang]['detecting'][1]) : trans[lang]['detecting'][0] }</div>
                    </div>
                    <div className='DetectInfo'>
                        <div className='DetectInfoText'>{trans[lang]['detecting'][3]}
                            <div className='DetectTextList'>{renderTextList()}</div>
                        </div>
                        <div className='DetectInfoSound'>{trans[lang]['detecting'][2]}
                            <div className='DetectSoundList'>{renderSoundList()}</div>

                        </div>
                    </div>
                </div>)
    }, [clickESC, clickDetect, renderTextList, renderSoundList, detect, first, lang, detectName]);


    return (
        <>
                {open ? (<div className='Detecting'>
                    {renderModal()}
                    </div>) : null}
        </>
    );
}

export default DetectingModal;