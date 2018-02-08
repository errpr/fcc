import React from 'react';

export default function SettingsMenu(props) {
    if(props.visible) {
        return(
            <div className="settingsMenu">
                <div id="localStorageSetting">
                    <input 
                        id="localStorageSettingInput" 
                        onChange={props.toggleLocalStorage}
                        type="checkbox" 
                        checked={props.useLocalStorage} />
                    Remember state with localStorage.
                </div>
                <div id="refreshStreams">
                    <input 
                        id="refreshStreamsInput" 
                        onChange={props.toggleRefreshStreams}
                        type="checkbox" 
                        checked={props.refreshStreams} />
                    Refresh streams automatically.
                </div>
            </div>
        )
    } else {
        return(<div></div>)
    }
}