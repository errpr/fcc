const apiBaseUrl = "https://wind-bow.glitch.me/twitch-api";

let streamList = [];
let streamsToCheck = [];

document.getElementById('addStreamInput').addEventListener("keydown", (e) => {
    if(e.keyCode == 13) {
        addStream();
    }
});

function addStream() {
    const e = document.getElementById('addStreamInput');
    streamsToCheck.push(e.value);
    e.value = '';
    rebuildList();
}

function collectStreams() {
    let streamsCopy = streamsToCheck.slice();
    streamsToCheck = [];
    for(i in streamsCopy) {
        getStream(streamsCopy[i]);
    }
}

function getStream(streamId) {
    console.log('getStream called')
    const url = `${apiBaseUrl}/streams/${streamId}?callback=outputStreamInfo`;
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    let e = document.getElementById('root');
    e.appendChild(script);
    e.removeChild(script);
}

function outputStreamInfo(json){
    json.name = getName(json);
    streamList.push(json);
    rebuildList();
}

function getName(json) {
    return json._links.self.match('\/([^/]+$)')[1];
}

function rebuildList() {
    let listElement = document.getElementById('stream-list');
    listElement.innerHTML = '';
    for(i in streamList) {
        listElement.appendChild(buildListItem(streamList[i]));
    }
    for(i in streamsToCheck) {
        listElement.appendChild(buildListItem(
            {
                "name": streamsToCheck[i],
                "stream": 'Unchecked'
            }
        ));
    }
}

function buildListItem(stream) {
    let streamBody = '';
    if(stream["stream"] == null){
        streamBody = 'Offline';
    } else if(stream["stream"] == 'Unchecked') {
        streamBody = 'Unchecked';
    } else {
        streamBody = 'Online';
    }
    let e = document.createElement('li');
    e.innerHTML = `<h3>${stream["name"]}</h3><p>${streamBody}</p>`;
    return e;
}

//     [
//         {
//           "stream": {
//             "_id": 27487440128,
//             "game": "One Piece Treasure Cruise",
//             "viewers": 14,
//             "video_height": 1080,
//             "average_fps": 30,
//             "delay": 0,
//             "created_at": "2018-02-03T17:56:03Z",
//             "is_playlist": false,
//             "stream_type": "live",
//             "preview": {
//               "small": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sleftyy-80x45.jpg",
//               "medium": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sleftyy-320x180.jpg",
//               "large": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sleftyy-640x360.jpg",
//               "template": "https://static-cdn.jtvnw.net/previews-ttv/live_user_sleftyy-{width}x{height}.jpg"
//             },
//             "channel": {
//               "mature": false,
//               "partner": false,
//               "status": "[GLOBEAST] -Farming- Farming never changes",
//               "broadcaster_language": "en",
//               "display_name": "Sleftyy",
//               "game": "One Piece Treasure Cruise",
//               "language": "en",
//               "_id": 109295564,
//               "name": "sleftyy",
//               "created_at": "2015-12-12T07:49:31Z",
//               "updated_at": "2018-02-03T17:56:12Z",
//               "delay": null,
//               "logo": "https://static-cdn.jtvnw.net/jtv_user_pictures/1a71e93d65617a88-profile_image-300x300.png",
//               "banner": null,
//               "video_banner": null,
//               "background": null,
//               "profile_banner": "https://static-cdn.jtvnw.net/jtv_user_pictures/0ec4c66b4934ca31-profile_banner-480.png",
//               "profile_banner_background_color": "",
//               "url": "https://www.twitch.tv/sleftyy",
//               "views": 27482,
//               "followers": 942,
//               "_links": {
//                 "self": "https://api.twitch.tv/kraken/channels/sleftyy",
//                 "follows": "https://api.twitch.tv/kraken/channels/sleftyy/follows",
//                 "commercial": "https://api.twitch.tv/kraken/channels/sleftyy/commercial",
//                 "stream_key": "https://api.twitch.tv/kraken/channels/sleftyy/stream_key",
//                 "chat": "https://api.twitch.tv/kraken/chat/sleftyy",
//                 "features": "https://api.twitch.tv/kraken/channels/sleftyy/features",
//                 "subscriptions": "https://api.twitch.tv/kraken/channels/sleftyy/subscriptions",
//                 "editors": "https://api.twitch.tv/kraken/channels/sleftyy/editors",
//                 "teams": "https://api.twitch.tv/kraken/channels/sleftyy/teams",
//                 "videos": "https://api.twitch.tv/kraken/channels/sleftyy/videos"
//               }
//             },
//             "_links": {
//               "self": "https://api.twitch.tv/kraken/streams/sleftyy"
//             }
//           },
//           "_links": {
//             "self": "https://api.twitch.tv/kraken/streams/sleftyy",
//             "channel": "https://api.twitch.tv/kraken/channels/sleftyy"
//           },
//           "name": "sleftyy"
//         },
//         {
//           "stream": null,
//           "_links": {
//             "self": "https://api.twitch.tv/kraken/streams/freeCodeCamp",
//             "channel": "https://api.twitch.tv/kraken/channels/freeCodeCamp"
//           },
//           "name": "freeCodeCamp"
//         }
//       ]