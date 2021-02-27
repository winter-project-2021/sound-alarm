import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateItem } from '../modules/TextList';
import TextListItem from './TextListItem';
import { setOpen } from '../modules/ModalResult';
import { FiCheckSquare } from "react-icons/fi";
import { MdAddBox } from "react-icons/md";
import '../style/TextSetting.scss';

function TextSetting() {

    // redux로 부터 text이름 리스트를 가져옴
    const textList = useSelector(state => state.updateTextList.textList);
    const USER_ID = useSelector(state => state.updateLoginState.user._id);
    const MAX_TEXT = useMemo(() => 10, []);
    const dispatch = useDispatch();

    const [item, setItem] = useState(-1); // 현재 클릭한 항목
    const [update, setUpdate] = useState(false); // 현재 수정 중 인가
    const [isDelete, setDelete] = useState(false); // 현재 삭제 중 인가
    const [alias, setAlias] = useState(''); // 현재 작성 중인 파일 alias

    const clickAway = useCallback((e) => {
        const parent = e.target.parentNode;
        if(!(parent.className === 'TextListItem' || parent.className === 'ChangeButton' || 
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

    const updateName = useCallback((i, alias) => {
        // 항목 업데이트 후 클릭 항목 초기화
        const newItem = {_id: USER_ID, text: alias, textid: i};
        dispatch(updateItem(newItem));
        setItem(-1);
    }, [dispatch, setItem, USER_ID]);

    const deleteName = useCallback((i) => {
        // 항목 삭제 후 클릭 항목 초기화
        const item = {data:{_id: USER_ID, textid: i}};
        dispatch(removeItem(item));
        setItem(-1);
    }, [setItem, dispatch, USER_ID]);

    const renderList = useCallback(() => {
        
        // list가 비어 있으면 추가해 달라는 문구 출력
        if(textList.length === 0){
            return <div className='Empty'>새로운 텍스트를 추가해 주세요!</div>
        }

        // textList를 이용해 각 listItem 컴포넌트를 렌더링
        return textList.map(ele => <TextListItem name={ele.text}
                                                    clickItem={clickItem}
                                                    order={ele.id}
                                                    isClick={ele.id === item}                                                    
                                                    updateName={updateName}
                                                    deleteName={deleteName}
                                                    setUpdate={setUpdate}
                                                    setDelete={setDelete}/>)
    }, [textList, item, clickItem, updateName, deleteName, setUpdate, setDelete]);

    const writeName = useCallback((e) => {
        // 파일 이름 변경
        setAlias(e.target.value);
    }, [setAlias]);

    const addToList = useCallback(() => {
        // 이름이 비어있으면 무시
        if(alias === '')
            return;
        // 이미 있는 이름이면 무시
        for(const text of textList){
            if(text.text === alias) {
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
        if(textList.length === MAX_TEXT) {
            const popup = {
                head: '알림!',
                body: `최대 ${MAX_TEXT}개의 문자만 등록할 수 있습니다!`,
                buttonNum: 1,
                headColor: '#ff3547',
                btn1Color: '#f2f3f4',
                btn2Color: null,
                btn1Text: '#000000',
                btn2Text: null,        
                callback: () => {},
            };

            // popup open
            dispatch(setOpen(popup));
            return;
        }

        // 항목 추가f
        const item = new FormData();
        item.append("_id", USER_ID);
        item.append("text", alias);
        dispatch(addItem(item));
        setAlias('');
    }, [dispatch, setAlias, alias, textList, USER_ID, MAX_TEXT]);

    const renderTextAdd = useCallback(() => {
        if(textList.length === MAX_TEXT) {
            return;
        }

        return (<div className='FileUpload'>
        <input type='text' name='alias' className='NameInput' 
                placeholder='이름을 입력해주세요' value={alias} onChange={writeName}/>
        <MdAddBox name='submit' className='AddButton' size={40} color={'grey'} onClick={addToList}/>
        </div>);
    }, [textList, alias, writeName, addToList]);

    return (
        <div className='TextComponent'>
            <div className='TextList'>
                {renderList()}
                {renderTextAdd()}
            </div>

            <div className='Notify'>
                <div className='NotifyItem'>
                    <FiCheckSquare size={20}/>
                    <div className='Guide1'>
                        {`텍스트는 최대 ${MAX_TEXT}개 까지 등록할 수 있습니다.`}
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default TextSetting;