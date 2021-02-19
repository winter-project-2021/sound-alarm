import axios from 'axios';

const END_POINT = `${process.env.END_POINT}`;

// 비동기 작업 함수
export const addSoundItem = (item) => {
    axios.post(`${END_POINT}/audio`, item);
}

export const removeSoundItem = (id) => {
    axios.delete(`${END_POINT}/audio/${id}`);
}

export const updateSoundItem = (item) => {
    axios.put(`${END_POINT}/audio`, item);
}

export const updateSetting = (setting) => {
    axios.post(`${END_POINT}/setting`, setting);
}

export const updateSoundSensitivity = (sens) => {
    axios.post(`${END_POINT}/audio/fp/test`, sens);
}

export const getScore = (blob) => {
    axios.post(`${END_POINT}/audio/fp`, blob);
}

export const getUserinfo = (username) => {
    axios.post(`${END_POINT}/`, username)
}

export const addTextItem = (item) => {
    axios.post(`${END_POINT}/`, item)
}

export const deleteTextItem = (item) => {
    axios.delete(`${END_POINT}/`, item)
}

export const updateTextItem = (item) => {
    axios.put(`${END_POINT}/`, item)
}