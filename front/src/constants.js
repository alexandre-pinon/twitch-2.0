import axios from 'axios';

export const clientId = "33t5mpsd2wl4r2b8h76vt3me60mlgj";
export const clientSecret = "6qyjn2mtz0t2cpcepo06db8dyj0p4v";

export const fetchAccessToken = async () => {
    let api = axios.create();
    const result = await api.post(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`);
    console.log(result.data.access_token);
    localStorage.setItem('accessToken', 'Bearer ' + result.data.access_token);
}