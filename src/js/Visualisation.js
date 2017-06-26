import React, { Component } from 'react'
import * as d3 from 'd3'

export class Visualisation extends Component {

	constructor() {
		super()

		this.margin = { top: 30, right: 10, bottom: 20, left: 60 }
		this.height = 250 - this.margin.top - this.margin.bottom
		this.width = 250 - this.margin.left - this.margin.right
		this.data = [100, 200, 300, 400]
	}

	renderChart() {
		


			this.update = this.d3graph							
												.selectAll('rect')
												.data(this.props.freqData, d => d)

			this.enter =	this.update.enter()
																.append('rect')
																.attr('fill', 'steelblue')
																.attr('stroke', 'black')
																.attr('stroke-width', 1)

			//Remove
			this.update.exit().remove()

			console.log(this.update.exit().remove())

			//Enter + Update
			this.enter.merge(this.update)
								.attr('height', d => this.height - this.yScale(d))
								.attr('width', this.rectWidth)
								.attr('x', (d, i) => i * this.rectWidth)
								.attr('y', d => this.yScale(d))
		
	}

	componentDidMount() {
		this.d3graph = d3.select(this.graph)
											.attr('height', this.height + this.margin.top + this.margin.bottom)
											.attr('width', this.width + this.margin.left + this.margin.right)
											.append('g')
												.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
												.attr('height', this.height)
												.attr('width', this.width)

		this.xScale = d3.scaleLinear()
										.domain([0, 20])
										.range([0, this.width])	

		this.yScale = d3.scaleLinear()
										.domain([0, 300])
										.range([this.height, 0])

		this.yAxis = this.d3graph.append('g')
															.call(d3.axisLeft(this.yScale).ticks(2))

		this.xAxis = this.d3graph.append('g')
															.attr('transform', `translate(0, ${this.height})`)
															.call(d3.axisBottom(this.xScale).ticks(2))

		this.rectWidth = this.width / 32

	}

	shouldComponentUpdate() {

		if(this.props.freqData) {
			this.renderChart()	
		}
		
		return true
	
	}
	
	render() {
		return (
				<svg ref={graph => this.graph = graph}></svg>
		)
	}
}