import { useState } from 'react';
import toWav from 'audiobuffer-to-wav';
import writeFileP from "write-file-p";

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
      // 리덕스에 text 등록한거
      // texts 안에 있는 원소중에 등록한게 있는지 
      // 있으면 card.js 에 있는 함수 해서 알람 울리게
      setWords(texts);
    }
  }

  const setCompressorValueIfDefined = (compressor, context, item, value) => {
		if (compressor[item] !== undefined && typeof compressor[item].setValueAtTime === 'function') {
			compressor[item].setValueAtTime(value, context.currentTime);
		}
	}

  const audioStart = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var a = document.querySelector('.a')
    var b = document.querySelector('.b');

    navigator.getUserMedia(
        {
          audio: true,
          video: false,
        },
  
        function(stream){
          var source = audioCtx.createMediaStreamSource(stream);
          var dest = audioCtx.createMediaStreamDestination();
          var mediaRecorder = new MediaRecorder(dest.stream);
          source.connect(dest);
          let chunks = [];
          mediaRecorder.ondataavailable = function(evt) {
          // push each chunk (blobs) in an array
            chunks.push(evt.data);
            var blob = new Blob(chunks, { 'type' : 'audio/wav' });
            blob.arrayBuffer().then(buffer => {
              audioCtx.decodeAudioData(buffer, function(b){
                let wav = toWav(b);
                const fileData = JSON.stringify(wav);
                const blob = new Blob([wav], {type: 'audio/wav'});
                const url = URL.createObjectURL(blob);
                //console.log(wav);
                var link = document.querySelector('.link');
                link.href = url;
                link.download = 'test.wav';

              })
            })

            chunks=[]
          };

          a.addEventListener('click', (e) => {
            mediaRecorder.start();
          })

          b.addEventListener('click', (e) => {
            mediaRecorder.stop();
          })

        },
  
        function(err) {
          console.log('The following gUM error occured: ' + err);
        }
      );
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
    //startSTT();
    audioStart(0, false);
  }

  const clear = () => {
    clearTimeout(pid);
  }

  return (
    <div style={{textAlign: 'center'}}>
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
          <button className='a' name="reset">SSSSS</button>
          <button className='b' name="reset">Reset!</button>
          <a className='link'>!link!</a>
        </div>
    </div>
  );
}

export default App;
