const axios = require('axios');

exports.handler = async (event, context, callback) => {
    console.log(event)
    const routeStr = await getMostRecentRoute(event.queryStringParameters.email);
    const badgeRes = getShieldsIoBadgeRes(routeStr);

    return {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify(badgeRes),
    };
};

const getMostRecentRoute = async (email) => {
    const { data: { ticks } } = await axios.get(`https://www.mountainproject.com/data/get-ticks?email=${email}&key=${process.env.API_KEY}`);
    const { routeId } = ticks[0];

    const { data: { routes } } = await axios.get(`https://www.mountainproject.com/data/get-routes?routeIds=${routeId}&key=${process.env.API_KEY}`);
    const { name, type, rating } = routes[0];
    const routeStr = `${name} - ${type}, ${rating}`;

    return routeStr;
};

const getShieldsIoBadgeRes = (routeStr) => {
    return {
        "schemaVersion": 1,
        "label": "Most recent climb",
        "message": routeStr,
        "logoSvg": mtnProjLogo,
        "labelColor": 'd3d3d3',
        "color": "336799",
        "cacheSeconds": 1800,
        "style": "for-the-badge"
    };
};

const mtnProjLogo = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
 "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="225.000000pt" height="225.000000pt" viewBox="0 0 225.000000 225.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)"
fill="#336799" stroke="none">
<path d="M0 1125 l0 -1125 1125 0 1125 0 0 1125 0 1125 -1125 0 -1125 0 0
-1125z m1556 780 c192 -110 365 -215 385 -233 20 -18 46 -55 58 -82 21 -49 22
-59 19 -478 -3 -474 -2 -466 -73 -536 -43 -43 -712 -425 -766 -437 -91 -21
-116 -11 -492 204 -220 126 -366 216 -389 240 -67 69 -68 81 -68 546 l0 416
24 50 c13 28 36 62 52 77 27 25 633 379 719 420 30 14 57 18 111 16 l71 -3
349 -200z"/>
<path d="M749 1799 c-184 -105 -344 -200 -356 -211 -37 -34 -44 -67 -41 -190
l3 -115 190 173 c105 95 197 173 205 173 9 1 48 -32 87 -71 l72 -73 -59 -92
c-112 -173 -87 -159 231 131 144 131 267 239 274 240 6 0 35 -20 63 -46 l50
-47 -13 -43 c-37 -119 -152 -314 -179 -305 -6 2 -10 16 -9 30 2 33 -47 77 -86
77 -51 0 -90 -71 -94 -169 -2 -62 6 -82 25 -63 14 14 15 62 4 117 l-8 40 21
-22 c13 -14 34 -23 51 -23 39 0 44 -12 21 -52 -10 -18 -34 -70 -52 -116 l-34
-83 68 -66 c47 -45 64 -69 58 -77 -13 -16 25 -76 49 -76 33 0 43 24 25 65 -20
49 -19 62 3 43 31 -28 132 -80 189 -98 49 -15 57 -21 68 -54 7 -20 26 -56 41
-79 17 -26 27 -52 25 -69 -2 -21 2 -28 15 -28 10 0 28 -10 40 -21 14 -13 30
-19 39 -15 15 5 14 10 -6 38 -13 18 -27 36 -32 39 -9 7 -74 164 -83 204 -3 11
-36 40 -74 65 l-68 44 67 32 66 33 60 -21 c33 -11 71 -21 84 -23 13 -1 32 -13
41 -25 l17 -23 47 39 c45 37 60 62 32 51 -83 -32 -86 -32 -179 22 -49 28 -93
51 -98 51 -6 0 -51 -12 -100 -26 -50 -14 -92 -24 -94 -22 -2 1 -12 32 -24 67
-15 46 -18 68 -11 82 8 14 6 23 -10 39 -26 26 -26 31 14 103 19 34 47 105 62
158 14 52 33 104 40 114 15 20 12 22 284 -227 l125 -115 3 115 c3 123 -4 156
-41 190 -12 11 -172 106 -356 211 -287 164 -341 191 -376 191 -35 0 -89 -27
-376 -191z m507 -681 c32 -63 51 -134 40 -157 -5 -12 -13 -20 -17 -19 -4 2
-30 32 -56 68 l-49 66 25 41 c28 46 34 46 57 1z"/>
</g>
</svg>`;