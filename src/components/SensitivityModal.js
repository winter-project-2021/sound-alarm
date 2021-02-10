import { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setResult, getScoreServer } from '../modules/SensitivityResult';
import { updateSensitivity } from '../modules/SoundList';
import Slider from '@material-ui/core/Slider';
import toWav from 'audiobuffer-to-wav';
import '../style/Sensitivity.scss';

function SensitivityModal() {

    const {open, id, score, name, scoreFromServer} = useSelector(state => state.setSensitivity);
    const soundList = useSelector(state => state.updateSoundList.soundList);
    const [curScore, setCurScore] = useState(0);
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

    const audioStart = useCallback(() => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const stop = document.querySelector('.Stop');

        navigator.getUserMedia(
        {
            audio: true,
            video: false,
        },
  
        function(stream){
            const source = audioCtx.createMediaStreamSource(stream);
            const dest = audioCtx.createMediaStreamDestination();
            const mediaRecorder = new MediaRecorder(dest.stream);
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
          
            stop.addEventListener('click', (e) => {
                mediaRecorder.stop();
            });

            mediaRecorder.start();

        },
  
        function(err) {
            console.log('The following gUM error occured: ' + err);
        }
        );
    }, [dispatch, id]);

    const renderModal = useCallback(() => {
        return (<div className='SensitivityBox'>
                    <div className='SensitivityHead'>{name + " 의 민감도 설정"}</div>
                    {/*<div className='BoxBody'>{body}</div>*/}
                    <button className='Record' onClick={audioStart}>녹음 시작</button>
                    <button className='Stop'>녹음 종료</button>
                    <div>현재 점수: {scoreFromServer ? scoreFromServer : '측정 전 입니다.'}</div>
                    <Slider
                        value={curScore}
                        onChange={onChangeSlide}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={20}
                    />
                    <div className={'SensitivityButton SensitivityDoubleBox'}>
                        <button className='Button' onClick={clickOk}>적용</button>
                        <button className='Button' onClick={clickCancel}>취소</button>
                    </div>
                </div>)
    }, [clickOk, clickCancel, curScore, onChangeSlide, valuetext, scoreFromServer, audioStart, name]);

    return (
        <>
            {open ? (<div className='Sensitivity'>
                        {renderModal()}
                       </div>) : null}
        </>
    );
}

export default SensitivityModal;