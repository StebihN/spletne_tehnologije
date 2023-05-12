import React, { useState, useEffect } from 'react';
import isOnline from 'is-online';
import axios from 'axios';
import { Container, Col, Row } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GetAll from './GetAll';
import EditUser from './EditUser';
import CreateUser from './CreateUser';


function App() {
    const [connection, setConnection] = useState("");
    const url = "http://localhost:5000/users";

    useEffect(() => {
        getToken();
        checkConnection();
        synchronizeData();
    }, [connection]);

    const getToken = () => {
        axios.get(`${url}/token/janez`)
            .then((response) => {
                localStorage.setItem("token", response.data)
            })
            .catch(error => {
                console.log(`error ${error}`)
            })
    }
    const checkConnection = () => {
        (async () => {
            setConnection(await isOnline());
            console.log("connection is:" + connection)
        })();
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    const synchronizeData = async () => {
        if (connection) {
            let users = []
            let localIds = []
            let onlineIds = []

            for (let i = 0; i < localStorage.length; i++) {
                if(localStorage.getItem(localStorage.key(i)).includes("{")){
                    users.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
                }                
            }

            await axios.get(url, {headers:{token: localStorage.getItem("token")}})
                .then((response) => {
                    response.data.forEach(user => {
                        onlineIds.push(user.id)
                    });
                })
                .catch(error => {
                    console.log(`error ${error}`)
                })

            users.forEach(user => {
                localIds.push(user.id)
            });

            localIds.sort(compareNumbers)
            onlineIds.sort(compareNumbers)

            console.log(localIds)
            console.log(onlineIds)


            for (let i = 0; i < localIds.length; i++) {
               let equal = onlineIds.find(element => element == localIds[i])
                if (equal) {
                    const user = JSON.parse(localStorage.getItem("user" + localIds[i]))
                    axios.put(`${url}/${onlineIds[i]}`, user, {headers:{token: localStorage.getItem("token")}})
                        .then((response) => {
                            console.log(response);
                        }).catch(error => {
                            console.error(`Error: ${error}`)
                        })
                }
                else{
                    const user = JSON.parse(localStorage.getItem("user" + localIds[i]))
                    axios.post(url, user, {headers:{token: localStorage.getItem("token")}})
                        .then((response) => {
                            console.log(response.data.affectedRows);
                        })
                        .catch((error) => {
                            console.error(`Error: ${error.message}`);
                        });
                }
            }
        }
    }

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
            <Route path="prikaz" element={<GetAll connection={connection}></GetAll>}></Route>
            <Route path="uredi" element={<EditUser></EditUser>}></Route>
            <Route path="ustvari" element={<CreateUser connection={connection}></CreateUser>}></Route>
        </Routes>
    </BrowserRouter>
)
}

export default App;
