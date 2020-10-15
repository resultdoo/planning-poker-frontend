import React from 'react'
import PropTypes from 'prop-types'

const CoffeeIcon = ( { size, color } ) => (
	<div style={ { fontSize: size, color } }>
		<span className='icon-coffee' />
	</div>
)

CoffeeIcon.propTypes = {
	size: PropTypes.number,
	color: PropTypes.string
}

CoffeeIcon.defaultProps = {
	size: 32,
	color: 'initial',
}

export default CoffeeIcon
