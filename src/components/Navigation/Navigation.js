import React from 'react';

class Navigation extends React.Component {
  render() {
  	const {isSignedin, onRouteChange} = this.props;
	if(isSignedin) {
    	return (
    	<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
    		<p 
    			className='f3 link dim black underline pa3 pointer' 
    			onClick={() => onRouteChange('signout')}>
    			Sign Out
    		</p>
    	</nav>
    	)
	} else {
		return (
  			<div>
	  			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
		    		<p 
		    			className='f3 link dim black underline pa3 pointer' 
		    			onClick={() => onRouteChange('register')}>
		    			Register
		    		</p>
		    	</nav>
		    	<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
		    		<p 
		    			className='f3 link dim black underline pa3 pointer' 
		    			onClick={() => onRouteChange('signin')}>
		    			Sign In
		    		</p>
		    	</nav>
	    	</div>
    	)
	}
  }
}

export default Navigation;