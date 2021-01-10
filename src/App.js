import './App.css';
import { useState } from 'react';

function App() {

  const [words, setWords] = useState(["마이크 확인!"]);
  const [fingerprint, setFinger] = useState(0);
  const [target, setTarget] = useState([]);
  const [check, setCheck] = useState(false);
  const [pid, setPid] = useState(0);

  const startSTT = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.lang = 'ko-KR';

    recognition.start();

    recognition.onend = () => {
      recognition.start();
    }

    recognition.onresult = (e) => {
      let texts = Array.from(e.results)
      .map(result => result[0].transcript).join("");
      setWords(texts);
    }
  }

  const setCompressorValueIfDefined = (compressor, context, item, value) => {
		if (compressor[item] !== undefined && typeof compressor[item].setValueAtTime === 'function') {
			compressor[item].setValueAtTime(value, context.currentTime);
		}
	}

  const audioStart = (src, upload) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const analyser = audioCtx.createAnalyser();
    const compressor = audioCtx.createDynamicsCompressor();
    const gain = audioCtx.createGain();

    analyser.fftSize = 2048;
    analyser.minDecibels = -100;
    analyser.maxDecibels = -30;
    gain.gain.value = 0;

    setCompressorValueIfDefined(compressor, audioCtx, 'threshold', -50);
		setCompressorValueIfDefined(compressor, audioCtx, 'knee', 40);
		setCompressorValueIfDefined(compressor, audioCtx, 'ratio', 12);
		setCompressorValueIfDefined(compressor, audioCtx, 'reduction', -20);
		setCompressorValueIfDefined(compressor, audioCtx, 'attack', 0);
		setCompressorValueIfDefined(compressor, audioCtx, 'release', .25);

    if(upload){
      const source = audioCtx.createMediaElementSource(src);
      source.connect(compressor);
      compressor.connect(analyser);
      analyser.connect(gain);
      gain.connect(audioCtx.destination);
      src.play();  
    }

    else{
      navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
  
        function(stream){
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(compressor);
          compressor.connect(analyser);
          analyser.connect(gain);
          gain.connect(audioCtx.destination);
        },
  
        function(err) {
          console.log('The following gUM error occured: ' + err);
        }
      );
    }
    
    audioProcess(analyser, compressor, gain, upload);
  }

  const audioProcess = (analyser, compressor, gain, upload) => {
    const NFFT = analyser.fftSize;
    let bins = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(bins);
    let data = 0;
    for(let i = 100; i < NFFT / 2; i++){
      if(bins[i] < -80)
        continue;
      data += Math.abs(bins[i]);
    }
    
    data = Math.floor(data);

    if(!upload && data > 1000){
      for(let i = 0; i < target.length; i++){
        if(Math.abs(target[i] - data) < 5){
          setCheck(true);
          break;
        }
      }
    }
      
    if(data > 1000 && upload)
      setTarget(target => [...target, data]);
    else if(!upload)
      setFinger(data);
      
    // Disconnect the nodes from each other
    if(upload){
      //compressor.disconnect();
      //analyser.disconnect();
      //gain.disconnect();
    }

    const pid = setTimeout(() => {
        audioProcess(analyser, compressor, gain, upload);
    }, 100);

    if(upload){
      setPid(pid);
    }
  }

  const read_audio = (e) => {
    const selectFile = e.target.files[0];
    const sound = document.getElementById('sound');
    sound.src = URL.createObjectURL(selectFile);
    audioStart(sound, true);
  }

  const reset = () => {
    setCheck(false);
  }

  const startButton = () => {
    startSTT();
    audioStart(0, false);
  }

  const clear = () => {
    clearTimeout(pid);
  }

  return (
    <div className="App">
        <div>
          STT: {words}
          <br/>
          target: {target.map(tar => tar + " ")}
          <br/>
          fingerprint: {fingerprint}
          <input style={{display: 'block', margin: 'auto', marginTop: '10px', marginBottom: '15px'}} 
                 type='file' name='audio' onChange={read_audio}/>
          <audio style={{display: 'none', margin: 'auto', marginBottom: '15px'}}
                 id='sound' onEnded={clear} controls></audio>
          {check ? "감지되었습니다!" : ""}
          <button name="start" onClick={startButton}>Start!</button>
          <button name="reset" onClick={reset}>Reset!</button>
        </div>
    </div>
  );
}

export default App;
