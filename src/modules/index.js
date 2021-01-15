import { combineReducers } from 'redux';
import updateSoundList from './SoundList';

// root reducer를 위한 combine
// 새로운 reducer 만들면 여기에 하나씩 추가하면 됨
const rootReducer = combineReducers({
    updateSoundList,
    // 추가 ...
});

export default rootReducer;