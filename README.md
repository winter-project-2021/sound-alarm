# main merge 상황
  1. 소리 파일 설정 부분 서버 통신 제외한 기능 구현 후 merge
  2. 기본적인 redux 세팅
  3. Card.js 함수들 useCallback으로 최적화 및 start button 추가
  4. 사이드 탭 버튼 하이라이트 추가
  5. modal component 추가
  6. modal custom 추가
  7. persist redux 추가 ( redux 사용 시의 차이점은 없음, store에만 처리를 해준거라서 사용하던대로 사용하면 됨, 이제 새로고침해도 redux 상태 유지됨)

## modal component 사용법
  
  import { useDispatch } from 'react-redux';  
  import { setOpen } from '../modules/ModalResult';  
  
  const dispatch = useDispatch();
  
  // 팝업 객체  
  const popup = {  
       head: 팝업 제목,  
       body: 팝업창 본문,  
       callback: ok 버튼을 눌렀을 때 실행할 함수, 없으면 그냥 이 프로퍼티는 빼고 객체를 만들거나 빈 함수 넣어주면 됨,  
       buttonNum: 버튼 개수, 1또는 2 넣어주면 됨, 만약 이 프로퍼티를 빼고 만들면 기본적으로 버튼 2개짜리 팝업이 만들어짐  
       cancelCallback: 취소 버튼 눌렀을 때 실행할 함수, 없으면 이 프로퍼티는 빼고 객체를 만들거나 빈 함수 넣어주면 됨  
  };

   // popup open  
   dispatch(setOpen(popup));  
  
# Template 설명

## 프로젝트 구조
  1. src - 스크립트들이 들어있는 디렉토리
  
  2. src/components - 각각의 컴포넌트들(예를 들면 로그인 화면, 소리 설정 화면 등)이 들어있는 디렉토리
  
  3. src/style - 각각의 scss(즉 style코드) 가 들어있는 디렉토리
  
  4. src/modules - 나중에 리덕스 모듈들을 넣을 디렉토리
  
  5. src/App.js - 최상위 컴포넌트(초반에는 특별히 건들일 없음)
  
## components directory
  1. Card.js - 메인 card frame으로 여기에서 각각의 컴포넌트들을 렌더링해서 보여줌
  
  2. Error.js - 뭔가 오류가 발생했을 때 보여줄 페이지
  
  3. 나머지 - 각각의 기능 (로그인, 텍스트, 소리 설정, 개인 설정) 에 대한 설정 화면
  
  4. reference.js - 이전 test 코드, 참고용 코드
  
## 기본 방향
  1. 우선 개발할 컴포넌트 스크립트를 수정하며 적용하면 된다
  
  2. 각각의 stylesheet는 style 폴더에, 추가 컴포넌트가 필요하면 component 폴더에 추가하면 된다
  
  3. 이 템플릿 commit을 기본으로 받아서 branch를 만들고 작업을 한다(나중에 merge후에 main에 커밋할 때만 미리 말해주기)
  
  4. 주석 보면 대충 다 이해할 수 있을 것 같은데, 모르면 바로 바로 물어보기
  
# Code 실행해보기

  1. project dir 가서 yarn start로 실행
  
  2. localhost:3000으로 접속
  
  3. 열심히 코딩!

