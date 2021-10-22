import React from 'react';
import './FaceRecognition.css';

class FaceRecognition extends React.Component {
  render() {
  	const {box, imageURL} = this.props;
    return (
      <div className='center ma'>
      	<div className='absolute mt2'>
        	<img id='inputimg' alt= '' src={imageURL} width='500px' height='auto'/>
        	<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left:box.leftCol}} />        </div>
      </div>
    );
  }
}

export default FaceRecognition;