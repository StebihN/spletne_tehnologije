import React, { useState, useEffect } from 'react';
import { Col, Row, Container, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';


export default function GetAll(props) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);


    const url = "http://localhost:5000/users";

    useEffect(() => {
        getAllUsers();
    }, [props.connection]);


    const getAllUsers = () => {
        if (props.connection) {
            console.log("connection is available")
            axios.get(url, {headers:{token: localStorage.getItem("token")}})
                .then((response) => {
                    toast.success('Pridobivanje podatkov')
                    setUsers(response.data)
                    console.log(response.data)
                })
                .catch(error => {
                    toast.error("napaka pri pridobivanju podatkov")
                    console.log(`error ${error}`)
                })
        }
        else {
            let localUsers = []
            for (let i = 0; i < localStorage.length; i++) {
                if(localStorage.getItem(localStorage.key(i)).includes("{")){
                    localUsers.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
                }                
            }
            setUsers(localUsers)
        }

    }
    const deleteUser = (id) => {
        axios.delete(`${url}/${id}`, {headers:{token: localStorage.getItem("token")}})
        .then((response) => {
            toast.info('Uporabnik izbrisan')
            getAllUsers()
        }).catch(error => {
            toast.error("napaka pri brisanju uporabnika")
        })
    }

    function MapUsers() {
        let elements = []
        users.map((user, index) => {
            elements.push(
                <Col id={"user" + index} sm={5} className='col' key={user.id}>
                    <h2>{user.name} {user.surname}</h2>
                    <h3>Naročnina: {user.is_subscribed}</h3>
                    <Button variant="secondary" onClick={() => Redirect(user.id)}>Uredi</Button>
                    <Button variant="primary" onClick={() => deleteUser(user.id)}>Izbriši</Button>
                </Col>
            )
            return null
        });
        return (<Container><Row>{elements}</Row></Container>)
    }
    function Redirect(id) {
        navigate('../uredi', { state: { id: id } })
    }
    if (users.length > 0) {
        return (

            <>
                <Container>
                    <MapUsers></MapUsers>
                    <ToastContainer />
                </Container>
            </>
        )
    } else {
        return (
            <>
                <Container>
                    <h3>Ni uporabnikov!</h3>
                </Container>
                <ToastContainer />
            </>
        )
    }
}
