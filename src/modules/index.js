import { combineReducers } from 'redux';
import updateSoundList from './SoundList';
import setModal from './ModalResult';

// root reducer를 위한 combine
// 새로운 reducer 만들면 여기에 하나씩 추가하면 됨
const rootReducer = combineReducers({
    updateSoundList,
    setModal,
    // 추가 ...
});

export default rootReducer;