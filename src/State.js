import React from 'react';
import './State.css'
import { Col, OverlayTrigger, Tooltip } from 'react-bootstrap';

const dir_map = [
    ['66.66%', '0%'],
    ['33.33%', '0%'],
    ['0%', '0%'],
    ['0%', '33.33%'],
    ['0%', '66.66%'],
    ['33.33%', '66.66%'],
    ['66.66%', '66.66%'],
    ['66.66%', '33.33%'],
];


const State = (props) => {
    return (
        <>
            <Col>
                <OverlayTrigger
                    key={0}
                    placement={'right'}
                    overlay={
                        <Tooltip id={`tooltip-${'right'}`}>
                            The presence of immediate danger (either a wall or the snake body itself) one step ahead in all four directions. There could be danger in multiple directions at the same time, so 4 directions -> 16 possible combinations.
                        </Tooltip>
                    }
                >
                    <div className='state-dir-area'>
                        {
                            <>
                                <div className='state-dot' key={3} style={{ 'left': '33.33%', 'top': '33.33%', 'background-color': 'gray' }}></div>
                                <div className='state-dot' key={4} style={{ 'left': '33.33%', 'top': '66.66%', 'background-color': 'gray' }}></div>
                            </>
                        }
                        {
                            props.curState[0][0] === 1
                                ?
                                <div className='state-dot' key={0} style={{ 'left': '0%', 'top': '33.33%' }}></div>
                                :
                                null
                        }
                        {
                            props.curState[0][1] === 1
                                ?
                                <div className='state-dot' key={1} style={{ 'left': '33.33%', 'top': '0%' }}></div>
                                :
                                null
                        }
                        {
                            props.curState[0][2] === 1
                                ?
                                <div className='state-dot' key={2} style={{ 'left': '66.66%', 'top': '33.33%' }}></div>
                                :
                                null
                        }
                        {
                            props.curState[0][3] === 1
                                ?
                                <div className='state-dot' key={3} style={{ 'left': '33.33%', 'top': '66.66%' }}></div>
                                :
                                null
                        }
                    </div>
                </OverlayTrigger>
            </Col>
            <Col>
                <OverlayTrigger
                    key={1}
                    placement={'right'}
                    overlay={
                        <Tooltip id={`tooltip-${'right'}`}>
                            The relative position of the apple with respect to the snake. This has 7 possible values: Bottom Left, Left, Top Left, Up and so on.
                        </Tooltip>
                    }
                >
                    <div className='state-apple-area'>
                        {
                            <>
                                <div className='state-dot' key={5} style={{ 'left': '33.33%', 'top': '33.33%', 'background-color': 'gray' }}></div>
                                <div className='state-dot' key={6} style={{ 'left': '33.33%', 'top': '66.66%', 'background-color': 'gray' }}></div>
                            </>
                        }
                        {
                            <div className='state-dot' key={7} style={{ 'left': dir_map[props.curState[1]][0], 'top': dir_map[props.curState[1]][1], 'background-color': 'black' }}></div>
                        }
                    </div>
                </OverlayTrigger>
            </Col>
        </>
    );
}

export default State;