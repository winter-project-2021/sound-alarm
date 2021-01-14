import { useCallback, useState } from 'react';
import '../style/SoundSetting.scss';
import SoundListItem from './SoundListItem';

function SoundSetting() {

    // testList, setTestList부분만 나중에 redux 구현하고 대체하면 됨
    const [testList, setTestList] = useState(['초인종', '노크', '전화']);
    const [item, setItem] = useState(-1);
    const [update, setUpdate] = useState(false);
    const [isDelete, setDelete] = useState(false); 

    const clickItem = useCallback((i) => {
        if(update || isDelete)
            return;
        
        if(i === item){
            setItem(-1);
        }
        else{
            setItem(i);
        }
        
    }, [setItem, item, update, isDelete]);

    const updateName = useCallback((i, name) => {
        setTestList(testList => testList.map((ele, idx) => idx === i ? name : ele));
        setItem(-1);
    }, [setTestList, setItem]);

    const deleteName = useCallback((i) => {
        setTestList(testList => testList.filter((ele, idx) => idx !== i));
        setItem(-1);
    }, [setItem, setTestList]);

    const renderList = useCallback(() => {
        return testList.map((ele, i) => <SoundListItem name={ele}
                                                        clickItem={clickItem}
                                                        order={i}
                                                        isClick={i === item}
                                                        updateName={updateName}
                                                        deleteName={deleteName}
                                                        setUpdate={setUpdate}
                                                        setDelete={setDelete}/>)
    }, [testList, item, clickItem, updateName, deleteName, setUpdate, setDelete]);

    return (
      <div className='SoundComponent'>
          <div className='SoundList'>
              {renderList()}
          </div>
          <input type='file' name='audio'/>
          <input type='text' name='alias'/>
          <button name='submit'>추가</button>
      </div>
    );
}

export default SoundSetting;