// ** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **
// ** DEFINE YOUR REACT COMPONENTS in ./components directory **
import React,{useEffect, useState} from "react";
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import Navbar from './components/navbar.js';
import QuestionBox from './components/questionbox.js';
import axios from "axios";
import Register from './components/register.js';
import Login from './components/login.js';
import Profile from "./components/profile.js";

//axios.defaults.withCredentials = true;

function App() {

  const [newQuestion, setQuestions] = useState(null)// State to store questions
  const [answersArray, setAnswers] = useState(null)
  const [tagsArray, setTags] = useState(null)
  const [usersArray, setUsers] = useState(null)
  const [commentsArray, setComments] = useState(null)
  const [dataBool, setDataBool] = useState(false)

  const [welcomeBool, setWelcome] = useState(true)
  const [registerBool, setRegister] = useState(false)
  const [loginBool, setLogin] = useState(false)
  const [isLoggedIn, setAuth] = useState(false)
  const [profileClick, setpClick] = useState(false);
  const [thisUser, setUser] = useState(null);
  const [thisiQuestion, setindivQuestion] = useState(null);
  const [isAdmin, setAdmin] = useState(false)

  const [ptagClick, setTClick] = useState(false);
  const [iTags, setiTag] = useState([]);

  const [qAnsClick, setqAns] = useState(false);
  const [qAnswered, setqAnswered] = useState([]);


  const [otherUser, setOther] = useState(false);


  var questions = null;
  var answers = null;
  var tagsRes = null;
  var usersRes = null;
  var commentsRes = null;
  // //THIS IS JUST FOR TESTING IF NEW QUESTION IS SET, IT DOES LOL
  // useEffect(() => {
  //   console.log('below is the tag array')


  // }, [tagsArray]);



  //GET ALL THE QUESTIONS
  const getQuestions = async () => {
    try{ 
        
        //we use await axios b/c we want to wait until the data is loaded before skipping to the next step
        questions = await axios.get('http://localhost:8000/questions');
        //when we get response back from server, set the products to data from backend
        setQuestions(questions.data);

        console.log('quest data', questions.data);

    } catch (error){
        console.log(error);
    }
    }

  //GET ALL THE ANSWERS
  const getAnswer = async() => {
    try{
      answers = await axios.get('http://localhost:8000/answers');
      setAnswers(answers.data)
      
      console.log('ans data', answers.data)

    } catch(error){
      console.log(error);
    }
  }
  
  //GET ALL THE TAGS
  const getTags = async() => {
    try{
      tagsRes = await axios.get('http://localhost:8000/tags')
      setTags(tagsRes.data);

     // console.log("This is the tag data below");
      console.log('tags data', tagsRes.data)

    } catch(error){
      console.log(error);
    }
  }

   //GET ALL THE USERS
   const getUsers = async() => {
    try{
      usersRes = await axios.get('http://localhost:8000/users')
      setUsers(usersRes.data);

     // console.log("This is the tag data below");
      console.log('USER DATA', usersRes.data)

    } catch(error){
      console.log(error);
    }
  }

  console.log("This is the USERS ARRAY", usersArray);

  //get the current user
  const getThisUser = async() => {

    if (!otherUser) {

      try {
        const tuserRes = await axios.get('http://localhost:8000/thisuser')
        setUser(tuserRes.data);

        console.log("This user", tuserRes.data);
      } catch(error) {
        console.log(error);
      }

    }

  }

   //GET ALL THE COMMENTS
   const getComments = async() => {
    try{
      commentsRes = await axios.get('http://localhost:8000/comments')
      setComments(commentsRes.data);

      console.log('Comment DATA', commentsRes.data)

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
   // console.log('this is databool', dataBool)
    if(!dataBool){
      getQuestions();
      getAnswer();
      getTags();
      getUsers();
      getComments();
      getThisUser();
      setDataBool(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBool])

    //OLD STUFF FROM HOMEWOKR 2 BELOW

    const [qForm, setForm] = useState(false);

    const updateForm = (formBool) => {
      setForm(formBool);
      setDataBool(false)
    }

 
    var addAns = (ansBool) => {
      console.log('am i coming to ans')
      setDataBool(false)
    }
  
    const [tags, setShowTags] = useState(false);
  
    const updateTags = (tagBool) => {
      setShowTags(tagBool);
    }

    const updateIndividual = (indivID) => {
      setindivQuestion(indivID);
      setpClick(false);
    }

    const updateITag = (iBool) => {
      setTClick(iBool);
      setShowTags(true);
      setpClick(false);
    }

    const updateqAns = (qansBool) => {
      setqAns(qansBool);
      setpClick(false);
    }
  
    const [detail, setDetail] = useState(false);
  
    const updateDetail = (detailBool) => {
      setDetail(detailBool);
      
    }
  
    //this one is for the other search when you press the specific tag
    const [tagSearch, setTSearch] = useState('');
  
    const updateTSearch = (string) => {
      setTSearch(string);
    }
  
    //we would use this one
    const [tagClick, setTBool] = useState(false);
  
    const updateTBool = (Tbool) => {
      setTBool(Tbool);
      console.log('this is tag click' + tagClick);
    }
  
    const [searchResults, setSearchRes] = useState(false);
  
    const showSearchRes = (searchBool) => {
      setSearchRes(searchBool);
    }

    //HOMEWORK 5 NEW STUFF IS HERE BELOW
    function setWelcomeBool(){ //when user clicks 'Continue as Guest', set the Welcome Page false, show the Main fakeso page
      console.log('I AM LOGGING OUTTTTT')
      setDataBool(false)
      setDetail(false)
      setSearchRes(false);
      setWelcome(false)
    }

    function setRegisterBool() { //when user clicks the register btn on Welcome Page, show the Register Page
      setRegister(true)
      setWelcome(false);
    }
  
  
    function setLoginBool(){ //when user clicks the login btn on Welcome Page, show the Login Page
      setLogin(true)
      setWelcome(false)
    }

    function setpClickBool() {
      console.log("P HAS BEEN CLICKED!!!!!!!!!!");
      setpClick(true);
    }

    const updateLoginBool = (logBool) => {
      setLogin(logBool);
      setDetail(false)
      setSearchRes(false);
      
    }

    const updateRegisterBool = (regBool) => {
      setRegister(regBool);
    }

    const updateWelcomeBool = (welcomeBool) => {
      setWelcome(welcomeBool);
      setDataBool(false);
    }


    const updateAuth = (authBool) => {
      setAuth(authBool)
     // setDataBool(false);
    }

    //console.log("welcome", welcomeBool)
    //console.log("register", registerBool)
   // console.log("login", loginBool)


     if(welcomeBool){
      //console.log('making it into WELCOME')
      return (
        <div className="welcomeContainer">
            <button className="welcomeBtn" onClick = {setRegisterBool}>Register</button> 
            <button className="welcomeBtn" onClick={setLoginBool} >Login as existing user</button> 
            <button className="welcomeBtn" onClick={setWelcomeBool}>Continue as Guest</button>
        </div>
    
        );

     } else if (registerBool) {
     // console.log('making it into REGISTER')

        return(
          <Register updateRegisterBool = {updateRegisterBool} updateLoginBool = {updateLoginBool}/>
        )

     }else if(loginBool){
     // console.log('making it into LOGIN')
        return(
          <Login updateLoginBool = {updateLoginBool} updateAuth={updateAuth} setAdmin={setAdmin}/>
        )
          
     } else if (profileClick) {
        return (
          
          <Profile answersArray={answersArray} user={thisUser} otherUser={otherUser} setOther={setOther} setUser={setUser} usersArray={usersArray} updateDetail={updateDetail} isAdmin={isAdmin} updateForm = {updateForm} setShowTags={setShowTags} setTClick={updateITag} tClickSetter={setTClick} setQAns={updateqAns} qAnsSetter={setqAns} setqAnswered={setqAnswered} setiTag={setiTag} commentsArray={commentsArray} tagsArray={tagsArray} questions={newQuestion} setindivQuestion={updateIndividual}/>
        )
     } else{ //IF THE WELCOME PAGE IS NOT SHOWING, THEN SHOW STACK OVERFLOW MAIN PAGE
      if((newQuestion != null) && (tagsArray != null) && (answersArray != null)){ //we need to return this ONLY when newQuestion gets populated with questions, just like HW1 
        console.log('making it into questionBOX')
        return (
          <div>
          
              <FakeStackOverflow qObj = {newQuestion} showSearchRes = {showSearchRes} updateForm = {updateForm} updateTags = {updateTags} updateDetail = {updateDetail}/>
              
              <div className="main">
              <Navbar qObj = {newQuestion} isLoggedIn={isLoggedIn} setTClick={setTClick} setqAns={setqAns} setpClickBool={setpClickBool} updateForm = {updateForm} updateTags = {updateTags} updateDetail = {updateDetail} searchResults={searchResults} updateTBool = {updateTBool} showSearchRes = {showSearchRes}/>
              <QuestionBox qObj = {newQuestion} thisUser={thisUser} setTClick={setTClick} setpClickBool={setpClickBool} setqAns={setqAns} qAnsClick={qAnsClick} qAnswered={qAnswered} ptagClick={ptagClick} iTags={iTags} thisiQuestion={thisiQuestion} setindivQuestion={setindivQuestion} isLoggedIn={isLoggedIn} commentsArray={commentsArray} updateAuth={updateAuth} updateWelcome = {updateWelcomeBool} addAns = {addAns} tagsArray = {tagsArray} answersArray = {answersArray} searchResults={searchResults} showSearchRes = {showSearchRes} showForm = {qForm}  updateForm = {updateForm} showTags = {tags} updateTags = {updateTags} detail = {detail} updateDetail = {updateDetail} updateTSearch = {updateTSearch} updateTBool = {updateTBool}  tagClick = {tagClick} tagSearch = {tagSearch}/>
              
              </div>
      
          </div>
      
          );
       } else{ //if it hasnt been populated, return nothing, we need this otherwise react says 'we're returning nothing '
        console.log('MAKING IT INTO NOTHING!!!')
        return(
          <div>
  
          </div>
        )
       }
     }
  
    

}// end of app function

export default App;