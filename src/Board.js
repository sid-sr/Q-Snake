import React, {Component} from 'react';
import SnakeDot from './SnakeDot.js';
import Food from './Food.js';
import State from './State.js'

const genCoords = () => {
    return [Math.floor(Math.random() * 20) * 5, Math.floor(Math.random() * 20) * 5];
}

const startState = {
    dots: [
        [0, 0]
    ],
    food: genCoords(),
    direction: 2,
    speed: 100,
    score: 0
}

const checkBounds = (head) => {
    return (head[0] < 0) || (head[0] > 95) || (head[1] < 0) || (head[1] > 95);
}

const dirs = [[-5, 0], [0, -5], [5, 0], [0, 5]];

class Board extends Component {
    
    state = startState
    
    componentDidMount () {
        setInterval(this.moveSnake, this.state.speed);
        document.onkeydown = this.onKeyDown;
    }

    componentDidUpdate() {
        this.checkCollapsed();
        this.checkBorders();
    }    

    onKeyDown = (e) => {
        e = e || window.event();
        var val = parseInt(e.keyCode)
        if(val >= 37 && val <= 40) {
            this.setState({direction: val - 37});
        }
    }

    moveSnake = () => {
        var state = this.state;
        var newx = state.dots[state.dots.length - 1][0];
        var newy = state.dots[state.dots.length - 1][1];
        var foodFound = false;
        var valid = true;
        
        newx += dirs[state.direction][0];
        newy += dirs[state.direction][1];

        if(newx === state.food[0] && newy === state.food[1]) {
            while(true) {
                valid = true;
                state.food = genCoords();
                // eslint-disable-next-line no-loop-func
                state.dots.forEach((dot, i) => {
                    if(dot[0] === state.food[0] && dot[1] === state.food[1]) {
                        valid = false;
                    }
                })
                if(valid) break;
            }
            state.score++;
            //if(state.speed > 20) state.speed -= 10;
            foodFound = true;
        }

        state.dots.push([newx, newy]);
        if(!foodFound)
            state.dots.shift();
        this.setState(state);
    }

    checkBorders = () => {
        var head = this.state.dots[this.state.dots.length - 1];
        if(checkBounds(head))
            this.gameOver();
    }

    checkCollapsed = () => {
        var state = this.state;
        var lost = false;
        var head = state.dots[state.dots.length - 1];
        state.dots.forEach((dot, i) => {
            if(i !== state.dots.length - 1 && head[0] === dot[0] && head[1] === dot[1]) {
                lost = true;
            }
        })   
        if(lost)
            this.gameOver();
    }

    gameOver = () => {
        this.setState({
            dots: [
                [0, 0]
            ],
            food: genCoords(),
            direction: 2,
            speed: 100, 
            score: 0
        });
    }
    /*
        State definition:
            surr = 3 cells around the head  0 - up  1 - left  2 - right
            dir = relative pos of the apple (8 vals 0 - 7)
    */
    getState = () => {
        var surr = [0, 0, 0];
        var dir = 0;
        var head = this.state.dots[this.state.dots.length - 1]
        var relx = head[0] - this.state.food[0];
        var rely = head[1] - this.state.food[1];
        var found_up = false, found_left = false, found_right = false;
        var upx, upy, leftx, lefty, rightx, righty;

        if(relx < 0 && rely < 0) dir = 6;//dir = 0;
        else if(relx === 0 && rely < 0) dir = 5; //dir = 6;
        else if(relx > 0 && rely < 0) dir = 4;//dir = 2;
        else if(relx > 0 && rely === 0) dir = 3;
        else if(relx > 0 && rely > 0) dir = 2;
        else if(relx === 0 && rely > 0) dir = 1;//dir = 5;
        else if(relx < 0 && rely > 0) dir = 0;//dir = 6;
        else if(relx < 0 && rely === 0) dir = 7;

        if(this.state.direction === 2) {
            upx = head[0] + 5;
            upy = head[1];
            leftx = head[0];
            lefty = head[1] - 5;
            rightx = head[0];
            righty = head[1] + 5;            
            dir = (8 + dir - 6) % 8;
        }
        else if(this.state.direction === 0) {
            upx = head[0] - 5;
            upy = head[1];
            leftx = head[0];
            lefty = head[1] + 5;
            rightx = head[0];
            righty = head[1] - 5;            
            dir = (8 + dir - 2) % 8;
        }
        else if(this.state.direction === 3) {
            upx = head[0];
            upy = head[1] + 5;
            leftx = head[0] + 5;
            lefty = head[1];
            rightx = head[0] - 5;
            righty = head[1];
            dir = (8 + dir - 4) % 8;
        }
        else {
            upx = head[0];
            upy = head[1] - 5;
            leftx = head[0] - 5;
            lefty = head[1];
            rightx = head[0] + 5;
            righty = head[1];
        }

        this.state.dots.forEach((dot) => {
            if(dot[0] === upx && dot[1] === upy) found_up = 1;
            else if(dot[0] === leftx && dot[1] === lefty) found_left = 1;
            else if(dot[0] === rightx && dot[1] === righty) found_right = 1;
        })

        if(checkBounds([upx, upy]) || found_up) surr[0] = 1;
        if(checkBounds([leftx, lefty]) || found_left) surr[1] = 1;
        if(checkBounds([rightx, righty]) || found_right) surr[2] = 1;        
        
        return [surr, dir];
    }

    qlearning = () => {

    }

    render() {
        return (
            <>
            <div>
                SCORE: {this.state.score} STATE: {this.getState()}
            </div>
            <div className='board-area'>
                <SnakeDot snakeDots={this.state.dots}/>
                <Food food={this.state.food} />
            </div>
            <div>
                <State curState={this.getState()} />
            </div>
            </>
        );
    }
}

export default Board;