import axios from 'axios'

async function auth() {
    const data = await axios.put('https://battleship.iic2513.phobos.cl/auth', { email: 'jamendoza@uc.cl', studentNumber:'1663392J' });
    localStorage.setItem('token', data.data.token);
    console.log(data.data.token)
}
export const ApiService = () => {
    auth()
    return axios.create({
        baseURL: 'https://battleship.iic2513.phobos.cl',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
            }
    })
}


