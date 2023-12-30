import '../stylesheets/App.css';
import axios from "axios";
import React, { useState } from 'react';

function Register({updateRegisterBool, updateLoginBool}) {

    const [formInput, setFormInput] = useState({

        username: '',
        email: '',
        passwordHash: '',
        verifiedPass: ''

    })

    async function registerUser(event) {

        event.preventDefault();

        const {username, email, passwordHash, verifiedPass} = formInput;

        if (passwordHash !== verifiedPass) {

            alert("Passwords do not match!")

        } else {

            //need to do the thing where the password cannot have parts of the username or email in it as well

            const user = {username, email, passwordHash};

            try {

                const res = await axios.post('http://localhost:8000/register', {user});

                console.log('User was mixed successfully:', res.data);

                //this will make it so once the user is sucessfully added, we redirect to the login page
                updateLoginBool(true);

                updateRegisterBool(false);

            } catch(err) {
                alert(err.response.data.error);
            }

        }

    }

    function updateUser(event) {
        const {value} = event.target;

        setFormInput((formInput) => ({
            ...formInput,
            username:value
        }))
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
            passwordHash:value
        }))
    }

    function updateVpassword(event) {
        const {value} = event.target;

        setFormInput((formInput) => ({
            ...formInput,
            verifiedPass:value
        }))
    }

    return (

        <div style={{paddingLeft: '50px'}}>

          <h2> Register </h2>

          <br/>

          <form className = "register_form" onSubmit={registerUser}>

            <h3>Username:</h3>
            <br/>
            <input placeholder="Enter a username" onChange = {updateUser}></input>
            <br/>
            <br/>
            <h3>Email:</h3>
            <br/>
            <input placeholder="Enter your email" onChange = {updateEmail}></input>
            <br/>
            <br/>
            <h3>Password:</h3>
            <br/>
            <input type = "password" placeholder="Enter a password" onChange = {updatePassword}></input>
            <br/>
            <br/>
            <h3>Password Verification:</h3>
            <br/>
            <input type = "password" placeholder="Verify your password" onChange = {updateVpassword}></input>
            <br/>
            <br/>
            <button>Sign Up</button>

          </form>

        </div>

      )

}

export default Register;
