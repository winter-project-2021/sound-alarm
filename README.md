# Test 해본 결과

## Web speech api

 1. api test 결과 정상 작동함(다만 stackoverflow에 따르면 chrome버전에 따라 좀 구버전은 안 될수도 있다고 함)
 
 2. speech-to-text로도 양호하게 인식함
 
 3. 다만 작은 음량은 인식을 잘 못해서 음량 증폭과 관련되서는 고찰이 필요할 듯
 
## AudioFingerPrint

  1. FingerPrinting을 적용하는 방식이 크게 front에서 직접하기/back으로 audio를 보내서 back에서 하기
  
  2. 이번 test에서는 web-audio-api를 이용한 front-fingerprinting을 test해봤음
     
     참고 url: https://github.com/rickmacgillis/audio-fingerprint/blob/master/audio-fingerprinting.js, https://iq.opengenus.org/audio-fingerprinting/
  
  3. 결과적으로 성능이 굉장히 안 좋음
    
     우선 front에서 fingerprint를 적용하려면 외부 라이브러리를 거의 못씀(대부분의 fingerprint open source들이 순수 node js, 아니면 c#, python으로 구현)
     
     web-audio-api 자체가 fingerprinting에 쓸만한 커스터마이징은 또 잘 안 됨    
     
     또한 이번 테스트에서는 realtime streaming에 대한 결과를 바로 적용했는데 라이브러리 코드들 보면 대부분 파일 하나 단위로 그 안에서 context를 만들고 계산을 하다보니
     이를 그냥 그대로 적용해보니 결과가 좋지 않음
     
     참고 url: https://github.com/adblockradio/stream-audio-fingerprint   
     
     기본적으로 이것도 작은 음량 잘 인식 못함
  
  4. 개선 방향
     
     우선은 좀더 well-made된 라이브러리를 사용하는게 나으므로 back으로 audio data를 보내서 거기서 라이브러리를 사용해 결과를 반환하는게 나을 것 같음
     참고 url: https://github.com/parshap/node-fpcalc, https://github.com/adblockradio/stream-audio-fingerprint, 
               https://willdrevo.com/fingerprinting-and-audio-recognition-with-python/
     
     node js에서 애초에 다른 언어의 프로그램 돌릴 수 있긴 하므로 그런 방법들 찾아서 꼭 js 기반이 아니라 다른 언어 기반 방식도 적용해보면 좋음(이건 front에서는 불가)
     
     그리고 이건 front에서도 test해볼만 하긴 한데 audio streaming을 그대로 적용하지 않고 특정 db이상의 소리가 측정됬을 때 그 시점을 기준으로 예를 들면 3-5초간 녹음하고 이를
     mp3, wav 형태로 인코딩한 결과를 이용해서 back/front에서 처리하는 것이 나아 보임
     
     참고 url: https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/
     
# Test Code 실행해보기

  1. project dir 가서 yarn start로 실행
  
  2. localhost:3000으로 접속
  
  3. 그리고 나서 start! 버튼 클릭
  
  4. 여기까지 하면 STT와 realtime audiofingerprint(front version) 사용 가능
  
  5. 파일 업로드 버튼을 통해 audio file 업로드하면 target에 해당 파일의 fingerprint list가 출력됨
  
  6. target에 있는 fingerprint가 감지되면 "감지되었습니다!" 라는 문구 출력, 이는 reset! 버튼으로 다시 없앨 수 있음


