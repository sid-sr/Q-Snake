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
    for(var i = 0; i < 8; i++) {
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
    dots: [
        [0, 0]
    ],
    food: genCoords(),
    direction: 2,
    speed: 100,
    score: 0,
    justAte: false
}

const checkBounds = (head) => {
    return (head[0] < 0) || (head[0] > 95) || (head[1] < 0) || (head[1] > 95);
}


class Board extends Component {
    
    state = startState
    
    componentDidMount () {
        this.qlearning();
        //document.onkeydown = this.onKeyDown;
    }


    onKeyDown = (e) => {
        e = e || window.event();
        var val = parseInt(e.keyCode);
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
        if(!foodFound)
            state.dots.shift();
        this.setState(state);
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
            if(i !== state.dots.length - 1 && head[0] === dot[0] && head[1] === dot[1]) {
                lost = true;
            }
        })   
        return lost;
    }

    gameOver = () => {
        this.setState({
            dots: [
                [0, 0]
            ],
            food: genCoords(),
            direction: 2,
            speed: 100,
            score: 0,
            justAte: false
        });
    }

    action = (eps) => {
        var [surr, dir] = this.getState();
        var v1 = surr[0] + 2 * surr[1] + 4 * surr[2];
        if(Math.random() < eps) {
            return Math.floor(Math.random() * 4);
        }
        else {
            var mx = 0, ind = 0;
            for(var i = 0; i < 4; i++) {
                if(Q_table[v1][dir][i] >= mx) {
                    mx = Q_table[v1][dir][i];
                    ind = i;
                }
            }
            return ind;
        }
    }

    qlearning = async () => {
        var mx, done, reward;
        var next_surr, next_dir, next_v1;
        var surr, dir, v1;

        var eps = 0.5;
        var discount_factor = 0.99;

        for(var ep = 0; ep < 100; ep++) {
            done = false;
            [surr, dir] = this.getState();
            v1 = surr[0] + 2 * surr[1] + 4 * surr[2];
            while(!done) {
                // step
                var vv = this.action(eps);
                this.setState({direction: vv})
                await delay(10);
                this.moveSnake();

                // done check
                done = (this.checkCollapsed() || this.checkBorders());
                
                // reward
                if(done) reward = -50;
                else if(this.state.justAte) reward = 5;
                else reward = -1;

                [next_surr, next_dir] = this.getState();
                next_v1 = next_surr[0] + 2 * next_surr[1] + 4 * next_surr[2];

                mx = 0;
                for(var i = 0; i < 4; i++) {
                    if(Q_table[next_v1][next_dir][i] >= mx) {
                        mx = Q_table[next_v1][next_dir][i];
                    }
                }              

                Q_table[v1][dir] += 0.01 * (reward + discount_factor * mx - Q_table[v1][dir])
                
                console.log("Reward: ", reward);
            }
            this.gameOver();
            if(eps * 0.99 >= 0.01) eps *= 0.99;
            console.log("Done", ep);
        }
    }

    /*
        State definition:
            surr = 3 cells around the head  0 - up  1 - left  2 - right
            dir = relative pos of the apple (8 vals 0 - 7)
    */
    getState = () => {
        var surr = [0, 0, 0];
        var dir = 0, dir_ = this.state.direction;
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

        if(dir_ === 2) {
            upx = head[0] + 5;
            upy = head[1];
            leftx = head[0];
            lefty = head[1] - 5;
            rightx = head[0];
            righty = head[1] + 5;            
            dir = (8 + dir - 6) % 8;
        }
        else if(dir_ === 0) {
            upx = head[0] - 5;
            upy = head[1];
            leftx = head[0];
            lefty = head[1] + 5;
            rightx = head[0];
            righty = head[1] - 5;            
            dir = (8 + dir - 2) % 8;
        }
        else if(dir_=== 3) {
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
            </div>
            </>
        );
    }
}

export default Board;