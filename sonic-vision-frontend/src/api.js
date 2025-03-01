import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django API URL

export const loginUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/users/login/`, userData);
};

export const registerUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/users/register/`, userData);
};