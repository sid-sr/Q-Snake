import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './QTable.css';
import {Row} from 'react-bootstrap';

function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

const dir_c = ['L', 'U', 'R', 'D'];

// 4 - impossible states
const best_moves = [
    [2, 1, 2, 3, 1, 1, 0, 3, 2, 2, 2, 2, 1, 1, 0, 4],
    [1, 1, 2, 3, 1, 1, 0, 3, 1, 1, 2, 2, 1, 1, 0, 4],
    [1, 1, 2, 3, 0, 1, 0, 3, 1, 1, 0, 2, 1, 1, 0, 4],
    [0, 3, 0, 3, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4],
    [3, 3, 3, 3, 0, 3, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4],
    [3, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 2, 0, 1, 0, 4],
    [3, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 0, 1, 0, 4],
    [2, 2, 2, 2, 3, 3, 0, 3, 2, 2, 2, 2, 0, 1, 0, 4]
];

const QTable = (props) => {
    return (
        <>
        <div style={{'margin-top': '30px', 'margin-bottom': '30px'}}>
        {
            
                props.curState.map((arr, row) => {
                    var v = arr.map(argMax)
                    return (
                        <Row>    
                        {      
                            v.map((val, col) => {
                                var c = col
                                return (
                                    
                                    props.found[row][c] === false
                                    ?                                
                                        <div className='square' style={{'background-color': 'white', 'text-align':'center'}}></div>
                                    :        
                                        val === best_moves[row][c]
                                        ?
                                            <div className='square' style={{'background-color': '#18ff85', 'text-align':'center'}}>{dir_c[val]}</div>
                                        :
                                            <div className='square' style={{'background-color': '#ea3c53', 'text-align':'center'}}>{dir_c[val]}</div>
                                )
                            })
                        }
                        </Row>
                    )    
                }) 
            
        }
        </div>
        </>
        
    )
}

export default QTable;