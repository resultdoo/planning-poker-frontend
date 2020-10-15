import React, { useState } from 'react'
import PropTypes from 'prop-types'

import './TextInput.css'

const TextInput = ( {
	id, placeholder, size, isCaps, onKeyPress
} ) => {
	const [ value, setValue ] = useState( '' )

	function optionalProps() {
		const optionalProps = {}
		if ( onKeyPress ) {
			optionalProps[ 'onKeyPress' ] = ( e ) => {
				onKeyPress( e )
			}
		}
		return optionalProps
	}

	return (
		<div className='text-input-container'>
			<input
				id={ id }
				type='text'
				name='TextInput'
				className='input-text'
				value={ value }
				style={ isCaps ? { textTransform: 'uppercase' } : { textTransform: 'none' } }
				onChange={ ( e ) => setValue( e.target.value ) }
				maxLength={ size }
				size={ size }
				{ ...optionalProps() }
				required
			/>
			<span className='floating-label'>{ placeholder }</span>
		</div>
	)
}

TextInput.propTypes = {
	placeholder: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	size: PropTypes.number,
	isCaps: PropTypes.bool,
	onKeyPress: PropTypes.func
}

TextInput.defaultProps = {
	size: 25,
	isCaps: false
}

export default TextInput
