import React, { useReducer, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import gql from 'graphql-tag'

import './CreateRoom.css'
import TextInput from '../../components/TextInput'
import BasicContainer from '../../components/BasicContainer'

/* global sessionStorage */

const CREATE_ROOM = gql`
mutation InsertNewRoom( $fullName: String! ) {
    create_room( input: { fullName: $fullName } ) {
        roomCode
        token
        userId
    }
}
`

const CreateRoomPage = () => {
	const history = useHistory()
	const [ errorMessage, setErrorMessage ] = useState( null )
	// Force re-render
	const [ , forceUpdate ] = useReducer( ( x ) => x + 1, 0 )

	const [ createRoom ] = useMutation( CREATE_ROOM, {
		onCompleted: ( { create_room } ) => {
			sessionStorage.setItem( 'userId', create_room?.userId )
			sessionStorage.setItem( 'token', create_room?.token )
			sessionStorage.setItem( 'roomCode', create_room?.roomCode )
			history.push( `/game/${ create_room?.roomCode }` )
		},
		onError: ( error ) => {
			setErrorMessage( 'Something went wrong! Please try again.' )
			console.error( error )
		}
	} )

	function createNewRoom() {
		const fullName = document.getElementById( 'create-full-name' ).value

		if ( fullName.length > 0 ) {
			createRoom( {
				variables: {
					fullName
				}
			} )
		} else {
			setErrorMessage( 'Please enter your name!' )
		}
	}

	function onNameEnter( e ) {
		if ( e.key === 'Enter' ) {
			createNewRoom()
		}
	}

	function leaveCurrentAndStartNew() {
		sessionStorage.clear()
		forceUpdate()
	}

	if ( sessionStorage.getItem( 'token' ) && sessionStorage.getItem( 'roomCode' ) ) {
		return (
			<BasicContainer>
				<div className='create-game-warning'>
					<div>
						<div>You already have active session wanna continue or leave and start new game?</div>
					</div>
					<div className='create-btn'>
						<button type='button' className='basic-btn' onClick={ () => history.push( `/game/${ sessionStorage.getItem( 'roomCode' ) }` ) }>continue</button>
						<button type='button' className='basic-btn leave-btn' onClick={ () => leaveCurrentAndStartNew() }>leave, start new game</button>
					</div>
				</div>
			</BasicContainer>
		)
	}

	return (
		<BasicContainer>
			<div className='create-game'>
				<TextInput id='create-full-name' placeholder='Your name' size={ 20 } onKeyPress={ onNameEnter } />
				<button type='button' className='basic-btn create-btn' onClick={ () => createNewRoom() }>Create room</button>
				<span
					className='basic-back-btn'
					tabIndex={ 0 }
					role='button'
					onKeyPress={ () => history.push( '/' ) }
					onClick={ () => history.push( '/' ) }
				>
					<i className="fas fa-chevron-circle-left"></i>
				</span>
				<div className='error-message'>{ errorMessage && errorMessage }</div>
			</div>
		</BasicContainer>
	)
}

export default CreateRoomPage
