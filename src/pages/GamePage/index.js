import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import jwtDecode from 'jwt-decode'
import gql from 'graphql-tag'

import './GamePage.css'
import BigInfo from '../../components/BigInfo'
import Menu from '../../components/Menu'
import Card from '../../components/Card'
import { fullDeck } from '../../utils/deck'
import PlanningPokerLogo from '../../icons/PlanningPokerLogo'
import LandscapeBlocker from '../../components/LandscapeBlocker'
// import ManageUsers from '../../components/ManageUsers'

/* global sessionStorage */

const ROOM_BY_CODE = gql`
query GetRoomByCode( $roomCode: String ) {
    rooms( where: { room_code: { _eq: $roomCode } } ) {
        users {
            id
            full_name
            card {
                id
                card_value
                show
            }
        }
    }
}`

const SUBSCRIPTION_ROOM_BY_CODE = gql`
subscription SubscriptionRoomByCode( $roomCode: String ) {
    rooms( where: { room_code: { _eq: $roomCode } } ) {
        users {
            id
            full_name
            card {
                id
                card_value
                show
            }
        }
    }
}`

const UPDATE_CARD_VALUE = gql`
mutation UpdateCardValue( $userId: bigint, $cardValue: bpchar ) {
    update_scrum_cards( where: { user_id: { _eq: $userId } }, _set: { card_value: $cardValue } ) {
        returning {
            id
        }
    }
}`

const END_ROUND = gql`
mutation EndRound( $roomCode: String! ) {
    end_round( input: { roomCode: $roomCode } ) {
        success
    }
}`

const TOGGLE_CARDS = gql`
mutation ToggleCards( $roomCode: String!, $show: Boolean! ) {
    toggle_cards( input: { roomCode: $roomCode, show: $show } ) {
        success
    }
}`

const DELETE_USER = gql`
mutation DeleteUser( $userId: bigint! ) {
    delete_users_by_pk( id: $userId ) {
        id
    }
}`

// Map values from database
const createRoomBoard = ( roomValues ) => {
	if (
		!roomValues
        || !roomValues?.[ 0 ]?.users
        || roomValues?.[ 0 ]?.users?.length === 0
	) { return [] }

	const gameArray = []
	roomValues[ 0 ].users.forEach( ( user ) => {
		gameArray.push( {
			userId: user?.id,
			name: user?.full_name,
			cardId: user?.card?.id,
			cardValue: user?.card?.card_value ?? null,
			showCard: user?.card?.id === parseInt( sessionStorage.getItem( 'cardId' ), 10 )
				? true : user?.card?.show
		} )
	} )

	return gameArray
}

const CardsOnTable = ( {
	name, face, isShown
} ) => {
	if ( !face ) return null
	return (
		<div id='card-on-table-container'>
			<div className='card-on-table-name'>{ name }</div>
			<Card face={ face } isShown={ isShown } />
		</div>
	)
}

const GamePage = ( { match } ) => {
	const history = useHistory()

	//  Queries
	const { data, error: roomError } = useQuery( ROOM_BY_CODE, {
		skip: !match?.params?.id,
		variables: { roomCode: match?.params?.id }
	} )

	//  Mutations
	const [ endRound ] = useMutation( END_ROUND )
	const [ toggleCards ] = useMutation( TOGGLE_CARDS )
	const [ deleteUser ] = useMutation( DELETE_USER )
	const [ updateCardValue ] = useMutation( UPDATE_CARD_VALUE, {
		onCompleted: ( { update_scrum_cards } ) => {
			if ( update_scrum_cards?.returning?.[ 0 ]?.id ) {
				sessionStorage.setItem( 'cardId', update_scrum_cards.returning[ 0 ].id )
			}
		},
	} )

	//  Subscriptions
	const {
		data: subscriptionData,
		error: subscriptionError
	} = useSubscription(
		SUBSCRIPTION_ROOM_BY_CODE, {
			skip: !match?.params?.id,
			variables: {
				roomCode: match?.params?.id
			},
		}
	)

	//  States
	const [ boardCards, addBoardCard ] = useState( createRoomBoard( data?.rooms ) )
	const [ isAdmin, setAdmin ] = useState( false )
	const [ isInfoOpen, toggleInfo ] = useState( false )
	const [ isMenuOpen, toggleMenu ] = useState( false )
	const [ isAllowedToAddCard, toggleIsAllowedToAddCard ] = useState( true )
	const [ showCards, toggleShowCards ] = useState( false )

	//  UseEffects
	useEffect( () => {
		const roomsData = subscriptionData ? subscriptionData?.rooms : data?.rooms
		const users = roomsData?.[0]?.users ?? []

		//  When all the joined users throw their cards show them all
		if ( users.length > 0 && users.every( ( u ) => u?.card?.card_value ) ) {
			roomsData[ 0 ].users.forEach( ( u ) => {
				if ( u.card.show === false ) {
					// eslint-disable-next-line no-param-reassign
					u.card.show = true
				}
			} )
			toggleIsAllowedToAddCard( false )
		} else {
			toggleIsAllowedToAddCard( true )
		}

		addBoardCard( createRoomBoard( roomsData ) )

		if ( sessionStorage.getItem( 'token' ) ) {
			setAdmin(
                jwtDecode( sessionStorage.getItem( 'token' ) )?.result?.[ 'X-Hasura-Role' ] === 'owner'
                && jwtDecode( sessionStorage.getItem( 'token' ) )?.result?.['X-Hasura-Room'] === match?.params?.id
			)
		}
	}, [ data, subscriptionData, match ] )

	//  Functions
	function addCartToBoard( cardFace ) {
		const userId = sessionStorage.getItem( 'userId' )

		const cBoardCard = boardCards
		const index = cBoardCard.findIndex( ( obj ) => obj.userId === parseInt( userId, 10 ) )
		if ( index > -1 ) {
			cBoardCard[ index ].cardValue = cardFace
			addBoardCard( [ ...cBoardCard ] )
		}

		if ( userId ) {
			updateCardValue( {
				variables: {
					userId,
					cardValue: cardFace
				}
			} )
		}
	}

	function showAllCards() {
		toggleShowCards( !showCards )
		if ( isAdmin && showCards != null ) {
			toggleCards( {
				variables: {
					roomCode: match?.params?.id,
					show: !showCards
				}
			} )
		}
	}

	function newRound() {
		addBoardCard( [] )

		endRound( {
			variables: {
				roomCode: match?.params?.id
			}
		} )
	}

	function logout() {
		deleteUser( { variables: { userId: sessionStorage.getItem( 'userId' ) } } )
		sessionStorage.clear()
		history.push( '/' )
		window.location.reload()
	}

	function gameDisabled() {
		// If we only have one card value this means we are the only player so we won't be disabling the game
		if ( boardCards.length <= 1 || showCards ) {
			return ""
		}

		const gameDone = boardCards.every( card => card.cardValue != null )

		if ( gameDone ) {
			return "game-deck-disabled"
		}
		return ""
	}

	function copyUrl() {
		const dummyInput = document.createElement( 'input' )
		const text = window.location.href

		document.body.appendChild( dummyInput )
		dummyInput.value = text
		dummyInput.select()
		document.execCommand( 'copy' )
		document.body.removeChild( dummyInput )
	}

	function checkError() {
		if ( subscriptionError ) {
			if ( subscriptionError.message === "no subscriptions exist" ) {
				return false
			}
		}
		if ( roomError ) {
			return true
		}
		return false
	}

	function getMenuClass() {
		if ( isMenuOpen ) {
			return 'menu-container menu-show-animation'
		} else {
			return 'menu-container'
		}
	}

	function getInfoClass() {
		if ( isInfoOpen ) {
			return 'info-container info-container-show-animation'
		} else {
			return 'info-container'
		}
	}

	return (
		<div id='game-page-container'>
			<div className="landscape-warning-container">
				<LandscapeBlocker />
			</div>
			<div className={ getInfoClass() }>
				<div className='info-text'><BigInfo /></div>
				<button type='button' className='info-close' onClick={ () => toggleInfo( !isInfoOpen ) }><i className="fas fa-times-circle"></i></button>
			</div>
			<div className={ getMenuClass() }>
				<Menu logout={ logout } copyUrl={ copyUrl } />
				<button type='button' className='info-close' onClick={ () => toggleMenu( !isMenuOpen ) }><i className="fas fa-times-circle"></i></button>
			</div>
			<div className='game-page-title'>
				<div className='menu-links-container'>
					<button type='button' onClick={ () => toggleMenu( true ) } className='info-icon hamburger-icon'><i className="fas fa-bars"></i></button>
					<button type='button' onClick={ () => toggleInfo( true ) } className='info-icon'><i className="fas fa-info-circle"></i></button>
				</div>
				<PlanningPokerLogo size={ 100 } clickDisabled />
				<div className='leave-and-game-code'>
					<div
						className='game-code'
						tabIndex={ 0 }
						role='button'
						onKeyPress={ () => copyUrl() }
						onClick={ () => copyUrl() }
					>
						<i className="far fa-copy clone-icon"></i>
						<div className='code-text'><span className="join-with-code">Join with code</span><br/> { sessionStorage.getItem( 'roomCode' ) }</div>
					</div>
					<button type='button' className='basic-btn leave-room-btn' onClick={ () => logout() }>LEAVE ROOM</button>
				</div>
			</div>
			<div className='game-container'>
				<div className='game-page-playground'>
					{
						( checkError() )
							? ( <div className='error-message'>Game server can not be reached. Please try refreshing your page.</div> )
							: boardCards.map( ( item ) => (
								<CardsOnTable
									key={ `${ item?.cardId }-${ item?.cardValue }` }
									name={ item?.name }
									face={ item?.cardValue }
									isShown={ item.showCard }
								/>
							) )
					}
				</div>
			</div>
			{ isAdmin ? (
				<div className='game-page-admin'>
					<button type='button' className='basic-btn' onClick={ () => newRound() }>New round</button>
					<button
						type='button'
						className='basic-btn'
						onClick={ () => showAllCards() }
					>
						Show Cards
					</button>
				</div>
			) : null }
			<div className={ `game-page-deck ${ gameDisabled() }` }>
				{ fullDeck.map( ( card ) => (
					<Card
						key={ `card-play-deck-${ card }` }
						face={ card }
						isShown
						onClickHandle={ isAllowedToAddCard ? addCartToBoard : () => {} }
					/>
				) ) }
			</div>
		</div>
	)
}

const GamePageHandler = ( { match } ) => {
	const history = useHistory()

	// If there is no userId in session storage go to join page.
	useEffect( () => {
		if ( !sessionStorage.getItem( 'userId' ) || !sessionStorage.getItem( 'token' ) ) {
			history.push( `/join/${ match?.params?.id }` )
		}
	} )

	if ( !sessionStorage.getItem( 'token' ) ) {
		return null
	}

	return <GamePage match={ match } />
}

GamePageHandler.propTypes = {
	match: PropTypes.object.isRequired
}

GamePage.propTypes = {
	match: PropTypes.object.isRequired
}

CardsOnTable.propTypes = {
	name: PropTypes.string.isRequired,
	face: PropTypes.string,
	isShown: PropTypes.bool,
}

CardsOnTable.defaultProps = {
	face: null,
	isShown: false
}

export default GamePageHandler
