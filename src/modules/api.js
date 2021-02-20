import axios from 'axios';

const END_POINT = ''//'https://localhost:4000'//`${process.env.END_POINT}`;

// 비동기 작업 함수
export const addSoundItem = (item) => {
    return axios.post(`${END_POINT}/audio`, item, { headers: {
        'Content-Type': 'multipart/form-data'
    }});
}

export const removeSoundItem = (item) => {
    return axios.delete(`${END_POINT}/audio/`, item);
}

export const updateSoundItem = (item) => {
    return axios.put(`${END_POINT}/audio`, item);
}

export const updateSetting = (setting) => {
    return axios.put(`${END_POINT}/setting`, setting);
}

export const updateSoundSensitivity = (item) => {
    return axios.put(`${END_POINT}/audio`, item);
}

export const getUserinfo = (username) => {
    return axios.post(`${END_POINT}/login`, username);
}

export const addTextItem = (item) => {
    return axios.post(`${END_POINT}/text`, item, { headers: {
        'Content-Type': 'multipart/form-data'
    }});
};

export const removeTextItem = (item) => {
    return axios.delete(`${END_POINT}/text`, item);
}

export const updateTextItem = (item) => {
    return axios.put(`${END_POINT}/text`, item);
}

export const getScore = (item) => {
    return axios.post(`${END_POINT}/audio/test`, item);
}