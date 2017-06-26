import React, { Component } from 'react'

import { Visualisation } from './Visualisation'

export class Microphone extends Component {

	constructor() {
		super()

		this.state = {
			frequencyData: []
		}

		this.handleRecordStartClick = this.handleRecordStartClick.bind(this)
		this.handleRecordStopClick = this.handleRecordStopClick.bind(this)
		this.renderChart = this.renderChart.bind(this)
		this.chunks = []
	}

	handleRecordStartClick() {
		var mediaRecorder

		navigator.mediaDevices.getUserMedia({ audio: true })
													.then((stream) => {
														console.log(stream)

														this.mediaRecorder = new MediaRecorder(stream)
														
														this.mediaRecorder.start();
													  console.log(this.mediaRecorder.state);
													  console.log("recorder started");

														this.mediaRecorder.ondataavailable = e => {
														  this.chunks.push(e.data)
														  console.log(e.data)
														}

														this.audioCtx = new AudioContext()

														this.source = this.audioCtx.createMediaStreamSource(stream)

														this.analyser = this.audioCtx.createAnalyser()

														//connect output of <audio> element to input of analyser 
														this.source.connect(this.analyser)
														this.analyser.fftSize = 64

														this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount)

														//connect to speakers DON'T FEDDBACK!!!
														//this.source.connect(this.audioCtx.destination)

														this.renderChart()

													})
													.catch(err => console.log(err));
	}

	handleRecordStopClick() {

		this.mediaRecorder.stop()
	  console.log(this.mediaRecorder.state)
	  console.log('recorder stopped')


	  this.mediaRecorder.onstop = (e) => {
	  	var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' })
  		this.chunks = []
  		var audioURL = window.URL.createObjectURL(blob)
  		this.audio.src = audioURL;
	  }
	}

	renderChart() {
		requestAnimationFrame(this.renderChart)
		// Copy frequency data to frequencyData array.
   	this.analyser.getByteFrequencyData(this.frequencyArray);

   	this.setState({ frequencyArray: this.frequencyArray })
   	
	}

	componentDidmount() {

		this.renderChart()
	}

	render () {
		return (
			<div>
				<audio ref={audio => this.audio = audio}>
				</audio>
				<Visualisation freqData={this.state.frequencyArray} />
				<h3>Microphone</h3>
				<button onClick={this.handleRecordStartClick}>Start Recording</button>
				<button onClick={this.handleRecordStopClick}>Stop Recording</button>
			</div>
		)
	}
}