const apiBaseUrl = "https://wind-bow.glitch.me/twitch-api";

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
    console.log(json);
}