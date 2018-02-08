import React from 'react';

export default class SettingsMenu extends React.Component {
    render() {
        if(this.props.visible) {
            return(
                <div>
                    <p>Settings Menu</p>
                </div>
            )
        } else {
            return(<div></div>)
        }
    }
}