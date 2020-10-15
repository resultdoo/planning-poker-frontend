import React from 'react'
import PropTypes from 'prop-types'

import './Card.css'
import CoffeeIcon from '../../icons/CoffeeIcon'

const Card = ( { isShown, face, onClickHandle } ) => {
	function coffeeCheck( cardFace, size ) {
		if ( cardFace === 'coffee' ) {
			return <CoffeeIcon size={ size } />
		}
		return cardFace
	}

	return (
		<div
			id='card-container'
			role='button'
			tabIndex={ 0 }
			onKeyPress={ () => onClickHandle( face ) }
			onClick={ () => onClickHandle( face ) }
		>
			{ isShown && <span className='card-top-left'>{ coffeeCheck( face, 8 ) }</span> }
			{ isShown && <span className='card-bottom-right'>{ coffeeCheck( face, 8 ) }</span> }
			<div id='card-face' className={ isShown ? 'card-shown' : 'card-hidden' }>
				<span className='card-face-symbol'>{ isShown ? coffeeCheck( face, 24 ) : '' }</span>
			</div>
		</div>
	)
}

Card.propTypes = {
	isShown: PropTypes.bool,
	onClickHandle: PropTypes.func,
	face: PropTypes.string.isRequired
}

Card.defaultProps = {
	isShown: false,
	onClickHandle: () => {}
}

export default Card
