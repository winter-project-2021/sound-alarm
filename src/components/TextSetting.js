import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, updateItem } from '../modules/TextList';
import TextListItem from './TextListItem';
import { MdAddBox } from "react-icons/md";
import '../style/TextSetting.scss';


function TextSetting() {

    const DEFAULT_FILENAME = '파일 업로드';

    // redux로 부터 text이름 리스트를 가져옴
    const textList = useSelector(state => state.updateTextList.textList);
    const dispatch = useDispatch();

    const [item, setItem] = useState(-1); // 현재 클릭한 항목
    const [update, setUpdate] = useState(false); // 현재 수정 중 인가
    const [isDelete, setDelete] = useState(false); // 현재 삭제 중 인가
    const [alias, setAlias] = useState(''); // 현재 작성 중인 파일 alias

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
        const newItem = {id: i, name: alias};
        dispatch(updateItem(newItem));
        setItem(-1);
    }, [dispatch, setItem]);

    const deleteName = useCallback((i) => {
        // 항목 삭제 후 클릭 항목 초기화
        dispatch(removeItem(i));
        setItem(-1);
    }, [setItem, dispatch]);

    const renderList = useCallback(() => {
        
        // list가 비어 있으면 추가해 달라는 문구 출력
        if(textList.length === 0){
            return <div className='Empty'>새로운 텍스트를 추가해 주세요!</div>
        }

        // textList를 이용해 각 listItem 컴포넌트를 렌더링
        return textList.map(ele => <TextListItem name={ele.name}
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
        // 현재 파일이 업로드 되지 않았거나 이름이 비어있으면 무시
        if(alias === '')
            return;
        // 이미 있는 이름이면 무시
        for(const text of textList){
            if(text.name === alias) return;
        }
        // 항목 추가
        dispatch(addItem(alias));
        setAlias('');
    }, [dispatch, setAlias, alias, textList]);

    return (
      <div className='TextComponent'>
          <div className='TextList'>
              {renderList()}
          </div>
          <div className='FileUpload'>
              <input type='text' name='alias' className='NameInput' 
                     placeholder='이름을 입력해주세요' value={alias} onChange={writeName}/>
              <MdAddBox name='submit' className='AddButton' size={40} color={'grey'} onClick={addToList}/>
          </div>
      </div>
    );
}

export default TextSetting;