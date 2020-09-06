import React from 'react';
import Board from './Board.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Container, Row, Col} from 'react-bootstrap';
import Logo from './img/cyborg-25.png';

function App() {
  return (
    <Container fluid className="wrapper">
      
      <Row className="justify-content-center align-items-center">
        
        <Col md="auto" lg="auto" sm="auto" xs="auto">
          <img src={Logo} width='300' alt='Q-Snake Logo'></img>
        </Col>
        <Col md="auto" lg="auto" sm="auto" xs="auto">
          <h1 style={{'font-family': 'FacileSans', 'font-size': 60, 'color': 'white'}}>Q-Snake</h1>
        </Col>        

      </Row>

      <Row className="justify-content-center align-content-center">
        <Col md="auto" lg="auto" sm="auto" xs="auto">
          <Card className='bg-light' style={{'max-width': '18em', 'min-width': '200px', 'background-color': '#fafafa'}}>
            <Card.Body>
              <Card.Title><b>What is this?</b></Card.Title>  
              <Card.Text>
                • An interactive visualiser for the Q-learning RL agent that plays Snake. 
                <br></br>
                • Allows you to set your own hyperparameters and see how the algorithm performs.
              </Card.Text>        
            </Card.Body>
          </Card>
        </Col>

        <Col md="auto" lg="auto" sm="auto" xs="auto">
          <Card className='bg-light' style={{'max-width': '18em', 'min-width': '200px', 'background-color': '#fafafa'}}>
            <Card.Body>
              <Card.Title><b>How do I use this?</b></Card.Title> 
              <Card.Text>
                • Just set the hyperparameters below and hit <b>Run</b>.
                <br></br>
                • Vary the speed to see how the snake plays towards the end.
                <br></br>
                • The <a href='https://www.github.com/sid-sr/q-snake'>code</a> for this project.
              </Card.Text>         
            </Card.Body>
          </Card>
        </Col>    

      </Row>

      <Board />

    </Container>
  );
}

export default App;
