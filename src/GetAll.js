import React, { useState, useEffect, useRef } from 'react';
import { Col, Row, Container, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function GetAll() {
    const navigate = useNavigate();
    const dataFetchedRef = useRef(false);
    const [users, setUsers] = useState('');

    const url = "http://localhost:5000/users";

    useEffect(() => {
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        axios.get(url)
            .then((response) => {
                console.log(response.data);
                setUsers(response.data);
                toast.success('Pridobivanje podatkov')
            })
            .catch(error => {
                console.error(`Error: ${error}`)
                toast.error("napaka pri pridobivanju podatkov")
            })
    }
    const deleteUser = (id) => {
        axios.delete(`${url}/${id}`).then((response) => {
            toast.info('Uporabnik izbrisan')
            getAllUsers()
        }).catch(error => {
            console.error(`Error: ${error}`)
            toast.error("napaka pri brisanju uporabnika")
        })
    }

    function MapUsers() {
        let elements = []
        users.map((user, index) => (
            elements.push(
                <Col id={"user" + index}sm={5} className='col' key={user.id}>
                    <h2>{user.name} {user.surname}</h2>
                    <h3>Naročnina: {user.is_subscribed}</h3>
                    <Button variant="secondary" onClick={() => Redirect(user.id)}>Uredi</Button>
                    <Button variant="primary" onClick={() => deleteUser(user.id)}>Izbriši</Button>
                </Col>
            )
        ));
        return <Container><Row>{elements}</Row></Container>
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
