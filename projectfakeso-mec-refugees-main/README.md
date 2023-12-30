[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project
* Install the dependencies(express, mongoose, axios, cors, nodejs etc) and additional libraries bcrypt and express-sessions. Install MongoDB and make a database called fake_so and start it from the terminal(mongosh). 

* Run two terminals in VSCode, one for the client using npm start, and one for the server using nodemon server.js. 

* From the server terminal, run the script using this command: node init.js mongodb://127.0.0.1:27017/fake_so admin 123

* The command takes in admin username and admin password as the last two arguments. This script will populate the database with some initial values and from there you will be able to access the project from localhost:3000

## Yang Lu Contribution
* Login and authentication
* Guest Login Restrictions
* Voting System (upvotes/downvotes)
* Reputation System
* Adding Comments
* Deleting questions, answers, comments
* Wrote init.js


## Aadith Samala Contribution
* Sessions and Registration
* Displaying Next and Prev Questions,answers,comments
* User Profile (Showing questions/tags/answers)
* Editing the user's questions/tags/answers
* Admin User Profile
* UML Diagram
