import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { all } from 'redux-saga/effects';
import storage from 'redux-persist/lib/storage';
import updateSoundList, {soundSaga} from './SoundList';
import setModal from './ModalResult';
import preferenceReducer from './PreferenceResult';
import updateTextList from './TextList';
import updateLoginState from './LoginState';
import loading from './loading';

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
    loading,
    // 추가 ...
});

export function* rootSaga() {
    yield all([/*soundSaga()*/]);
}

export default persistReducer(config, rootReducer);