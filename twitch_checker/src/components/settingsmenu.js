import React from 'react';

export default function SettingsMenu(props) {
    if(props.visible) {
        return(
            <div className="settingsMenu">
                <p className="settingsItem">Settings Menu</p>
            </div>
        )
    } else {
        return(<div></div>)
    }
}