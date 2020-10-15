import React from 'react'
import { useHistory } from 'react-router-dom'

import './LandingPage.css'
import BasicContainer from '../../components/BasicContainer'

const LandingPage = () => {
	const history = useHistory()

	return (
		<BasicContainer noBack>
			<div className='landing-page-actions'>
				<button type='button' className='basic-btn' onClick={ () => history.push( '/create' ) }>Create room</button>
				<button type='button' className='basic-btn' onClick={ () => history.push( '/join' ) }>Join room</button>
			</div>
		</BasicContainer>
	)
}

export default LandingPage
