import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'

/* global sessionStorage */

const authMiddleware = new ApolloLink( ( operation, forward ) => {
	operation.setContext( {
		headers: sessionStorage.getItem( 'token' ) ? {
			Authorization: `Bearer ${ sessionStorage.getItem( 'token' ) }`
		} : undefined,
	} )

	return forward( operation )
} )

const httpLink = new HttpLink( {
	uri: process.env.REACT_APP_HASURA_URL
} )

const wsLink = new WebSocketLink( {
	uri: process.env.REACT_APP_HASURA_SUBSCRIPTION_URL,
	options: {
		reconnect: true,
		connectionParams() {
			return {
				headers: sessionStorage.getItem( 'token' ) ? {
					Authorization: `Bearer ${ sessionStorage.getItem( 'token' ) }`
				} : undefined,
			}
		}
	}
} )

const link = ApolloLink.split(
	( { query } ) => {
		const { kind, operation } = getMainDefinition( query )
		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	wsLink,
	httpLink
)

const cache = new InMemoryCache()

const client = new ApolloClient( {
	link: ApolloLink.from( [
		onError( ( { graphQLErrors, networkError } ) => {
			if ( graphQLErrors ) {
				graphQLErrors.forEach( ( error ) => {
					console.log( 'GraphQLError from apollo.js - ', error )
				} )
			}
			if ( networkError ) {
				if ( networkError.message === 'no subscriptions exist' ) {
					window.location.reload()
				}
				console.log( 'NetworkError from apollo.js - ', networkError )
			}
		} ),
		authMiddleware,
		link
	] ),
	cache,
} )

export default client
