import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResult, getScoreServer } from '../modules/SensitivityResult';
import { updateSensitivity } from '../modules/SoundList';
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { FiCheckSquare } from 'react-icons/fi';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import toWav from 'audiobuffer-to-wav';
import '../style/Sensitivity.scss';

function SensitivityModal() {

    const {open, id, score, name, scoreFromServer} = useSelector(state => state.setSensitivity);
    const soundList = useSelector(state => state.updateSoundList.soundList);
    const [curScore, setCurScore] = useState(0);
    const [recorder, setRecorder] = useState(null);
    const [isRecord, setIsRecord] = useState(false);
    const marks = useMemo(() => [{value: 0, label: '0'}, {value: 20, label: '20'}], []);
    const dispatch = useDispatch();

    // ok 버튼 누르면 result를 true로 하고 callback 실행
    const clickOk = useCallback(() => {
        let itemId = id;
        if(itemId === null) {
            for(const item of soundList) {
                if(item.name === name) {
                    itemId = item.id;
                    break;
                }
            }
        }
        dispatch(updateSensitivity({id: itemId, score: curScore}));
        dispatch(setResult(true));
    }, [dispatch, id, curScore, soundList, name]);

    // cancel 버튼 누르면 result false로
    const clickCancel = useCallback(() => {
        dispatch(setResult(false));
    }, [dispatch]);

    const valuetext = useCallback((value) => {
        return `${value}`;
    }, []);

    useEffect(() => {
        setCurScore(score);
    }, [score]);

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
            source.connect(dest);
            let chunks = [];
          
            mediaRecorder.ondataavailable = function(evt) {
            // push each chunk (blobs) in an array
                chunks.push(evt.data);
                var blob = new Blob(chunks, { 'type' : 'audio/wav' });
                blob.arrayBuffer().then(buffer => {
                        audioCtx.decodeAudioData(buffer, function(b){
                        let wav = toWav(b);
                        //const fileData = JSON.stringify(wav);
                        const blob = new Blob([wav], {type: 'audio/wav'});
                        dispatch(getScoreServer({id: id, blob: blob}));
                    })
                })

                chunks=[]
            };

            mediaRecorder.start();
            setIsRecord(true);

        },
  
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
        );
    }, [dispatch, id, setRecorder, setIsRecord]);

    const onMicClick = useCallback(() => {
        if(isRecord) audioStop();
        else audioStart();
    }, [isRecord, audioStart, audioStop]);

    const renderModal = useCallback(() => {
        return (<div className='SensitivityBox'>
                    <div className='SensitivityHead'>{`<${name}> 의 민감도 설정`}</div>
                    <div className='SensitivityBoxBody'>
                        <button className='Mic' onClick={onMicClick}>
                            {isRecord ? <FaMicrophoneAltSlash size={85}/> : <FaMicrophoneAlt size={85}/>}
                        </button>
                        <div className='SensitivityDetail'>
                            <div className='ServerScore'>현재 점수: {scoreFromServer ? scoreFromServer : '측정 전 입니다.'}</div>
                            <div className='SensitivitySlider' >
                                <Typography id="discrete-slider-small-steps" gutterBottom>
                                    민감도 설정
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
                                    max={20}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='Description'>
                        <div className='DescriptionItem'>
                            <FiCheckSquare size={25}/> 
                            <div className='Guide1'>
                                마이크 버튼을 클릭하여 현재 기기를 통한 소리를 입력하고 녹음을 종료합니다
                            </div>
                        </div> 
                        <div className='DescriptionItem'>
                            <FiCheckSquare size={25}/> 
                            <div className='Guide2'>
                                민감도를 낮출수록 소리의 구분이 정확해지지만 인식되는 빈도가 낮아질 수 있습니다
                            </div>
                        </div> 
                        <div className='DescriptionItem'>
                            <FiCheckSquare size={25}/> 
                            <div className='Guide3'>
                                만약 출력되는 점수가 15 이상이 반복된다면, 녹음 파일이나 현재 기기를 조정할 것을 추천드립니다
                            </div>
                        </div> 
                    </div>
                    <div className={'SensitivityButton SensitivityDoubleBox'}>
                        <button className='Button' onClick={clickOk}>적용</button>
                        <button className='Button' onClick={clickCancel}>취소</button>
                    </div>
                </div>)
    }, [clickOk, clickCancel, curScore, onChangeSlide, valuetext, scoreFromServer, onMicClick, name, isRecord, marks]);

    return (
        <>
            {open ? (<div className='Sensitivity'>
                        {renderModal()}
                       </div>) : null}
        </>
    );
}

export default SensitivityModal;