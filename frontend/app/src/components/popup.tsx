import "./popup.css";
import React from 'react';

export default function Popup(props: any)
{
    return (props.trigger) ? (
        <div className="popup-overlay">
            <div className="popup-content">
                <div className="grid-layout">
                    <div className="top-left">
                        <h2 className="popup-title">{props.title}</h2>
                    </div>
                    <div className="top-right">
                        <button className="popup-close" onClick={() => props.setTrigger(false)}>×</button>
                    </div>
                    <div className="bottom">{props.children}</div>
                </div>
            </div>
        </div>
    ) : null;
}