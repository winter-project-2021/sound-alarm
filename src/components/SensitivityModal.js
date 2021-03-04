import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResult, getScoreServer } from '../modules/SensitivityResult';
import { updateSensitivity } from '../modules/SoundList';
import { FiCheckSquare } from 'react-icons/fi';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import toWav from 'audiobuffer-to-wav';
import trans from './lang';
import '../style/Sensitivity.scss';

function SensitivityModal() {

    const {open, id, score, name, scoreFromServer} = useSelector(state => state.setSensitivity);
    const { lang } = useSelector(state => state.preferenceReducer);
    const USER_ID = useSelector(state => state.updateLoginState.user._id);    
    const { loading } = useSelector(state => state.loading);
    const soundList = useSelector(state => state.updateSoundList.soundList);
    const [curScore, setCurScore] = useState(0);
    const [recorder, setRecorder] = useState(null);
    const [isRecord, setIsRecord] = useState(false);
    const [preventLoad, setPrevent] = useState(false);
    const marks = useMemo(() => [{value: 0, label: '0'}, {value: 100, label: '100'}], []);
    const dispatch = useDispatch();

    const findId = useCallback(() => {
        let itemId = id;
        if(itemId === null) {
            for(const item of soundList) {
                if(item.name === name) {
                    itemId = item.id;
                    break;
                }
            }
        }

        return itemId;
    }, [id, name, soundList]);

    // ok 버튼 누르면 result를 true로 하고 callback 실행
    const clickOk = useCallback(() => {
        let itemId = findId();
        setPrevent(false);
        if(curScore === null || isNaN(curScore)) setCurScore(score);
        dispatch(updateSensitivity({audioid: itemId, sensitivity: curScore, name: name, _id: USER_ID}));
        dispatch(setResult(true));
    }, [dispatch, findId, curScore, name, setPrevent,score, setCurScore, USER_ID]);

    // cancel 버튼 누르면 result false로
    const clickCancel = useCallback(() => {
        dispatch(setResult(false));
    }, [dispatch]);

    const valuetext = useCallback((value) => {
        return `${value}`;
    }, []);

    useEffect(() => {
        setCurScore(score);
    }, [score, setCurScore]);

    const onChangeSlide = useCallback((e, newValue) => {
        setCurScore(newValue);
    }, [setCurScore]);

    const audioStop = useCallback(() => {
        if(recorder === null) return;
        recorder.recorder.stop();
        recorder.context.close();
        recorder.stream[0].stop();
        setRecorder(null);
        setIsRecord(false);
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
            };

            mediaRecorder.onstop = function(e) {
                var blob = new Blob(chunks, { 'type' : 'audio/wav' });
                blob.arrayBuffer().then(buffer => {
                        audioCtx.decodeAudioData(buffer, function(b){
                        let wav = toWav(b);
                        //const fileData = JSON.stringify(wav);
                        const blob = new Blob([wav], {type: 'audio/wav'});
                        const form = new FormData();
                        form.append('data', blob);
                        form.append('_id', USER_ID);
                        form.append('audioid', String(findId()));
                        form.append('mode', 'test');
                        setPrevent(true);
                        dispatch(getScoreServer(form));
                    })
                });

                chunks=[];
            }

            if(!isRecord) {
                setIsRecord(true);
                mediaRecorder.start();     
            }
        },
  
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
        );
    }, [dispatch, setRecorder, setIsRecord, findId, setPrevent, USER_ID, isRecord]);

    const onMicClick = useCallback(() => {
        if(isRecord) audioStop();
        else audioStart();
    }, [isRecord, audioStart, audioStop]);

    const renderRecord = useCallback(() => {
        return (
            <div className='record'>
                <div className='outerCircle'>
                    <div className='innerCircle'></div>
                </div>
                <div className='recordText'>REC</div>
            </div>
        );
    }, []);

    const renderStop = useCallback(() => {
        return (
            <div className='stop'>
                <div className='square'></div>
                <div className='stopText'>STOP</div>
            </div>
        );
    }, []);

    const renderModal = useCallback(() => {
        return (<div className='SensitivityBox'>
                    <div className='SensitivityHead'>{`<${name}> ${trans[lang]['sensitivity'][1]}`}</div>
                    <div className='SensitivityBoxBody'>
                        <button className='Mic' onClick={onMicClick}>
                            {isRecord ? renderStop() : renderRecord()}
                        </button>
                        <div className='SensitivityDetail'>
                            <div className='ServerScore'>{trans[lang]['sensitivity'][2]}: {scoreFromServer ? Math.round(scoreFromServer) :
                             trans[lang]['sensitivity'][3]}</div>
                            <div className='SensitivitySlider' >
                                <Typography id="discrete-slider-small-steps" gutterBottom>
                                    {trans[lang]['sensitivity'][4]}
                                </Typography>
                                <Slider
                                    value={curScore}
                                    onChange={onChangeSlide}
                                    getAriaValueText={valuetext}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks={marks}
                                    min={0}
                                    max={100}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='Description'>
                        <div className='DescriptionItem'>
                            <FiCheckSquare size={25}/> 
                            <div className='Guide1'>
                                {trans[lang]['sensitivity'][5]}
                            </div>
                        </div> 
                        <div className='DescriptionItem'>
                            <FiCheckSquare size={25}/> 
                            <div className='Guide2'>
                                {trans[lang]['sensitivity'][6]}
                            </div>
                        </div> 
                        <div className='DescriptionItem'>
                            <FiCheckSquare size={25}/> 
                            <div className='Guide3'>
                                {trans[lang]['sensitivity'][7]}
                            </div>
                        </div> 
                    </div>
                    <div className={'SensitivityButton SensitivityDoubleBox'}>
                        <button className='Button first' onClick={clickOk}>{trans[lang]['apply']}</button>
                        <button className='Button second' onClick={clickCancel}>{trans[lang]['cancel']}</button>
                    </div>
                </div>)
    }, [clickOk, clickCancel, curScore, onChangeSlide, valuetext, scoreFromServer, onMicClick, name, isRecord, marks, renderRecord, renderStop]);

    return (
        <>
            {(open && (!loading || preventLoad)) ? (<div className='Sensitivity'>
                        {renderModal()}
                       </div>) : null}
        </>
    );
}

export default SensitivityModal;