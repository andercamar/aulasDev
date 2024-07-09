import { TWITTER_API_KEY,TWITTER_API_SECRET,TWITTER_ACCESS_TOKEN,TWITTER_ACCESS_TOKEN_SECRET } from "helpers/configHelper";
import { doGetRequest, doPostRequest } from "helpers/apiHelper";

const API_URL = 'https://api.twitter.com';

const getBasicAuthorization = (key,secret) =>{
    const data = `${key}:${secret}`;
    const buff = Buffer.from(data);
    return buff.toString('base64');
}


const getAccessToken = () =>{
    const url = `${API_URL}/oauth2/token`;
    const data = { grant_type: 'client_credentials'};
    const authorization = getBasicAuthorization(TWITTER_API_KEY,TWITTER_API_SECRET);
    const headers = {
        Authorization: `Basic ${authorization}`,
    };
    const resolver = data => data.access_token
    return doPostRequest(url,data,headers,resolver);
}

const getTwitterData = (accessToken, path) => {
    const url = `${API_URL}${path}`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    }
    const resolver = (data) =>{
        if(!data || !data[0] || data[0].trends) return [];
        const filtered = data[0].trends.filter(item => Boolean(item.tweet_volume));
        const sorted = filtered.sort((a,b) =>b.tweet_volume - a.tweet_volume);
        const parsed = sorted.map(item => {
            const {name,tweet_volume: volume} = item;
            return {name,volume}
        });
        return parsed;
    }
    return doGetRequest(url,headers);
}

const fetchData = async () =>{
    const accessToken = await getAccessToken();
    const result = await getTwitterData(accessToken,'/1.1/trends/place.json?id=1');
    return result;
}

export default { fetchData };