import React from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GetAll from './GetAll';
import EditUser from './EditUser';
import CreateUser from './CreateUser';


function App() {
    window.localStorage.setItem("test", "test");
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <Container className='container'>
                        <Row className='row'>
                            <Col sm={12} md={12} className='col'>
                                <Link to="/prikaz" className='link_text' id="test">
                                    <h3 className='link_text_text'>Prikaz uporabnikov</h3>
                                </Link>
                            </Col>

                            <Col sm={12} md={12} className='col'>
                                <Link to="/ustvari" className="link_text">
                                    <h3 className='link_text_text'>Ustvari uporabnika</h3>
                                </Link>
                            </Col>
                        </Row>
                    </Container>
                } />
                <Route path="prikaz" element={<GetAll></GetAll>}></Route>
                <Route path="uredi" element={<EditUser></EditUser>}></Route>
                <Route path="ustvari" element={<CreateUser></CreateUser>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
