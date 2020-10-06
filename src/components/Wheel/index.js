import React, { useEffect, useState } from 'react';
import './style.css';

const initialState = {
  curr_angle: 0,
  item: 0
}

const WheelComponent = props => {
  const [transformValue, setTransformValue] = useState(initialState)
  const [noOfTurns, setNoOfTurns] = useState(5)
  const [mouseDrag, setMouseDrag] = useState(false)
  const [startAngle, setStartAngle] = useState(0)
  const [currRotation, setCurrentRotation] = useState(0)
  const [center, setCenter] = useState({
    x: 0,
    y: 0
  })
  const { rewards } = props;

  useEffect(() => {
    let wheel = document.getElementById('wheelDiv')
    let wheelBounds = wheel.getBoundingClientRect();
    let center = {
      x: wheelBounds.left + (wheelBounds.width / 2),
      y: wheelBounds.top + (wheelBounds.height / 2)
    }
    setCenter(center)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('touchmove', mouseMoveHandler)

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
      document.removeEventListener('touchmove', mouseMoveHandler)
    }
  })

  const rotateWheel = () => {
    document.getElementById('wheelDiv').classList.add('start-rotation')
    document.getElementById('arrowDiv').classList.add('move')
    let selected = Math.floor((Math.random() * rewards.length) + 1);
    let extra_val = transformValue.curr_angle % 360;
    let newAngle = (noOfTurns * 360 + (-360 * selected / rewards.length));
    let currAngle = transformValue.curr_angle + newAngle + (360 - extra_val);
    setTransformValue({
      curr_angle: currAngle,
      item: selected
    })
    let date = new Date()
    props.appendSpreadsheet({
      web_client: window.navigator.userAgent,
      timestamp: date.toLocaleString(),
      spin_result_index: selected + 1
    })

    setTimeout(() => {
      document.getElementById('arrowDiv').classList.remove('move')
    }, 4000)
  }

  const mouseDragStart = event => {
    let x_coord = event.clientX - center.x
    let y_coord = event.clientY - center.y
    let startAngle = (180 / Math.PI) * Math.atan2(y_coord, x_coord)
    setStartAngle(startAngle)
    setMouseDrag(true)
    setNoOfTurns(0)
  }

  const mouseDragEnd = () => {
    document.getElementById('wheelDiv').style.transform = ''
    setTransformValue(prev => {
      return {
        ...prev,
        curr_angle: prev.curr_angle + currRotation
      }
    })
    setMouseDrag(false)
    rotateWheel()
  }

  const mouseMoveHandler = event => {
    if (mouseDrag) {
      let x_coord = event.clientX - center.x
      let y_coord = event.clientY - center.y
      let currAngle = (180 / Math.PI) * Math.atan2(y_coord, x_coord)
      let rotationVal = currAngle - startAngle
      let rotationCount = noOfTurns;
      let absRotation = Math.abs(rotationVal);

      if(rotationCount < 5) {
        if(absRotation < 45)
          rotationCount = 1
        else if(absRotation < 90)
          rotationCount = 2
        else if(absRotation < 135)
          rotationCount = 3
        else if(absRotation < 180)
          rotationCount = 4
        else
          rotationCount = 5
      }

      let wheel = document.getElementById('wheelDiv');
      wheel.style.transform = `rotate(${rotationVal}deg)`
      setCurrentRotation(rotationVal)
      setNoOfTurns(rotationCount)
    }
    else
      return;
  }
  return (
    <div className='wheel-container' style={{
      '--total-items': rewards.length,
      '--transform-angle': `${transformValue.curr_angle}deg`,
      '--no-of-turns': noOfTurns,
      '--selected-item': transformValue.item
    }}>
      <div id='arrowDiv' className='down-arrow'></div>
      <div id='wheelDiv' className='wheel' onMouseDown={mouseDragStart} onMouseUp={mouseDragEnd} 
        onTouchStart={mouseDragStart} onTouchEnd={mouseDragEnd}>
        {
          rewards.map((item, index) => {
            let angleVal = 360 / rewards.length;
            let rotationAngle = (index * angleVal) - (angleVal / 3);
            return <div className='wheel-item' key={index}
              style={{
                '--item-index': index,
                '--item-angle': `${rotationAngle}deg`
              }}>
              <div className='item-text'>
                <div className='circle1'></div>
                <div className='circle2'></div>
                <div className='text'>
                  {item}
                </div>
              </div>
            </div>
          })
        }
      </div>
      <button className='spin-button' onClick={rotateWheel}>Spin</button>

      <div className='curved-arrow' style={{
        background: `linear-gradient(90deg, #E23A3A ${noOfTurns * 5}%, #DBD174 ${noOfTurns * 10}%, #148E2F ${noOfTurns * 20}%, grey 100%)`
      }}>
        <div className='arrow'></div>
        <div className='top'></div>
        <div className='bottom'></div>
        <div className='right'></div>
      </div>

    </div>
  )
}

export default WheelComponent;