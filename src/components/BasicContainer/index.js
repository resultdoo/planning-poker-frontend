import React from 'react'
import PropTypes from 'prop-types'

import './BasicContainer.css'
import Info from '../Info'
import PlanningPokerLogo from '../../icons/PlanningPokerLogo'

const BasicContainer = ( { children } ) => {

	function openExternalURL() {
		const url = 'https://www.result.eu/graphql/'
		window.open( url, '_blank' )
	}

	return (
		<div className='basic-page'>
			<div />
			<div className='basic-container'>
				<div className='pp-logo'>
					<PlanningPokerLogo size={ 100 } />
				</div>
				{ children }
				<div 
					className='basic-result-logo'
					onClick={ () => openExternalURL() }
					onKeyPress={ () => openExternalURL() }
					tabIndex={ 0 }				
				/>
			</div>
			<div />
			<div className='footer-info'>
				<Info />
			</div>
		</div>
	)
}

BasicContainer.propTypes = {
	children: PropTypes.object.isRequired,
	noBack: PropTypes.bool
}

BasicContainer.defaultProps = {
	noBack: false
}

export default BasicContainer
