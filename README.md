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

