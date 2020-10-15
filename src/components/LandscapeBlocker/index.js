import React from 'react'
import './LandscapeBlocker.css'

const LandscapeBlocker = () => (
    <div className="landscape-warning-message">
        <p>For best results please put your device into portrait mode.</p>
        <p className="wink"><i className="far fa-kiss-wink-heart"></i></p>
        <p>Thank you.</p>
    </div>
)

export default LandscapeBlocker
