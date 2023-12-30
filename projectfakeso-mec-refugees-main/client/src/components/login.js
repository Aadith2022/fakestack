import '../stylesheets/App.css';
import axios from "axios";
import React, { useState } from 'react';

axios.defaults.withCredentials = true;

function Login({updateLoginBool, updateAuth, setAdmin}){
    const [formInput, setFormInput] = useState({
        email: '',
        password: ''

    })

    async function userLogin(e){
        e.preventDefault();
        const {email, password} = formInput;

        console.log('Form Input:', formInput);

        try{
            const res = await axios.post('http://localhost:8000/login', {email, password});

            console.log('USER LOGIN SUCCESS', res.data);

           
            if(res.data.isAdmin){
                setAdmin(true)
                console.log('GOT THE ADMIN TO LOGGINNNNN')
            }
            updateLoginBool(false)
            updateAuth(true);
          

        } catch(error){
            console.log('WRONG CREDZZZ', error)
            alert(error.response.data.error)
        }

    }

    function updateEmail(event) {
        const {value} = event.target;

        setFormInput((formInput) => ({
            ...formInput,
            email:value
        }))
    }

    function updatePassword(event) {
        const {value} = event.target;

        setFormInput((formInput) => ({
            ...formInput,
            password:value
        }))
    }

    return (
        <div className="formContainer">
          <form className="loginForm">
            <label htmlFor="email" > Email: </label> <br />
            <input type="email" required onChange = {updateEmail}/> <br />
            <label htmlFor="password" > Password: </label> <br />
            <input type="password" required onChange = {updatePassword} /> <br />
            <button type="button" onClick={userLogin}> Login </button>
          </form>
        </div>
        );
}

export default Login;