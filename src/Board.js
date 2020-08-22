import React, {Component} from 'react';
import SnakeDot from './SnakeDot.js';
import Food from './Food.js';
import State from './State.js'
import Logo from './img/cyborg-25.png';

const genCoords = () => {
    return [Math.floor(Math.random() * 20) * 5, Math.floor(Math.random() * 20) * 5];
}

const delay = ms => new Promise(res => setTimeout(res, ms));


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
        this.qlearning();
        //setInterval(this.moveSnake, this.state.speed);
        //document.onkeydown = this.onKeyDown;
    }

    setDir (val) {
        if(val === 37) {
            if(this.state.direction !== 2)
                this.setState({direction: 0});
        }
        else if(val === 38) {
            if(this.state.direction !== 3)
                this.setState({direction: 1});
        }
        else if(val === 39) {
            if(this.state.direction !== 0)
                this.setState({direction: 2});
        }        
        else if(val === 40) {
            if(this.state.direction !== 1)
                this.setState({direction: 3});
        }        
    }

    onKeyDown = (e) => {
        e = e || window.event();
        this.setDir(parseInt(e.keyCode));
    }

    moveSnake = () => {
        var state = this.state;
        var newx = state.dots[state.dots.length - 1][0];
        var newy = state.dots[state.dots.length - 1][1];
        var foodFound = false;
        var valid = true;
        
        newx += dirs[state.direction][0];
        newy += dirs[state.direction][1];

        //newx += dirs[dir_][0];
        //newy += dirs[dir_][1];        

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
        var state = this.state;
        var lost = false;
        var head = state.dots[state.dots.length - 1];
        state.dots.forEach((dot, i) => {
            if(i !== 0 && i !== state.dots.length - 1 && head[0] === dot[0] && head[1] === dot[1]) {
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
        var v1 = surr[0] + 2 * surr[1] + 4 * surr[2] + 8 * surr[3];
        if(Math.random() < eps) {
            return Math.floor(Math.random() * 4);
        }
        else {
            var mx = -100000, ind = 0;
            for(var i = 0; i < 4; i++) {
                if(Q_table[v1][dir][i] >= mx) {
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
        var surr, dir, v1, dist;

        var epsilon = this.state.epsilon;
        var discount_factor = this.state.discount_factor;

        for(var ep = 0; ep < 200; ep++) {
            done = false;
            [surr, dir] = this.getState();
            v1 = surr[0] + 2 * surr[1] + 4 * surr[2] + 8 * surr[3];
            while(!done) {
                dist = Math.abs(this.state.food[0] - this.state.dots[this.state.dots.length-1][0])
                + Math.abs(this.state.food[1] - this.state.dots[this.state.dots.length-1][1]);
 
                // step
                this.setDir(this.action(epsilon) + 37);
                await delay(10);
                done = this.moveSnake();

                [next_surr, next_dir] = this.getState();
                next_v1 = next_surr[0] + 2 * next_surr[1] + 4 * next_surr[2] + 8 * next_surr[3];

                // reward
                if(done) reward = -50;
                else if(this.state.justAte === true) reward = 30;
                else if(Math.abs(this.state.food[0] - this.state.dots[this.state.dots.length-1][0])
                + Math.abs(this.state.food[1] - this.state.dots[this.state.dots.length-1][1]) < dist) 
                    reward = 2;
                else reward = -1;  

                //if(reward )
                //console.log(reward)

                mx = -100000;
                for(var i = 0; i < 4; i++) {
                    if(Q_table[next_v1][next_dir][i] >= mx) {
                        mx = Q_table[next_v1][next_dir][i];
                    }
                }              

                Q_table[v1][dir] += 0.01 * ((reward + discount_factor * mx) - Q_table[v1][dir])
            }
            this.gameOver();
            if((epsilon * 0.99) >= 0.01) epsilon *= 0.996;
            this.setState({...this.state, ep: ep+1, epsilon: epsilon})
        }
    }

    /*
        State definition:
            surr = 3 cells around the head  0 - up  1 - left  2 - right
            dir = relative pos of the apple (8 vals 0 - 7)
    */
    getState = () => {
        var surr = [0, 0, 0, 0];
        var dir = 0, dir_ = this.state.direction;
        var head = this.state.dots[this.state.dots.length - 1]
        var relx = head[0] - this.state.food[0];
        var rely = head[1] - this.state.food[1];

        if(relx < 0 && rely < 0) dir = 6;//dir = 0;
        else if(relx === 0 && rely < 0) dir = 5; //dir = 6;
        else if(relx > 0 && rely < 0) dir = 4;//dir = 2;
        else if(relx > 0 && rely === 0) dir = 3;
        else if(relx > 0 && rely > 0) dir = 2;
        else if(relx === 0 && rely > 0) dir = 1;//dir = 5;
        else if(relx < 0 && rely > 0) dir = 0;//dir = 6;
        else if(relx < 0 && rely === 0) dir = 7;

        if(dir_ === 2) {           
            //dir = (8 + dir - 6) % 8;
        }
        else if(dir_ === 0) {
            //dir = (8 + dir - 2) % 8;
        }
        else if(dir_=== 3) {
            //dir = (8 + dir - 4) % 8;
        }

        for(var index = 0; index < 4; index++) {    
            if(checkBounds([head[0] + dirs[index][0],  head[1] + dirs[index][1]])) {
                surr[index] = 1;
            }
            else {
                // eslint-disable-next-line no-loop-func
                this.state.dots.forEach((dot, i) => {
                    if(i < this.state.dots.length - 2) {
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
            <div className='heading'>
                <div className='top-container'>
                    <div></div>
                    <div className='main-text'>
                        <br></br><br></br>
                        <h1 style={{'font-family': 'FacileSans', 'font-size': 60}}>Q-Snake</h1>
                    </div>
                    <div className='main-image'>
                        <img src={Logo} alt='Q-Snake' width='250'></img>
                    </div>
                    <div></div>
                </div>
            </div>
            <div className='grid-container'>
                <div className='board-area'>
                    <SnakeDot snakeDots={this.state.dots}/>
                    <Food food={this.state.food} />
                </div>
                <div className='state-container'>
                    <State curState={this.getState()} />
                </div>
                Episode: {this.state.ep} Epsilon: {this.state.epsilon}
            </div>
            </>
        );
    }
}

export default Board;