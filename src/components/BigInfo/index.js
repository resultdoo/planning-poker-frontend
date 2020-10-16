import React from 'react'
import './BigInfo.css'

const BigInfo = () => (
	<div className="info-big">
		<span>Made with </span>
		<span className="love"><i className="fas fa-heart"></i></span>
		<span> at <a className="info-link big" href="https://www.result.eu/graphql">RESULT</a></span>
        <p>
            Powered by our friends at <a className="info-link big" href="https://www.hasura.io">Hasura</a>
        </p>
        <p>-</p>
        <p className="info-text-header">
            <a class="info-link big" href="https://github.com/resultdoo/planning-poker"><i className="fab fa-github"></i></a>
        </p>
        <p>Download the source code and run your own instance at your company or add something to the project.</p>
        <p>-</p>
        <p className="info-text-header">
            <a class="info-link big" href="https://bostjan-cigan.medium.com/developing-scrum-poker-with-hasura-graphql-engine-a-time-cost-comparison-28fbeefeea7d"><i className="fab fa-medium"></i></a>
        </p>
        <p>
            Read more about how we developed this app and how Hasura speeds up development time.
        </p>
    </div>
)

export default BigInfo
