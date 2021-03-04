const trans = {
    'ko': {
        ok: '확인',
        cancel: '취소',
        apply: '적용',
        init: '초기화',
        start: '시작',
        stop: '정지',
        name: '이름 변경',
        sens: '민감도 변경',
        loginSuccess: ['로그인 성공', '환영합니다! ', '님'],
        loginFail: ['로그인 실패', '로그인에 실패하였습니다.'],
        menu: ['가이드', '텍스트 설정', '소리 설정', '설정'],
        guide: [],
        text: ['새로운 텍스트를 추가해 주세요!', '이름을 입력해 주세요', '텍스트는 최대 10개까지 등록할 수 있습니다'],
        sound: ['새로운 소리 파일을 추가해 주세요!', '파일 업로드', '이름을 입력해 주세요', '파일은 최대 5개까지 등록할 수 있습니다.', 
                '파일 하나의 최대 용량은 300KB 입니다.'],
        setting: ['알림 소리 설정', '알림 푸쉬 설정', '마이크 테스트', '로그아웃', '벨소리 설정', '알람 1', '알람 2', '알람 3'],
        sensitivity: ['민감도', '의 민감도 설정', '현재 점수', '측정 전 입니다.', '민감도 설정', '녹음 버튼을 클릭하여 현재 마이크를 통해 소리를 입력하고 녹음을 종료합니다.',
                      '민감도를 높일수록 소리의 구분이 정확해지지만 인식되는 빈도가 낮아질 수 있습니다.', 
                      '만약 출력되는 점수가 60 이하가 반복된다면, 녹음 파일이나 현재 기기를 조정할 것을 추천드립니다.'],
        uploadFail: ['업로드 실패', '같은 이름으로 등록할 수 없습니다!', '', '최대 10개의 문자만 등록할 수 있습니다!', '파일의 용량이 큽니다! 300kb 이하의 파일을 업로드하세요!', 
                    '최대 5개의 파일만 등록할 수 있습니다!', ],
        delete: ['삭제하시겠습니까?', '을(를) 정말로 삭제하시겠습니까?,', '삭제'],
        logout: ['로그아웃 성공', '로그아웃에 성공하였습니다'],
        detecting: ['감지 중입니다.', '감지 되었습니다!', '음성 목록', '텍스트 목록'],
    },
    'en': {
        ok: 'OK',
        cancel: 'Cancel',
        apply: 'Apply',
        init: 'Initialize',
        start: 'Start',
        stop: 'Stop',
        name: 'Rename',
        sens: 'Modify Sensitivity',
        loginSuccess: ['Login Successful', 'Welcome! ', ''],
        loginFail: ['Login Failed', 'Login Faiiled'],
        menu: ['Guide', 'Text', 'Sound', 'Setting'],
        guide: [],
        text: ['Please add new text!', 'Please enter the name', 'You can register up to 10 words.'],
        sound: ['Please add new sound files!', 'Upload file', 'Please enter the name', 'You can upload up to 5 files.', 
                'The maximum capacity of a single file is 300 KB.'],
        setting: ['Alarm sound', 'Alarm push', 'Microphone test', 'Logout', 'Ring Tone Settings', 'Alarm 1', 'Alarm 2', 'Alarm 3'],
        sensitivity: ['Sensitivity', '\' sensitivity', 'Current score', 'Before the measurement', 'Sensitivity', 
                      'Click the Record button to enter the sound through the current microphone and exit the recording.',
                      'The higher the sensitivity, the more accurate the classification of sounds, but the frequency of recognition may decrease', 
                      'If the printed score is repeated below 60, we recommend adjusting the recording file or current device.'],
        uploadFail: ['Upload failed', 'Unable to register with the same name!', '', 'You can register up to 10 words.',
                     'The file has a large capacity! Upload files below 300kb!', 
                    'You can upload up to 5 files.', ],
        delete: ['Delete?', 'Are you sure you want to delete ', 'Delete'],
        logout: ['Logout Successful', 'Logout Successful!'],
        detecting: ['Detecting..', 'Detected!', 'Sound List', 'Text List'],
    },
};

export default trans;