import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export default function EditUser() {
    const [user, getUser] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state.id

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [sub, setSub] = useState('');

    useEffect(() => {
        getUserById(id);
    }, [id]);

    const url = "http://localhost:5000/users";
    const getUserById = (id) => {
        axios.get(`${url}/${id}`,{headers:{token: localStorage.getItem("token")}})
            .then((response) => {
                getUser(response.data[0]);
                toast.info("Uporabnik pridobljen")
            })
            .catch(error => {
                toast.error("napaka pri pridobivanju uporabnika, pridobivanje iz lokalne shrambe")
            })
    }
    const editUser = (id, user) => {
        axios.put(`${url}/${id}`, user,{headers:{token: localStorage.getItem("token")}})
        .then((response) => {
            console.log(response);
            toast.success("uporabnik sprmenjen")
            Redirect()
        }).catch(error => {
            console.error(`Error: ${error}`)
            toast.error("napaka pri spreminjanju")
        })
    }
    function Redirect() {
        navigate('../prikaz')
    }

    function handleSubmit(event) {
        event.preventDefault();
        const user = {
            name: name,
            surname: surname,
            is_subscribed: sub
        }
        editUser(id, user)
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
                        <Form.Control  onChange={handleName}></Form.Control><br />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Priimek</Form.Label>
                        <Form.Control  onChange={handleSurname}></Form.Control><br />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Naročnina?</Form.Label>
                        <Form.Control  onChange={handleSub}></Form.Control><br />
                    </Form.Group>
                    <Button variant="primary" type="submit">spremeni</Button>
                </Form>
            </Container>
            <ToastContainer />
        </>
    )
}