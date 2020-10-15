import React from 'react'
import PropTypes from 'prop-types'

import './Menu.css'

const Menu = ( { logout, copyUrl } ) => (
    <>
    <div className="menu-wrapper">
        <ul className="menu">
            <li>Your room code:</li>
            <li onKeyPress={ () => copyUrl() } onClick={ () => copyUrl() } className="room-code"><i className="far fa-copy clone-icon"></i><span>{ sessionStorage.getItem( 'roomCode' ) }</span></li>
            <li onKeyPress={ () => logout() } onClick={ () => logout() }><i className="fas fa-sign-out-alt"></i><span>Leave room</span></li>
        </ul>
    </div>
    <div className="basic-result-logo"></div>
    </>
)

Menu.propTypes = {
    logout: PropTypes.func,
    copyUrl: PropTypes.func
}

export default Menu