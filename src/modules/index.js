import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import updateSoundList from './SoundList';
import setModal from './ModalResult';
import preferenceReducer from './PreferenceResult';
import updateTextList from './TextList';
import updateLoginState from './LoginState';

const config = {
    key: 'root',
    storage,
};



// root reducer를 위한 combine
// 새로운 reducer 만들면 여기에 하나씩 추가하면 됨
const rootReducer = combineReducers({
    updateSoundList,
    setModal,
    preferenceReducer,
    updateTextList,
    updateLoginState,
    // 추가 ...
});

export default persistReducer(config, rootReducer);