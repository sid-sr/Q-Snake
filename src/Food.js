import React from 'react';

const Food = (props) => {
    const style = {
        left: `${props.food[0]}%`,
        top: `${props.food[1]}%`
    }

    return (
        <div className='food-dot' style={style}></div>
    )
}
export default Food;