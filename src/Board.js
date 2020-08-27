import React, {Component} from 'react';
import SnakeDot from './SnakeDot.js';
import Food from './Food.js';
import State from './State.js'
import Logo from './img/cyborg-25.png';
import { Container, Row, Col } from 'react-bootstrap';

const genCoords = () => {
    return [Math.floor(Math.random() * 20) * 5, Math.floor(Math.random() * 20) * 5];
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const manhattanDist = (p1, p2) => {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}

const createQTable = () => {
    var arr = [];
    for(var i = 0; i < 16; i++) {
        var oth = [];
        for(var j = 0; j < 8; j++) {
            oth.push([0, 0, 0, 0]);
        }
        arr.push(oth);
    }
    return arr;
}

var Q_table = createQTable();

const dirs = [[-5, 0], [0, -5], [5, 0], [0, 5]];

const startState = {

    // Environment params:
    dots: [
        genCoords()
    ],
    food: genCoords(),
    direction: 2,
    speed: 100,
    score: 0,
    justAte: false,
    
    // Q learning hyperparams:
    ep: 0,
    epsilon: 0.9,
    discount_factor: 1.0
}

const checkBounds = (head) => {
    return (head[0] < 0) || (head[0] > 95) || (head[1] < 0) || (head[1] > 95);
}


class Board extends Component {
    
    state = startState
    
    componentDidMount () {
        //this.qlearning();
        //setInterval(this.moveSnake, this.state.speed);
        //document.onkeydown = this.onKeyDown;
    }

    setDir (val) {
        if(this.state.dots.length === 2 && Math.abs(this.state.direction - (val - 37)) === 2) {
            this.setState({direction: val - 37});            
            return true;
        }
        else if(val >= 37 && val <= 40) {
            this.setState({direction: val - 37});
            return false;
        }
    }

    onKeyDown = (e) => {
        e = e || window.event();
        // length 2 opposite direction exception 
        if(this.setDir(parseInt(e.keyCode))) {
            this.gameOver();
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
        state.justAte = foodFound;
        state.dots.push([newx, newy]);
        if(this.checkBorders() || this.checkCollapsed()) {
            this.gameOver();
            return true;
        }
        else {
            if(!foodFound)
                state.dots.shift();
            this.setState(state);
            return false;
        }
    }

    checkBorders = () => {
        var head = this.state.dots[this.state.dots.length - 1];
        if(checkBounds(head)) {
            return true;
        }
        return false;
    }

    checkCollapsed = () => {
        var lost = false;
        var head = this.state.dots[this.state.dots.length - 1];
        this.state.dots.forEach((dot, i) => {
            if(i !== 0 && i !== this.state.dots.length - 1 && head[0] === dot[0] && head[1] === dot[1]) {
                lost = true;
            }
        })
        return lost;
    }

    gameOver = () => {
        this.setState({
            ...this.state,
            dots: [
                genCoords()
            ],
            food: genCoords(),
            direction: 2,
            speed: 100,
            score: 0,
            justAte: false,
        });
    }

    action = (eps) => {
        var [surr, dir] = this.getState();
        var v1 = surr[0] + (2 * surr[1]) + (4 * surr[2]) + (8 * surr[3]);
        if(Math.random() < eps) {
            return Math.floor(Math.random() * 4);
        }
        else {
            var mx = -100000, ind = 0;
            for(var i = 0; i < 4; i++) {
                if(Q_table[v1][dir][i] > mx) {
                    mx = Q_table[v1][dir][i];
                    ind = i;
                }
            }
            return parseInt(ind);
        }
    }

    qlearning = async () => {
        var mx, done, reward;
        var next_surr, next_dir, next_v1;
        var surr, dir, v1, dist, action, steps;

        var epsilon = this.state.epsilon;
        var discount_factor = this.state.discount_factor;
        var dec = (0.9) / 140;

        for(var ep = 0; ep < 150; ep++) {
            done = false;
            [surr, dir] = this.getState();
            v1 = surr[0] + (2 * surr[1]) + (4 * surr[2]) + (8 * surr[3]);
            steps = 0;

            while(!done) {
                dist = manhattanDist(this.state.food, this.state.dots[this.state.dots.length - 1]);

                // step
                action = this.action(epsilon);
                
                // moving and checking the length 2 edge case:
                if(this.setDir(action + 37)) done = true;
                if(ep >= 140) await delay(100);
                else await delay(10);
                
                done = done || (steps >= 500) || this.moveSnake();
                if(!done) {
                    [next_surr, next_dir] = this.getState();
                    next_v1 = next_surr[0] + (2 * next_surr[1]) + (4 * next_surr[2]) + (8 * next_surr[3]);
                }

                // reward
                if(done) 
                    reward = -100;
                else if(this.state.justAte) 
                    reward = 30;
                else if(manhattanDist(this.state.food, this.state.dots[this.state.dots.length - 1]) < dist) 
                    reward = 1;
                else 
                    reward = -5;  

                if(!done) {
                    mx = -100000;
                    for(var i = 0; i < 4; i++) {
                        if(Q_table[next_v1][next_dir][i] >= mx) {
                            mx = Q_table[next_v1][next_dir][i];
                        }
                    }
                }          
                else mx = 0;      

                Q_table[v1][dir][action] += 0.01 * ((reward + (discount_factor * mx)) - Q_table[v1][dir][action])
                
                v1 = next_v1;
                dir = next_dir;
                if(this.state.justAte)
                    steps++;
                else 
                    steps = 0
            }
            this.gameOver();    
            if(epsilon - dec >= 0.0) epsilon -= dec;
            else epsilon = 0;
        
            this.setState({...this.state, ep: ep+1, epsilon: epsilon})
        }
        console.log(Q_table);
    }

    /*
        State definition:
            surr = 4 cells around the head  LURD
            dir = relative pos of the apple (8 possible vals 0 - 7)
    */
    getState = () => {
        var surr = [0, 0, 0, 0];
        var dir = 0;
        var head = this.state.dots[this.state.dots.length - 1]
        var relx = head[0] - this.state.food[0];
        var rely = head[1] - this.state.food[1];

        if(relx < 0 && rely < 0) dir = 6;
        else if(relx === 0 && rely < 0) dir = 5;
        else if(relx > 0 && rely < 0) dir = 4;
        else if(relx > 0 && rely === 0) dir = 3;
        else if(relx > 0 && rely > 0) dir = 2;
        else if(relx === 0 && rely > 0) dir = 1;
        else if(relx < 0 && rely > 0) dir = 0;
        else if(relx < 0 && rely === 0) dir = 7;

        for(var index = 0; index < 4; index++) {    
            if(checkBounds([head[0] + dirs[index][0],  head[1] + dirs[index][1]])) {
                surr[index] = 1;
            }
            else {
                // eslint-disable-next-line no-loop-func
                this.state.dots.forEach((dot, i) => {
                    if(i <= this.state.dots.length - 2) {
                        if((dot[0] === (head[0] + dirs[index][0])) && (dot[1] === (head[1] + dirs[index][1]))) 
                            surr[index] = 1;
                    }
                })
            }
        }    

        return [surr, dir];
    }

    render() {
        return (
            <>
            </>
        );
    }
}

export default Board;