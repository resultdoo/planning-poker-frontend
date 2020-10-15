import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import './JoinPage.css'
import TextInput from '../../components/TextInput'
import BasicContainer from '../../components/BasicContainer'

/* global sessionStorage */

const JOIN_ROOM = gql`
mutation JoinRoom( $fullName: String!, $roomCode: String! ) {
    join_room( input: { fullName: $fullName, roomCode: $roomCode } ) {
        roomCode
        token
        userId
    }
}`

const JoinPage = ( { match } ) => {
	const history = useHistory()
	const [ errorMessage, setErrorMessage ] = useState( null )

	// Set input for room code automatically
	useEffect( () => {
		if ( match?.params?.id ) {
			document.getElementById( 'room-code' ).value = match.params.id
		}
	} )

	const [ joinRoom ] = useMutation( JOIN_ROOM, {
		onCompleted: ( { join_room } ) => {
			sessionStorage.setItem( 'userId', join_room?.userId )
			sessionStorage.setItem( 'token', join_room?.token )
			sessionStorage.setItem( 'roomCode', join_room?.roomCode )
			history.push( `/game/${ join_room?.roomCode }` )
		},
		onError: ( error ) => {
			setErrorMessage( 'Room does not exist or has expired!' )
			console.log( error )
		}
	} )

	function joinNewGame() {
		const roomCode = document.getElementById( 'room-code' ).value.toUpperCase()
		const fullName = document.getElementById( 'join-full-name' ).value

		if ( fullName.length < 1 ) {
			setErrorMessage( 'Please enter your name!' )
		} else if ( roomCode.length !== 4 ) {
			setErrorMessage( 'Room Code is not valid!' )
		} else {
			joinRoom( {
				variables: {
					fullName,
					roomCode
				}
			} )
		}
	}
	
	function onKeyPress( e ) {
		if ( e.key === 'Enter' ) {
			joinNewGame()
		}
	}

	return (
		<BasicContainer>
			<div className='join-page-container'>
				<div className='join-game-input-container'>
					<TextInput id='join-full-name' placeholder='Your name' size={ 20 } />
					<TextInput id='room-code' onKeyPress={ onKeyPress } placeholder='Room code' size={ 4 } isCaps />
				</div>
				<button type='button' className='basic-btn join-btn' onClick={ () => joinNewGame() }>Join room</button>
				<span
					className='basic-back-btn'
					tabIndex={ 0 }
					role='button'
					onKeyPress={ () => history.push( '/' ) }
					onClick={ () => history.push( '/' ) }
				>
					<i class="fas fa-chevron-circle-left"></i>
				</span>
				<div className='error-message'>{ errorMessage && errorMessage }</div>
			</div>
		</BasicContainer>
	)
}

JoinPage.propTypes = {
	match: PropTypes.object
}

JoinPage.defaultProps = {
	match: {}
}

export default JoinPage
