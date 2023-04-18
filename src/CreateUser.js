import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function CreateUser(){
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [sub, setSub] = useState('');

    const navigate = useNavigate();

    const url = "http://localhost:5000/users";

    const createUser = (user) => {
        axios.post(url,user)
            .then((response) => {
                console.log(response);
                toast.success("Uporabnik vstavljen")
                Redirect()
            })
            .catch(error => {
                console.error(`Error: ${error}`)
                toast.error("napaka pri vnašanju uporabnika")
            })
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
