// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.
let userArgs = process.argv.slice(2); //this slices the command line arguments FIRST TWO args OUTT
//for example if guy enters node init.js mongodb://127.0.0.1:27017/fake_so, then userargs removes node and initjs
//hence, the first element of userArgs is the mongodb path
//the arguments after that are the user admin and the admin password

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

if(userArgs[1] != 'admin' || userArgs[2] != '123'){
    console.log('ERROR: Wrong Admin Credentials! Enter "node init.js mongodb://127.0.0.1:27017/fake_so admin 123"');
    return
}

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Question = require('./models/questions')
const Answer = require('./models/answers')
const Tag = require('./models/tags')
const User = require('./models/user')
const Comment = require('./models/comments')

let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async function tagCreate(name, creator) {
    let tag = new Tag({ 
        name: name,
        creator: creator._id
    });

    let savedTag = await tag.save();
    return savedTag
}

async function answerCreate(text, ans_by, ans_date_time, upvotes, comments) {
    answerdetail = {
        text:text,
        asker: ans_by._id
    };
    if (ans_by != false) answerdetail.ans_by = ans_by.username;
    if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
    if (upvotes != false) answerdetail.upvotes = upvotes;
    if (comments != false) answerdetail.comments = comments;

    let answer = new Answer(answerdetail);
    let savedAns = await answer.save()
    return savedAns
}

async function userCreate(email, username, passwordHash, reputation, registryDate, isAdmin) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const realPW = await bcrypt.hash(passwordHash, salt);

    userDetail = {
        email: email,
        username: username,
        passwordHash: realPW,
        reputation: reputation,
        registryDate: Date.now(),
        isAdmin: isAdmin
        
    };

    let user = new User(userDetail);
    let savedUser = await user.save()
    return savedUser
}

async function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views, upvotes, comments) {
    qstndetail = {
      title: title,
      summary: summary,
      text: text,
      tags: tags,
      asked_by: asked_by.username,
      asker: asked_by._id
    }

    if (answers != false) qstndetail.answers = answers;
    if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
    if (views != false) qstndetail.views = views;
    if (upvotes != false) qstndetail.upvotes = upvotes;
    if (comments != false) qstndetail.comments = comments;
  
    let qstn = new Question(qstndetail);
    let savedQuest = await qstn.save();
    return savedQuest

}

async function commentCreate(text, commenter, upvotes, commentDate) {
    commentdetail = {
        text:text,
        commenter: commenter
    };
    
    if (upvotes != false) commentdetail.upvotes = upvotes;
    if (commentDate != false) commentdetail.commentDate = commentDate;

    let comment = new Comment(commentdetail);
    let savedCom = await comment.save();
    return savedCom
}

const populate = async () => {
    var u1 = await userCreate('tread@gmail.com', 'treadlightly', 'a', 80, false, false);
    var u2 = await userCreate('aady@gmail.com', 'aada', 'sam', 50, false, false);
    var u3 = await userCreate('bob@gmail.com', 'bobby', 'fisher', 0, false, false);
    var u4 = await userCreate('admin@gmail.com', 'admin', '123', 150, false, true);
    var u5 = await userCreate('david@gmail.com', 'david', 'a', 35, false, false);
    var u6 = await userCreate('harvey@gmail.com', 'harvey', 'a', 18, false, false);
    var u7 = await userCreate('jaime@gmail.com', 'jaime', 'a', 300, false, false);
    var u8 = await userCreate('andy@gmail.com', 'andy', 'a', 480, false, false);

    //CHANGE TREADLIGHTLY TO THE USERID OF TREADLIGHTLY
    var c1 = await commentCreate('this is a great question', 'treadlightly', 3, false);
    var c2 = await commentCreate('i have the same issue', 'treadlightly', 1, false);
    var c3 = await commentCreate('well i should have seen this coming', 'aada', 0, false);
    var c4 = await commentCreate('thanks so much this is great', 'bobby', 1, false);

    var c5 = await commentCreate('i cant believe it', 'david', 1, false);
    var c6 = await commentCreate('imagine my shock', 'harvey', 2, false);
    var c7 = await commentCreate('mind boggling man', 'jaime', 0, false);
    var c8 = await commentCreate('im in disbelief', 'andy', 0, false);
    var c9 = await commentCreate('wat is going on', 'admin', 2, false);

    let t1 = await tagCreate('react', u1);
    let t2 = await tagCreate('javascript', u1);
    let t3 = await tagCreate('android-studio', u2);
    let t4 = await tagCreate('shared-preferences', u2);
    let t5 = await tagCreate('python', u3);
    let t6 = await tagCreate('html', u4);
    let t7 = await tagCreate('css', u4);
    let t8 = await tagCreate('java', u2);
    let t9 = await tagCreate('async', u1);

    //text, ans_by, ans_date_time, upvotes, comments
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u2, false, 23, false);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u1, false, 154, [c4]);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u4, false, 8, [c3]);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u1, false, 10, false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u3, false, 2, false);

    let a6 = await answerCreate('margin is outside, padding is inside', u5, false, 5, false);
    let a7 = await answerCreate('im not too sure either tbh', u6, false, 0, false);
    let a8 = await answerCreate('test it out urself if ur not sure', u7, false, 1, false);
    let a9 = await answerCreate('it has something to do with borders', u8, false, 0, false);
    let a10 = await answerCreate('when i find the answer ill tell u', u2, false, 1, false);
    let a11 = await answerCreate('only god knows...no clue man', u3, false, 3, false )
    
                                           //title, summary, text, tags, answers, asked_by, ask_date_time, views, upvotes, comments
    let q1 = await questionCreate('Programmatically navigate using React router', 'animation is not showing when clicking on list index', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], u1, false, false, 28, [c1]);
    let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', 'fragments not being uniquely created properly', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], u1, false, 121, 54, [c2]);
    let q3 = await questionCreate('Lists in python', 'how to create a list in python', 'how do i make a list in python like those array things, im new to coding sorry', [t5], false, u3, false, 5, 3, false)
    let q4 = await questionCreate('for loops in java', 'how to make a for loop in java', 'how do i create a for loop i dont understand what for(int i = 0; i < 10; i++) is doing', [t8], false, u2, false, 8, 2, false);
    let q5 = await questionCreate('async/await in react', 'asynchronous programming in react help', 'i dont understand what await/async does in react why do i need it and what even is aysnc programming?', [t1, t2, t9], false, u1, false, 150, 40, false);
    let q6 = await questionCreate('hooks state/effect in react', 'what is state and useEffect in react', 'im new to react and dont know how to use state? is that just a variable? how do i use useEffect too?', [t1], false, u1, false, 2003, 91, false)
    let q7 = await questionCreate('constructors in java', 'how do i create a constructor', 'im new to datastructures and im building a link list, what is the purpose of constructor and how do i build one', [t8], false, u2, false, 154, 88, false)
    let q8 = await questionCreate('margin vs padding', 'wats their difference?', 'in html/css what is difference between margin and padding idk', [t6,t7], [a6, a7, a8, a9, a10, a11], u3, false, 314, 14, [c5, c6, c7, c8, c9])

    if(db) db.close();
    console.log('done');

  }
  
  populate()
    .catch((err) => {
      console.log('ERROR: ' + err);
      if(db) db.close();
    });
  
  console.log('processing ...');