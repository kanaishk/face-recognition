import React from 'react';
import Particles from "react-tsparticles";
import Clarifai from 'clarifai';
import Navigation from '../components/Navigation/Navigation';
import Signin from '../components/Signin/Signin';
import Register from '../components/Register/Register';
import Logo from '../components/Logo/Logo';
import Rank from '../components/Rank/Rank';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
	apiKey: 'ba3377d8a3144862b221596efc1379e1'
});

const particlesOptions = {
    particles: { 
    	color: { value: "#ffffff",},
        links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
           	enable: true,
        },
      	move: {
        	direction: "none",
        	enable: true,
        	outMode: "bounce",
        	random: true,
        	speed: 2,
        	straight: false,
      	},
      	number: {
        	density: {
          		enable: true,
          		value_area: 800,
        	},
        	value: 120,
      	},
      	opacity: {
        	value: 0.5,
      	},
      	shape: {
        	type: "circle",
      	},
      	size: {
        	random: true,
        	value: 5,
      	},
    },
    detectRetina: true,
}

class App extends React.Component {
  	constructor() {
  		super();
  		this.state = {
  			input: '',
  			imageURL: '',
  			box: {},
  			route: 'signin',
  			isSignedin: false,
        user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
        }
  		}
  	}

    loadUser = (data) => {
      this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }})
    }

  	onInputChange = (event) => {
  		this.setState({input: event.target.value});
  	}

  	calculateFaceLocation = (data) => {
  		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  		const image = document.getElementById('inputimg');
  		const width = Number(image.width);
  		const height = Number(image.height);
  		return {
  			leftCol: clarifaiFace.left_col * width,
  			topRow: clarifaiFace.top_row * height,
  			rightCol: width*(1 - clarifaiFace.right_col),
  			bottomRow: height*(1 - clarifaiFace.bottom_row)
  		}
  	}

  	displayFaceBox = (box) => {
  		this.setState({box: box});
  	}

  	onButtonSubmit = () => {
  		this.setState({imageURL: this.state.input});
  		app.models
  			.predict(
  				Clarifai.FACE_DETECT_MODEL,
  				this.state.input
  			)
  			.then(response => {
          console.log('hi', response)
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, { entries: count}))
              })

          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
	  		.catch(err => console.log(err));
  	}

  	onRouteChange = (route) => {
  		if(route === 'signout') {
  			this.setState({isSignedin: false})
  		} else if (route === 'home') {
  			this.setState({isSignedin: true})
  		}
  		this.setState({route: route});
  	}

	render() {
		const {imageURL, box, route, isSignedin} = this.state;
	    return (
	    	<div className="App">
	    		<Particles
				    id="tsparticles"
				    className='particles'
				    options={particlesOptions}
				/>
	    		<Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange} />
	    		{ route === 'home'
	    			? <div>
				    		<Logo />
				    		<Rank 
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
				    		<ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}
                />
				    		<FaceRecognition box={box} imageURL={imageURL}/>
		    			</div>
		    		: ( route === 'signin'
  	    				?	<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
  		    			: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
		    		  )
	      		}
	      	</div>
	    );
	}
}

export default App;
