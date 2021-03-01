import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOpen } from '../modules/ModalResult';
import { addItem, removeItem, updateItem } from '../modules/SoundList';
import { setOpenSensitivity } from '../modules/SensitivityResult';
import SoundListItem from './SoundListItem';
import { FiUpload, FiCheckSquare } from "react-icons/fi";
import { MdAddBox } from "react-icons/md";
import '../style/SoundSetting.scss';

function SoundSetting() {

    const DEFAULT_FILENAME = useMemo(() => '파일 업로드', []);
    const FILE_LIMIT = useMemo(() => 300 * 1024, []); // 300kb
    const USER_ID = useSelector(state => state.updateLoginState.user._id);
    const MAX_AUDIO = useMemo(() => 5, []);

    // redux로 부터 소리파일이름 리스트를 가져옴
    const soundList = useSelector(state => state.updateSoundList.soundList);
    const dispatch = useDispatch();

    const [item, setItem] = useState(-1); // 현재 클릭한 항목
    const [update, setUpdate] = useState(false); // 현재 수정 중 인가
    const [isDelete, setDelete] = useState(false); // 현재 삭제 중 인가
    const [fileName, setFileName] = useState(DEFAULT_FILENAME); // 현재 업로드한 file name
    const [alias, setAlias] = useState(''); // 현재 작성 중인 파일 alias
    const [blob, setBlob] = useState(null); // 현재 업로드하려는 파일

    const clickAway = useCallback((e) => {
        const parent = e.target.parentNode;
        if(!(parent.className === 'SoundListItem' || parent.className === 'ChangeButton' || 
            (parent.parentNode !== null && parent.parentNode.className === 'ChangeButton'))){
            setItem(-1);
        }
    }, [setItem])

    // 리스트 아이템 영역 밖을 클릭 시 선택 해제 하도록
    useEffect(() => {
        if(update || isDelete) document.removeEventListener('mouseup', clickAway);
        else{
            document.addEventListener('mouseup', clickAway);
        }
    }, [clickAway, update, isDelete]);

    const clickItem = useCallback((i) => {
        
        // update 혹은 delete 중이면 클릭 무시
        if(update || isDelete)
            return;
        
        // 현재 클릭 중인 아이템 클릭 시 취소
        // 그 이외는 그 항목을 선택
        if(i === item){
            setItem(-1);
        }
        else{
            setItem(i);
        }
        
    }, [setItem, item, update, isDelete]);

    const updateName = useCallback((i, alias, score) => {
        // 항목 업데이트 후 클릭 항목 초기화
        const newItem = {_id: USER_ID, audioid: i, sensitivity: score, name: alias};
        dispatch(updateItem(newItem));
        setItem(-1);
    }, [dispatch, setItem, USER_ID]);

    const deleteName = useCallback((i) => {
        // 항목 삭제 후 클릭 항목 초기화
        const item = {data:{_id: USER_ID, audioid: i}};
        dispatch(removeItem(item));
        setItem(-1);
    }, [setItem, dispatch, USER_ID]);

    const renderList = useCallback(() => {
        
        // list가 비어 있으면 추가해 달라는 문구 출력
        if(soundList.length === 0){
            return null;
        }
        //console.log(soundList[0].blob);
        //console.log(JSON.parse(soundList[0].blob));
        // soundList를 이용해 각 listItem 컴포넌트를 렌더링
        return soundList.map(ele => <SoundListItem name={ele.name}
                                                    key={ele.id}
                                                    clickItem={clickItem}
                                                    order={ele.id}
                                                    isClick={ele.id === item}
                                                    blob={(ele.blob)}
                                                    score={ele.score}
                                                    updateName={updateName}
                                                    deleteName={deleteName}
                                                    setUpdate={setUpdate}
                                                    setDelete={setDelete}/>)
    }, [soundList, item, clickItem, updateName, deleteName, setUpdate, setDelete]);

    const uploadAudio = useCallback((e) => {
        // 로컬에서 오디오 파일 업로드
        const selectFile = e.target.files[0];
        if(selectFile === null) return;

        if(selectFile.hasOwnProperty("size") && selectFile.size > FILE_LIMIT) {
            const popup = {
                head: '업로드 실패',
                body: '파일의 용량이 큽니다! 300kb 이하의 파일을 업로드하세요!',
                buttonNum: 1,
                callback: () => {},
                headColor: '#ff3547',
                btn1Color: '#f2f3f4',
                btn2Color: null,
                btn1Text: '#000000',
                btn2Text: null,
            };

            // popup open
            dispatch(setOpen(popup));
            return;
        }

        if(soundList.length === MAX_AUDIO) {
            const popup = {
                head: '업로드 실패',
                body: `최대 ${MAX_AUDIO}개의 파일만 등록할 수 있습니다!`,
                buttonNum: 1,
                callback: () => {},
                headColor: '#ff3547',
                btn1Color: '#f2f3f4',
                btn2Color: null,
                btn1Text: '#000000',
                btn2Text: null,
            };

            // popup open
            dispatch(setOpen(popup));
            return;
        }

        setBlob(selectFile);
        setFileName(String(selectFile.name));
        setAlias(String(selectFile.name));
        e.target.value = "";
        
    }, [setFileName, setAlias, setBlob, FILE_LIMIT, dispatch, soundList, MAX_AUDIO]);

    const writeName = useCallback((e) => {
        // 파일 이름 변경
        setAlias(e.target.value);
    }, [setAlias]);

    const addToList = useCallback(() => {
        // 현재 파일이 업로드 되지 않았거나 이름이 비어있으면 무시
        if(fileName === DEFAULT_FILENAME || alias === '')
            return;
        // 이미 있는 이름이면 무시
        for(const sound of soundList){
            if(sound.name === alias) {
                const popup = {
                    head: '업로드 실패',
                    body: '같은 이름으로 등록할 수 없습니다!',
                    buttonNum: 1,
                    callback: () => {},
                    headColor: '#ff3547',
                    btn1Color: '#f2f3f4',
                    btn2Color: null,
                    btn1Text: '#000000',
                    btn2Text: null,
                };

                // popup open
                dispatch(setOpen(popup));
                return;
            }
        }
        // 항목 추가
        const item = new FormData();
        item.append("name", alias);
        item.append("_id", USER_ID);
        item.append("data", blob);

        dispatch(addItem(item));
        setAlias('');
        setFileName(DEFAULT_FILENAME);
        setBlob(null);
        dispatch(setOpenSensitivity({id: null, name: alias, score: 60}));
    }, [dispatch, setAlias, setFileName, setBlob, fileName, alias, soundList, blob, DEFAULT_FILENAME, USER_ID]);

    return (
        <div className='SoundComponent'>
            <div className='SoundList'>
                {renderList()}
                {soundList.length < MAX_AUDIO ? (<div className='FileUpload' style={{marginTop: soundList.length * 60 + 25}}>
                    <label className='UploadButton' htmlFor='audio'>{fileName} <FiUpload className='Icon'/></label>
                    <input type='file' id='audio' accept="audio/*" style={{display: 'none'}} onChange={uploadAudio}/>
                    <input type='text' name='alias' className='NameInput' 
                        placeholder='이름을 입력해주세요' value={alias} onChange={writeName}/>
                    <MdAddBox name='submit' className='AddButton' size={40} color={'grey'} onClick={addToList}/>
                </div>) : null}
                {soundList.length === 0 ? (<div className='Empty'>새로운 소리 파일을 추가해 주세요!</div>) : null}
            </div>
          
            <div className='Notify'>
                <div className='NotifyItem'>
                    <FiCheckSquare size={20}/>
                    <div className='Guide1'>
                        {`파일은 최대 ${MAX_AUDIO}개 까지 등록할 수 있습니다.`}
                    </div>
                </div>
                <div className='NotifyItem'>
                    <FiCheckSquare size={20}/>
                    <div className='Guide2'>
                        {`파일 하나의 최대 용량은 300KB 입니다.`}
                    </div>
                </div>
            </div>          
        </div>
    );
}

export default SoundSetting;