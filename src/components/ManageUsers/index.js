import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import './ManageUsers.css'

/* global sessionStorage */

const DELETE_USER = gql`
mutation DeleteUser( $userId: bigint! ) {
    delete_users_by_pk( id: $userId ) {
        id
    }
}`

const ManageUsers = ( { users } ) => {
	const [ deleteUser ] = useMutation( DELETE_USER, {
		onError: ( error ) => {
			console.log( error )
		}
	} )

	function deleteUserHandler( userId ) {
		deleteUser( { variables: { userId } } )
	}

	return (
		<div id='manage-users-container'>
			<div className='manage-user-title'>Joined users</div>
			{ users.map( ( user ) => (
				<p key={ user.userId } className='user-row'>
					<span className='user-name'>{`${ user.name }`}</span>
					{ user.userId === parseInt( sessionStorage.getItem( 'userId' ), 10 ) ? null
						: (
							<button
								className='btn-remove'
								type='button'
								title='Remove user'
								onClick={ () => deleteUserHandler( parseInt( user.userId, 10 ) ) }
							>
								<span className='user-remove' role='img' aria-label='remove'>&#10060;</span>
							</button>
						)}
				</p>
			) )}
		</div>
	)
}

ManageUsers.propTypes = {
	users: PropTypes.array.isRequired
}

export default ManageUsers
