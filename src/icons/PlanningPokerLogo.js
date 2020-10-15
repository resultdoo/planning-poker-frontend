import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'

const PlanningPokerLogo = ( { color, clickDisabled } ) => {
	const history = useHistory()

	return (
		<div style={ { color } } className="planning-poker-logo">
			<span
				className='icon-pp-logo'
				style={ { outline: 'none', cursor: 'pointer' } }
				onClick={ () => ( clickDisabled ? "" : history.push( '/' ) ) }
				onKeyPress={ () => ( clickDisabled ? "" : history.push( '/' ) ) }
				tabIndex={ 0 }
				role='button'
			>
				<span className='path1' />
				<span className='path2' />
				<span className='path3' />
				<span className='path4' />
				<span className='path5' />
				<span className='path6' />
				<span className='path7' />
				<span className='path8' />
				<span className='path9' />
				<span className='path10' />
				<span className='path11' />
				<span className='path12' />
				<span className='path13' />
				<span className='path14' />
				<span className='path15' />
				<span className='path16' />
				<span className='path17' />
				<span className='path18' />
				<span className='path19' />
				<span className='path20' />
				<span className='path21' />
				<span className='path22' />
			</span>
		</div>
	)
}

PlanningPokerLogo.propTypes = {
	color: PropTypes.string,
	clickDisabled: PropTypes.bool,
}

PlanningPokerLogo.defaultProps = {
	color: 'initial',
	clickDisabled: false
}

export default PlanningPokerLogo
