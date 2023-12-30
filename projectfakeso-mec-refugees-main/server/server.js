// Application server
// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express')
const mongoose = require('mongoose')
const Question = require('./models/questions')
const Answer = require('./models/answers')
const Tag = require('./models/tags')
const User = require('./models/user')
const Comment = require('./models/comments')
const bcrypt = require('bcrypt')
const session = require('express-session')

const secret = process.argv[2] //we want to grab the 2nd argument from terminal for secret key for Sessions

var cors = require('cors')
const user = require('./models/user')

const app = express();
const port = 8000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

mongoose.connect('mongodb://127.0.0.1:27017/fake_so')
.then(() => {
    console.log('Connected to MongoDB!')
    
})
//need to specify json middleware so app can understand json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(
    session({
        path: '/',
        secret: `${secret}`,
        cookie: {},
        resave: false,
        saveUninitialized: false
    })
)

//TO ENABLE CORS
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsOptions))

//this will retrieve ALL questions
app.get('/questions', async (req, res) => { //async makes a function return a promise and allows use of await
    try {
      const questions = await Question.find({}); //await pauses execution of the rest of the function UNTIl questions.find is finished
      //console.log(questions); 
      res.status(200).json(questions); //send response back to client as json
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})


app.put('/question_views/:id', async(req, res) => {

    const questionId = req.params.id;
    const views = req.body;

    try {

        const updatedQuestion = await Question.findByIdAndUpdate(questionId, views, {new:true});
        res.status(200).json(updatedQuestion);

    } catch(error) {

        res.status(500).json({error: error.message});

    }

})

//GET ALL THE ANSWERS
app.get('/answers', async (req, res) => {
    try{
        const answers = await Answer.find({})
       // console.log(answers) ITS WORKING
        res.status(200).json(answers);
    } catch(error){
        res.status(500).json({error: error.message});
    }
})

//get a single answer
app.get('/thisanswer/:id', async (req, res) => {
    try{
        const ans_id = req.params.id;

        const this_answer = await Answer.findById(ans_id);

        res.status(200).json(this_answer);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
})

//GET ALL THE TAGS
app.get('/tags', async (req, res) => {
    try{
        const tags = await Tag.find({})
        //console.log(tags) ITS WORKING
        res.status(200).json(tags)
    }catch (error){
        res.status(500).json({error: error.message})
    }

})

//CREATE A NEW QUESTION
app.post('/createQuestion', async(req, res) => {
    try{

        console.log("This is the user creating the question right now")
        console.log(req.session.user);

        const user = req.session.user

        console.log("User store user");
        console.log(user);

        // if (user.reputation < 50) {
        //     return res.send({message: 'You require at least 50 reputation to create a question'});
        // }

        //create a new question based on the client request's body and save it into database

        const newQuestion = {
            ...req.body,   // Copy properties from req.body
            asker: user._id,  // Set the asker to the user's ID
        };

        const question = await Question.create(newQuestion);

        //const question = await Question.create(req.body)
       // console.log('NEW QUESTION CREATEDDDDD')
       // console.log(question)
        res.status(200).json(question)

    }catch(error){
        res.status(500).json({error: error.message})
    }
})


//edit a question
app.put('/editquestion/:id', async(req, res) => {

    if (req.session.user) {

        try{

            // if (user.reputation < 50) {
            //     return res.send({message: 'You require at least 50 reputation to create a question'});
            // }


            const questionID = req.params.id;

            const updatedFields = req.body;

            const question = await Question.findByIdAndUpdate(questionID, updatedFields, {new:true})

           // console.log("We have successfuly edited this question", question);

            res.status(200).json(question)

        }catch(error){
            res.status(500).json({error: error.message})
        }

    }

})


app.put('/editanswer/:id', async(req, res) => {

    if (req.session.user) {

        try {
            
            const answerId = req.params.id;

            const updatedFields = req.body;

            console.log("These are the updateFields", updatedFields);

            const answer = await Answer.findByIdAndUpdate(answerId, updatedFields, {new:true});

            console.log("We have edited this answer");

            res.status(200).json(answer);

        } catch (error) {
            res.status(500).json({error: error.message});
        }

    }

})


//CREATE A NEW TAG
app.post('/createTag', async(req, res) => {
    try{
        //create a new question based on the client request's body and save it into database
        // const tag = await Tag.create(req.body)

        const user = req.session.user;

        console.log("This is the user creating the new tag");
        console.log(user);

        //we also need to add the current user as the creator of this tag
        const newTag = {
            ...req.body,   // Copy properties from req.body
            creator: user._id,  // Set the asker to the user's ID
        };

        const tag = await Tag.create(newTag);
        
        console.log("This is the tag the we just created", tag);

       // console.log('NEW TAGGGG CREATEDDDD')
       // console.log(tag)
        res.status(200).json(tag)

    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//ADD AN ANSWER TO THE ANSWER ARRAY OF A QUESTION
app.put('/add_question_answer/:id', async(req, res) => {

    const questionId = req.params.id;
    const updateFields = req.body;
    
    try {

        const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateFields, {new:true});
        res.status(200).json(updatedQuestion);

    } catch(error) {

        res.status(500).json({error: error.message});

    }
    

});

//here we will try to add a new answer
app.post('/add_answer', (req, res) => {

    try {

        const user = req.session.user

        const answerData = req.body;

        answerData.asker = user._id

        const answer = new Answer(answerData);

        answer.save();

        res.status(200).json(answer);

    } catch(error) {
        res.status(500).json({error: error.message});
    }


})

//here we will try to register a new user
app.post('/register', async (req, res) => {

    try {

       // console.log("JELLO")

        const userData = req.body;

        const username = userData.user.username;

        const email = userData.user.email;

        //first we will need to see if there are already users with the same email

      //  console.log("HERE")

        const users = await User.find({});

        for (const user of users) {

            console.log("Below is the user");
            console.log(user);

            if (user.email == email) {
                console.log("Do we ever enter this state");
                return res.status(401).json({error: 'There is aready a user with this email, please try again'})
            }

        }

        //next we will do checking for the password

        //first we will get the string before the @
        const userstring = email.split('@')[0];

        if ( (userData.user.passwordHash.includes(username)) || (userData.user.passwordHash.includes(userstring)) ) {
            return res.status(500).json({error: 'Please do not include username or email information in your password'});
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // hash employs Blowfish algorithm

        const passwordHash = await bcrypt.hash(userData.user.passwordHash, salt);

        // now save the hash to the user
        const newUser = new User({
            username,
            email,
            passwordHash
        });

        const savedUser = await newUser.save();

        res.status(200).json(savedUser);

    } catch(error) {
        console.log("MELLO");
        res.status(500).json({error: error.message});
    }

})

//FIND A TAG BY ITS NAME
app.get('/findTag/:tagName', async(req, res) => {
    const tagName = req.params.tagName //get the tag name from the client
    const query = { name: tagName };

    try{
      //  console.log('I MADE IT BACK AT LEAST')
        //console.log(query)
       const tagRes = await Tag.find(query)
       //console.log('BUT DID I MAKE IT BACK HERE LOL')
      // console.log(tagRes)
       res.status(200).json(tagRes)
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

//find tag by id
app.get('/thistag/:id', async(req, res) => {

    try {

        const tagId = req.params.id;

        const this_tag = await Tag.findById(tagId);

        res.status(200).json(this_tag);

    } catch(error) {
        res.status(500).json({error: error.message});
    }
    
})

//here we will update a tag
app.put('/edittag/:id', async(req, res) => {

    try {

        const tagId = req.params.id;

        const update = req.body;

        const this_tag = await Tag.findByIdAndUpdate(tagId, update, {new:true});

        console.log("We have updated this tag");

        res.status(200).json(this_tag);

    } catch {
        res.status(500).json({error: error.message});
    }

})

//this will retrieve a single QUESTION
app.get('/getSingleQuest/:id', async(req, res)=> {
    try {
        const id = req.params.id; //deconstruct the id from the request params
       // console.log(id)
    const question = await Question.findById(id); //instead of using find all prods, use the function to search it by id 
        res.status(200).json(question);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//this will retrieve ALL users
app.get('/users', async (req, res) => { //async makes a function return a promise and allows use of await
    try {
      const users = await User.find({}); //await pauses execution of the rest of the function UNTIl questions.find is finished
      //console.log(users); 
      res.status(200).json(users); //send response back to client as json
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

//get a single user
app.get('/thisuser', async(req, res) => {

    try{
        const this_user = req.session.user;
        res.status(200).json(this_user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }

})

app.post('/login', async(req, res) => {
    try{
        const userEmail = req.body.email;
        const password = req.body.password;
        var isAdmin = false;

        //console.log('this is the uid: ' + userEmail)
        //console.log('this is the PW: ' + password)
        
        const user = await User.findOne({email: userEmail}) //need to use findOne or else will be array of user documents
        console.log('found a user: ', user)

        if(user.isAdmin){
            var isAdmin = true;
            console.log('this man da ADMINNNN')
        }

        if(user == null){
            return res.status(401).json({error: "Wrong Email or Password"})
        }

        const result = await bcrypt.compare(password, user.passwordHash)
        
        //console.log('uhh did i make it here')
        //console.log(result)

        if(result == true){
            req.session.user = user;
            req.session.save();
           // console.log("This is the user logging in");
           // console.log(req.session.user);
            res.status(200).json({user, result, isAdmin })
        } else{
            return res.status(401).json({error: "Wrong Email or Password"})
        }

    } catch(error){
        res.status(500).json({ error: error.message });
    }
})

app.post('/logout', async(req, res) => {

    try {

        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).json({error: 'Error logging out'});
                }
                res.status(200).json({message: 'Successfully logged out'});
            })
        }


    } catch {
        res.status(500).json({error: error.message});
    }

})

app.put('/upvotes/:id', async(req, res) => { //FOR UPVOTING A QUESTION

    const questionId = req.params.id;
    const upvotes = req.body;
    const user = req.session.user

   // console.log('this the user rn', user)

    // USER HAS TO HAVE 50 REPUTATION TO UPVOTE
    if (user.reputation < 50) {
        return res.send({message: 'You require at least 50 reputation to vote'});
    }

    try {

        const updatedQuestion = await Question.findByIdAndUpdate(questionId, upvotes, {new:true});
        res.status(200).json(updatedQuestion);

    } catch(error) {

        res.status(500).json({error: error.message});

    }

})

app.put('/ansUpvotes/:id', async(req, res) => { //FOR ANSWER UPVOTES

    const questionId = req.params.id;
    const upvotes = req.body;
    const user = req.session.user

     console.log(user)

    // USER HAS TO HAVE 50 REPUTATION TO UPVOTE
    if (user.reputation < 50) {
        return res.send({message: 'You require at least 50 reputation to vote'});
    }

    try {

        const updatedAnswer = await Answer.findByIdAndUpdate(questionId, upvotes, {new:true});
        res.status(200).json(updatedAnswer);

    } catch(error) {

        res.status(500).json({error: error.message});

    }

})

app.put('/commentsUpvotes/:id', async(req, res) => { //FOR ANSWER UPVOTES

    const commentId = req.params.id;
    const upvotes = req.body;

    try {

        const updatedComment = await Comment.findByIdAndUpdate(commentId, upvotes, {new:true});
        res.status(200).json(updatedComment);

    } catch(error) {

        res.status(500).json({error: error.message});

    }

})

//this will retrieve ALL comments
app.get('/comments', async (req, res) => { //async makes a function return a promise and allows use of await
    try {
        //console.log("ARE WE ACTUALLY GETTING HERE");
      const comments = await Comment.find({}); //await pauses execution of the rest of the function UNTIl questions.find is finished
      //console.log(comments); 
      res.status(200).json(comments); //send response back to client as json
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
})

//get a SINGULAR comment
app.get('/thiscomment/:id', async (req, res) => {

    const commendID = req.params.id;

    try {

        const comment = await Comment.findById(commendID);

        res.status(200).json(comment);

    } catch(error){
        res.status(500).json({error: error.message})
    }

})

//CREATE A NEW COMMENT
app.post('/createComment', async(req, res) => {
    try{
        const user = req.session.user

       // USER HAS TO HAVE 50 REPUTATION TO ADD COMMENTS
        if (user.reputation < 50) {
            return res.send({message: 'You require at least 50 reputation to create a comment'});
        }

        req.body.commenter = req.session.user.username;
    
        const comment = await Comment.create(req.body)
      
        res.status(200).json(comment)

    }catch(error){
        res.status(500).json({error: error.message})
    }
})

//ADD AN COMMENT TO THE COMMENT ARRAY OF A QUESTION
app.put('/add_question_comment/:id', async(req, res) => {

    const commenter = req.session.user
    const questionId = req.params.id;
    const updateFields = req.body;

    req.body.commenter = req.session.user.username;
    
    try {
        
        const updatedQuestion = await Question.findByIdAndUpdate(questionId, updateFields, {new:true});

       
        res.status(200).json(updatedQuestion);

    } catch(error) {

        res.status(500).json({error: error.message});

    }
    
});


//ADD AN COMMENT TO THE COMMENT ARRAY OF A QUESTION
app.put('/add_answer_comment/:id', async(req, res) => {

    const commenter = req.session.user
    const answerId = req.params.id;
    const updateFields = req.body;

    req.body.commenter = req.session.user.username;
    
    try {
        
        const updatedAnswer = await Answer.findByIdAndUpdate(answerId, updateFields, {new:true});

       
        res.status(200).json(updatedAnswer);

    } catch(error) {

        res.status(500).json({error: error.message});

    }
    
});

app.put('/questReputation/:id', async(req, res) => { //FOR UPVOTING A QUESTION

    const userId = req.params.id;
   // console.log('le userid', userId)
    const reputation = req.body;
  //  console.log('le reputation', reputation)

    try {

        const updatedUser = await User.findByIdAndUpdate(userId, reputation, {new:true});
        res.status(200).json(updatedUser);

    } catch(error) {

        res.status(500).json({error: error.message});

    }

})

//this will retrieve a single USER
app.get('/getSingleUser/:id', async(req, res)=> {
    try {
    const id = req.params.id; //deconstruct the id from the request params
       // console.log(id)
    const user = await User.findById(id); //instead of using find all prods, use the function to search it by id 
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.delete('/deleteUser/:id', async(req, res)=> {
    try{
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        console.log("Deleted the user");
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({error:error.message})
    }
})

app.delete('/deleteQuestion/:id', async(req,res) => {
    try{
        //console.log('lol im here at delete')
        const id = req.params.id;
        
      //  console.log(id)

        const question = await Question.findByIdAndDelete(id);

        if(!question){
            res.status(404)
            throw new Error('Couldnt find this question')
        }

        res.status(200).json(question)

    } catch(error){
        res.status(500).json({message: error.message})
    }
})

app.delete('/deleteAnswer/:id', async(req,res) => {
    try{
       // console.log('lol im here at delete')
        const id = req.params.id;
        
      //  console.log(id)

        const answer = await Answer.findByIdAndDelete(id);

        if(!answer){
            res.status(404)
            throw new Error('Couldnt find this answer')
        }

        res.status(200).json(answer)

    } catch(error){
        res.status(500).json({message: error.message})
    }
})

app.delete('/deleteComment/:id', async(req,res) => {
    try{
        //console.log('lol im here at delete')
        const id = req.params.id;
        
        //console.log(id)

        const comment = await Comment.findByIdAndDelete(id);

        if(!comment){
            res.status(404)
            throw new Error('Couldnt find this comment')
        }

        res.status(200).json(comment)

    } catch(error){
        res.status(500).json({message: error.message})
    }
})

app.delete('/deleteTag/:id', async(req, res) => {
    try{
       
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if(!tag){
            res.status(404)
            throw new Error('Couldnt find this tag')
        }
        res.status(200).json(tag)

    } catch(error){
        res.status(500).json({message: error.message})
    }
})


process.on('SIGINT', () => {

    server.close(() => {
        console.log('Server closed. Database instance disconnected')
    })

})