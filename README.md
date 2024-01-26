# Fake Stack Overflow

This is a clone of the popular website, stackoverflow, which I created in conjunction with a team. In this web application users can login to ask questions, answer questions, leave comments, upvote/downvote others questions, and gain reputation


## Load Page

This is the page that is seen once you load up the website. Here a user has the optino to either register, log into an existing account, or continue onto the site as a guest

![image](https://github.com/Aadith2022/fakestack/assets/113648765/dab95d5d-2282-46b0-8e10-f6bf1a4e2e15)


## Home Page

This is the page that is seen when a user is logged in. Here users can view all of the questions, upvote/downvote them, or ask a new question. For each question in the list consiting of the question title, description, the tags associated with the question, views, number of answers, buttons to upvote and downvote, the person who asked the question along with the time at which the question was asked

The buttons at the top of the page allow us to sort the questions by 'Newest',  'Active', and 'Unanswered'

* Newest: this button sorts all of the questions from newest to oldest
* Active: this sorts all the questions by having the ones answered most recently at the top
* Unasnwered: this shows all of the questions that have not yet been answered

![image](https://github.com/Aadith2022/fakestack/assets/113648765/0cdf10e6-650b-4db8-8745-651130465d1e)

In the header if the page, users that are logged can log out or search for specific questions, or tags

On the side bar, with buttons for 'Questions', 'Tags', and 'Profile'

* Questions: Displays all of the questions
  * All questions are show 5 at a time, and if there are more than 5 questions there will be a 'Next' button to show the next five
  * On the last page, pressing 'Next' will wrap back onto the first page of questions
* Tags: Displays all of the tags
* Profile: Displays the user's profile

Upvote/Downvote:

* Users can only vote on questions and answers if their reputation is above 50
* Upvoting a question or an answer increases the reputation of the corresponding user by 5
* Downvoting a question decreases the reputation of the corresponding user by 10


## Asking a Question

Only logged in users with at least 50 reputation have the abiity to ask a question

On pressing the 'Ask Question' button, a user can include the title of a question, summary, text, tags, and a username

![image](https://github.com/Aadith2022/fakestack/assets/113648765/6bca90c6-35b3-474f-9751-aba3efcf9f72)


## Question Details

Upon clicking the title for a question a user will be taken the details for that question

Here users will be able to do things such as leave comments on the question, answer the question, levae comments on answers, upvote/downvote answers, or upvote comments

* Unlike upvoting for questions and answers, there are no such reputation contraints for voting on comments

All of the answers for this question will be displayed in newest to oldest order

![image](https://github.com/Aadith2022/fakestack/assets/113648765/8bb96fa3-1a27-404b-87d0-79c1f2e77d36)


## Answering a question

Once a user presses the 'Answer Question' button, a form will appear where users can include their username as well as the text for their answer

![image](https://github.com/Aadith2022/fakestack/assets/113648765/74b88cfe-7ca7-410e-887e-3d5483f84eea)


## Tags Page

Upon pressing the 'Tags' button on the side bar, the user will be redirected to a page displaying all of the tags 

![image](https://github.com/Aadith2022/fakestack/assets/113648765/bed3009e-6f65-431c-8421-853010c19841)

When one of the tags is clicked, the user will be redirected to a page displaying all of the questions which use that tag, for example, these are the results from pressing the tag 'React'

![image](https://github.com/Aadith2022/fakestack/assets/113648765/3c59c855-ad10-4414-8f39-8c18660bc996)


## Profile

Pressing the 'Profile' button on the side bar will redirect the user to their profile, which includes the following information:

* The User's username
* How long the user was a member of the site
* The user's reputation
* A list consisting of links for all of the user's questions
* Links to all of the tags the user has created and questions they have answered

![image](https://github.com/Aadith2022/fakestack/assets/113648765/5eb35dcd-5861-44f1-b489-96ad8393e261)

When a user presses one of their questions from their profile, they have the ability to edit the information for that question or delete it entirely

![image](https://github.com/Aadith2022/fakestack/assets/113648765/72810ac9-8d04-4b51-b4a4-9071dd5d78c6)

If they press 'View all tags' from the Profile page, if a tag that they have created only has one question associated with it, then the user has the ability to edit or delete that tag

![image](https://github.com/Aadith2022/fakestack/assets/113648765/17ffbab0-00ed-49f7-a362-512a9eaac4e1)

If they press 'View all answered questions', the user will see a list of all of the questions they have answered
* Once they press the link for one of those questions, the user will have the ability to edit or delete any of their answers

![image](https://github.com/Aadith2022/fakestack/assets/113648765/d68efc54-062b-44ab-85fe-adc2d108011c)


## Admin account

This site features an admin account, which can be used by logging in with the email: admin@gmail.com, and password: 123

Every feature of the Admin is the same as any other user, except for the profile page. In the profile page, the admin has an additional section which disaplys all of the users in system. Clicking on one of the users in the list will take us to that user's profile page, and if we press the 'Delete User' button, the corresponding user will be removed from the system along with any questions, answers, and tags they have created. Once we press the profile of a user, the admin also has the ability to delte or edit any of the users tags, questions, or answers

![image](https://github.com/Aadith2022/fakestack/assets/113648765/3b7291d7-1c6a-4f90-a08c-6df23988cb80)


## Instructions to setup and run project
* Install the dependencies (express, mongoose, axios, cors, nodejs etc) and additional libraries bcrypt and express-sessions. Install MongoDB and make a database called fake_so and start it from the terminal(mongosh). 

* Run two terminals in VSCode, one for the client using npm start, and one for the server using nodemon server.js. 

* From the server terminal, run the script using this command: node init.js mongodb://127.0.0.1:27017/fake_so admin 123

* The command takes in admin username and admin password as the last two arguments. This script will populate the database with some initial values and from there you will be able to access the project from localhost:3000


## Technologies Used

* NodeJS and MongoDB was used on the backend
* React, HTML, and CSS was used in the frontend


## UML Diagram

![uml](https://github.com/Aadith2022/fakestack/assets/113648765/70baf4f8-dff6-49d9-90db-71d9729ef944)


## Database Diagram

![database](https://github.com/Aadith2022/fakestack/assets/113648765/56efdd0d-5b00-41f4-ab7d-aa7482c3b93e)
