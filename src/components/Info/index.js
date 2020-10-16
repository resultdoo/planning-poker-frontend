import React from 'react'

const Info = () => (
	<div>
		<span>Made with </span>
		<span className="love"><i className="fas fa-heart"></i></span>
		<span> at <a className="info-link" href="https://www.result.eu/graphql">RESULT</a> &#183; <a className="info-link" href="https://github.com/resultdoo/planning-poker"><i className="fab fa-github"></i> <span className="info-text-desktop">Source</span></a> &#183; <a class="info-link" href="https://bostjan-cigan.medium.com/developing-scrum-poker-with-hasura-graphql-engine-a-time-cost-comparison-28fbeefeea7d"><i className="fab fa-medium"></i> <span className="info-text-desktop">Development story</span></a> <span className="info-text-desktop">- Powered by <a className="info-link" href="https://www.hasura.io">Hasura</a></span></span>
	</div>
)

export default Info
