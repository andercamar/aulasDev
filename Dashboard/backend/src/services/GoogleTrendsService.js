import Parser from "rss-parser";

const API_URL= "https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=";


const parser = new Parser({
    defaultRSS: 2.0,
    customFields: {
        item: [['ht:approx_traffic', 'volume', {keepArray:false}]],
    },
});

const parseVolumeToInt = volume =>{
    let vol = volume.replace("+",'');
    vol = vol.replace(/\,/g, '')
    return Number.parseInt(vol, 10);
}

const sortVolume = (a,b)=> b.volume - a.volume;

const getGoogleTrends = async (geo) =>{

    const url = `${API_URL}${geo}`
    const trends = await parser.parseURL(url);
    const items = trends.items.map(item =>{
        const{title: name,volume} = item;
        return {name, volume: parseVolumeToInt(volume)};
    });

    return items;
};

const fetchData = async (limit = 10) => {
    const [br,us] = await Promise.all([
        getGoogleTrends('BR'),
        getGoogleTrends('US')
    ]); 
    const items = [...us,...br];
    const sorted = items.sort(sortVolume);
    const limited = sorted.slice(0, limit);
    return limited;
}

export default {fetchData};