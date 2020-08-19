import React from 'react';

const SnakeDot = (props) => {
    return (
        <div>
            {
                props.snakeDots.map((dot, i) => {
                    const style = {
                        left: `${dot[0]}%`,
                        top: `${dot[1]}%`,
                    }
                    return (                    
                        <div className='board-dot' key={i} style={style}></div>                            
                    )
                })                            
            }            
        </div>
    )
}

export default SnakeDot;