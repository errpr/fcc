function insertResults(resultArray){
    var searchTerm = resultArray[0];
    var resultTitles = resultArray[1];
    var resultSnips = resultArray[2];
    var resultUrls = resultArray[3];

    var results = `<div><h3>Results for <em>${searchTerm}</em>:</h3><ol>`;
    for(var i = 0; i < resultTitles.length; i++){
        results += `<li><div><h4><a href="${resultUrls[i]}">${resultTitles[i]}</a></h4><p>${resultSnips[i]}</p></div></li>`;
    }
    results += '</ol></div>';
    
    document.getElementById('results').innerHTML = results;
}

function makeWikiRequest(apiParams){
    
    let queryString = 'action=' + apiParams.action;
    Object.keys(apiParams.parameters).forEach((v, i, a) => {
        queryString += '&';
        queryString += v;
        queryString += '=';
        queryString += apiParams.parameters[v];
    });

    const apiUrl = 'https://en.wikipedia.org/w/api.php?' + queryString;

    return fetch( apiUrl, {
        method: 'GET',
        headers: new Headers( {
            'Api-User-Agent': 'Weekeepeedee-uh/1.0 (twitter.com/errpr_)'
        })
    } ).then( function ( response ) {
        if ( response.ok ) {
            return response.json();
        }
        throw new Error( 'Network response was not ok: ' + response.statusText );
    });
}

function searchWikipedia(queryText) {
    makeWikiRequest({
        action: 'opensearch',
        parameters: {
            'origin': '*',
            'search': queryText,
            'limit': 10,
            'profile': 'fuzzy',
            'format': 'json'
        }
    }).then(data => insertResults(data));
}

const searchForm = document.getElementById("searchForm");

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchWikipedia(document.getElementById("search").value);
});