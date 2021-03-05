import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateItem } from '../modules/TextList';
import TextListItem from './TextListItem';
import { setOpen } from '../modules/ModalResult';
import { FiCheckSquare } from "react-icons/fi";
import { MdAddBox } from "react-icons/md";
import trans from './lang';
import '../style/TextSetting.scss';

function TextSetting() {

    // redux로 부터 text이름 리스트를 가져옴
    const textList = useSelector(state => state.updateTextList.textList);
    const USER_ID = useSelector(state => state.updateLoginState.user._id);
    const MAX_TEXT = useMemo(() => 10, []);
    const { lang } = useSelector(state => state.preferenceReducer);
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
        for(const text of textList){
            if(text.textid !== i && text.text === alias) {
                const popup = {
                    head: trans[lang]['uploadFail'][0],
                    body: trans[lang]['uploadFail'][1],
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
        const newItem = {_id: USER_ID, text: alias, textid: i};
        dispatch(updateItem(newItem));
        setItem(-1);
    }, [dispatch, setItem, USER_ID, textList, lang]);

    const deleteName = useCallback((i) => {
        // 항목 삭제 후 클릭 항목 초기화
        const item = {data:{_id: USER_ID, textid: i}};
        dispatch(removeItem(item));
        setItem(-1);
    }, [setItem, dispatch, USER_ID]);

    const renderList = useCallback(() => {
        
        // list가 비어 있으면 추가해 달라는 문구 출력
        if(textList.length === 0){
            return null;
        }

        // textList를 이용해 각 listItem 컴포넌트를 렌더링
        return textList.map(ele => <TextListItem name={ele.text}
                                                    key={ele.id}
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
                    head: trans[lang]['uploadFail'][0],
                    body: trans[lang]['uploadFail'][1],
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
                head: trans[lang]['uploadFail'][0],
                body: `${trans[lang]['uploadFail'][3]}`,
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
    }, [dispatch, setAlias, alias, textList, USER_ID, MAX_TEXT, lang]);

    const renderTextAdd = useCallback(() => {
        if(textList.length === MAX_TEXT) {
            return;
        }

        return (<div className='FileUpload'>
        <input type='text' name='alias' className='NameInput' 
                placeholder={trans[lang]['text'][1]} value={alias} onChange={writeName}/>
        <MdAddBox name='submit' className='AddButton' size={40} color={'grey'} onClick={addToList}/>
        </div>);
    }, [textList, alias, writeName, addToList, MAX_TEXT, lang]);

    return (
        <div className='TextComponent'>
            <div className='TextList'>
                {renderList()}
                {renderTextAdd()}
                {textList.length === 0 ? (<div className='Empty'>{trans[lang]['text'][0]}</div>) : null}
            </div>

            <div className='Notify'>
                <div className='NotifyItem'>
                    <div className='GuideIcon'>
                        <FiCheckSquare size={20}/>
                    </div>
                    <div className='Guide1'>
                        {trans[lang]['text'][2]}
                    </div>
                </div>
                <div className='NotifyItem'>
                    <div className='GuideIcon'>
                        <FiCheckSquare size={20}/>
                    </div>
                    <div className='Guide2'>
                    {trans[lang]['text'][3]}
                    </div>
                </div>
            </div>  
        </div>
    );
}

export default TextSetting;