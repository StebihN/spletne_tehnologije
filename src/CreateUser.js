import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function CreateUser(props) {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [sub, setSub] = useState('');
    const navigate = useNavigate();

    const createUser = (user) => {

        const url = "http://localhost:5000/users";

        let body = {
            id: Math.floor(Math.random() * 1001),
            name: user.name,
            surname: user.surname,
            is_subscribed: user.is_subscribed
        }

        if (props.connection) {
            console.log("connection is available")
            axios.post(url, body, {headers:{token: localStorage.getItem("token")}})
                .then((response) => {
                    if (response.data.affectedRows === 0) {
                        console.log('No rows affected. Retrying in 2 seconds...');
                        setTimeout(createUser(user), 2000);
                    }
                    if (response.data.affectedRows === 1) {
                        localStorage.setItem("user" + body.id, JSON.stringify(body))
                        toast.success("Uporabnik vstavljen")
                        Redirect()
                    }
                })
                .catch((error) => {
                    toast.error("napaka pri pridobivanju podatkov")
                    console.error(`Error: ${error.message}`);
                });
        }
        else {
            console.log("no connection")
            if (localStorage.getItem("user" + body.id)) {
                console.log('No rows affected. Retrying in 2 seconds...');
                setTimeout(createUser(user), 2000)
            } else {
                localStorage.setItem("user" + body.id, JSON.stringify(body))
                toast.success("Uporabnik vstavljen v lokalno bazo")
                Redirect()
            }
        }
    }

    function Redirect() {
        navigate('../')
    }

    function handleSubmit(event) {
        event.preventDefault();
        const user = {
            name: name,
            surname: surname,
            is_subscribed: sub
        }
        createUser(user)
    }
    function handleName(event) {
        setName(event.target.value);
    }
    function handleSurname(event) {
        setSurname(event.target.value);
    }
    function handleSub(event) {
        setSub(event.target.value);
    }
    return (
        <>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Ime</Form.Label>
                        <Form.Control onChange={handleName}></Form.Control><br />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Priimek</Form.Label>
                        <Form.Control onChange={handleSurname}></Form.Control><br />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Naročnina?</Form.Label>
                        <Form.Control onChange={handleSub}></Form.Control><br />
                    </Form.Group>
                    <Button variant="primary" type="submit">Vstavi</Button>
                </Form>
            </Container>
            <ToastContainer />
        </>
    )
}
