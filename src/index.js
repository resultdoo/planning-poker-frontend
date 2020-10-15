import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import {
	BrowserRouter,
	Switch,
	Route
} from 'react-router-dom'

import './index.css'
import JoinPage from './pages/JoinPage'
import GamePageHandler from './pages/GamePage'
import LandingPage from './pages/LandingPage'
import CreateRoomPage from './pages/CreateRoomPage'
import apolloClient from './utils/apollo-config'

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={ apolloClient }>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={ LandingPage } />
					<Route path='/game/:id' component={ GamePageHandler } />
					<Route path='/join/:id' component={ JoinPage } />
					<Route path='/join' component={ JoinPage } />
					<Route path='/create' component={ CreateRoomPage } />
				</Switch>
			</BrowserRouter>
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById( 'root' )
)
