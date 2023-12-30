import React, { useEffect, useState } from 'react';
import '../stylesheets/App.css';
import ShowQuestions from './displayquest.js';
import QuestionForm from './questionform.js';
import QuestDetails from './questdetails.js';
import TagsPage from './tagspage.js';
import ShowActive from './displayactive.js';
import ShowUnanswered from './displayunanswered.js';
import ShowSearch from './showSearch.js';
import axios from "axios";

axios.defaults.withCredentials = true;


export default function QuestionBox({qObj, isLoggedIn, setTClick, thisUser, setpClickBool, setqAns, qAnsClick, qAnswered, ptagClick, iTags, thisiQuestion, setindivQuestion, commentsArray, updateAuth, updateWelcome, addAns, tagsArray, answersArray, searchResults, showForm, updateForm, showTags, updateTags, detail, updateDetail, showSearchRes, updateTSearch, updateTBool, tagClick, tagSearch}) {

  const [specificQuestion, setIndiv] = useState(null);
  const [question_pagenum, setq_num] = useState(0);
  const [showPrev, setPrev] = useState(true);
  const [showNext, setNext] = useState(true);
  const [unanswered_num, setun_num] = useState(0);
  const [unans_length, setun_length] = useState(0);
  const [is_edit, setEdit] = useState(false);

  //console.log("Am i coming back?");

  //console.log("This is the form boolean atm:" + showForm);
  // console.log("Below is the answers array");
  // console.log(answersArray);

  // console.log("This is the length of the answers array");
  // console.log(answersArray.length);

  function showF() {
    updateForm(true); // when the Ask Question button is clicked, set the boolean to true
    showSearchRes(false);
    updateTBool(false);
    setqAns(false);
    setTClick(false);
    //console.log("I set it back to true");
  }

  async function pQuestionClick() {

    if (thisiQuestion != null) {

      console.log("We have hit the question click in profile");
      console.log(thisiQuestion);

      for (let i = 0; i < qObj.length; i++) {
        if (qObj[i]._id === thisiQuestion) {
          setIndiv(qObj[i]);
  
          // await axios.put(`http://localhost:8000/question_views/${thisiQuestion}`, {
          //   views: qObj[i].views + 1
          // });
  
          break;
        }
      }
  
      //updateDetail(true);
      updateForm(true);
      showSearchRes(false);
      updateTBool(false);
      setEdit(true);

      setindivQuestion(null);

    }

  }

  async function headerClick(id) {
    for (let i = 0; i < qObj.length; i++) {
      if (qObj[i]._id === id) {
        setIndiv(qObj[i]);

        await axios.put(`http://localhost:8000/question_views/${id}`, {
          views: qObj[i].views + 1
        });

        break;
      }
    }

    updateDetail(true);
    showSearchRes(false);
  }

  async function upvoteClick(id){
    if(isLoggedIn){

      for (let i = 0; i < qObj.length; i++) {
        if (qObj[i]._id === id) {

          var user = await axios.get(`http://localhost:8000/getSingleUser/${qObj[i].asker[0]}`)

          console.log('this da repu of the askerrrr', user.data.reputation) 

          // if(user.data.reputation < 50){
          //   console.log('NOT HIGH ENOUGH REPU')
          //   break;
          // }

          await axios.put(`http://localhost:8000/upvotes/${id}`, {
            upvotes: qObj[i].upvotes + 1
          });

          console.log('this da repu of the askerrrr', user.data.reputation) 

          await axios.put(`http://localhost:8000/questReputation/${qObj[i].asker[0]}`, {
            reputation: user.data.reputation + 5
          });
  
          updateWelcome(false); //this triggers the databool to false which updates the upvotes asynchronously
  
          break;
  
        }
      }
    }
    else{
      alert('You must be logged in to vote')
    }
  }

  async function downvoteClick(id){
    if(isLoggedIn){
      for (let i = 0; i < qObj.length; i++) {
        if (qObj[i]._id === id) {

          var user = await axios.get(`http://localhost:8000/getSingleUser/${qObj[i].asker[0]}`)

          console.log('this da repu of the askerrrr', user.data.reputation) 

          // if(user.data.reputation < 50){
          //   //  console.log('NOT HIGH ENOUGH REPU')
          //     break;
          //   }

            await axios.put(`http://localhost:8000/upvotes/${id}`, {
              upvotes: qObj[i].upvotes - 1
            });
  
            await axios.put(`http://localhost:8000/questReputation/${qObj[i].asker[0]}`, {
              reputation: user.data.reputation - 10
            });
    
            updateWelcome(false);

        }
      }
    }
    else{
      alert('You must be logged in to vote')
    }
  }

  // Functions and booleans for the triple buttons
  const [newest, setNewest] = useState(true);
  const [unanswered, setUnanswered] = useState(false);
  const [active, setActive] = useState(false);

  // Function for the newest button click
  function updateNewest() {
    setNewest(true);
    setUnanswered(false);
    setActive(false);
    setun_length(0);
  }

  var newList = [];

  // Function for the unanswered button click
  function updateUnanswered() {
    setUnanswered(true);
    setNewest(false);
    setActive(false);

    newList = qObj.filter((thisQuestion) => thisQuestion.answers.length === 0);

    setun_length(newList.length);
  }

  // Function for the active button click
  function updateActive() {
    setNewest(false);
    setUnanswered(false);
    setActive(true);
    setun_length(0);
  }

  const [searchIn2, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  const updateSearch = (e) => {
    setSearchInput(e.target.value);
    //console.log(search);
  }

  function searchQuest(event) {
    event.preventDefault(); // Prevent the page from refreshing on form submission

    updateForm(false);
    updateTags(false);
    updateTBool(false);
    updateDetail(false);
    showSearchRes(true);

    // Set state to user search input
    setQuery(searchIn2);
    setSearchInput('');
    //console.log('SEARCH INPUT: ' + searchIn2);

    // Reset state to empty
  }

  useEffect(() => {
    if (tagClick) {
      setQuery('[' + tagSearch + ']');
      showSearchRes(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTBool]); // Every time tagClick changes, we run this useEffect

  useEffect(() => {
    pQuestionClick()
  }, [])

  async function log() {

    try {

      const res = await axios.post('http://localhost:8000/logout');

      console.log("Logged out successfully");
      updateWelcome(true);
      updateAuth(false);
      setqAns(false);
      setTClick(false);
    } catch(err) {

      alert(err.response.data.error);

    }

  }

  function increment_qpage() {
    setq_num(question_pagenum + 1);

    if (showPrev === false) {
      setPrev(true);
    }

  }

  function decrement_qpage() {
    setq_num(question_pagenum - 1);
  }

  function increment_unnum(number) {
    setun_num(unanswered_num + number);
  }

  //WE MUST FIX THIS FOR PROFILE REND

    //this will continuously check if we pressed the next button on the final page in order to loop around

    if ((question_pagenum * 5 >= qObj.length) && (unanswered_num === 0)) {
      //if the cross the bounds without any unanswered (displayactive)
      setq_num(0);
      console.log("We cleared the page");
    } else if (unanswered_num > 0) {
      if (unanswered_num + 5 >= qObj.length) {
        //this is if we cross the bounds while in unanswered (displayactive)
        setq_num(0);
        setun_num(0);
      }
    }
  
    //continuously checks if we are on the first page or not to disable the previous button
  //  console.log("before pagenum is 0");
    if (question_pagenum === 0) {
    //  console.log("Inside of the if statement");
  
      if (showPrev === true) {
        setPrev(false);
      }
  
    }
  
    if ((qObj.length <= 5) || ((unans_length !== 0) && (unans_length <= 5))) {
      if (showNext === true) {
        setNext(false)
      }
    } else {
     // console.log("this is unans");
     // console.log(unans_length);
      if (showNext === false) {
        setNext(true)
      }
    }

    console.log("This is the ptagclikc", ptagClick);
    console.log("this is somelist", tagsArray);

  return (
    <div>
      <div className="header">

        <div className = "logoutdiv">
        {isLoggedIn ? (
                 <button onClick={log} className = "logout">Logout</button>
              ) : <button onClick={log} className = "logout">Login</button>}

        </div>
        
       <h1 className="title"> Fake Stack Overflow</h1>
  
     <div className="search-box">
        <form className="search-form" onSubmit={searchQuest}>
        <input className="search-bar" type="text" onChange={updateSearch} value={searchIn2}placeholder="Search . . ."/> 
        </form>
       
     </div>
        
    </div>
  
      <div className="questions-box" style={{display: 'block'}}>
  
        {/* Do conditional rendering (if bool == true) then display the question form and hide the other things. */}
      {/* another comment */}
        { showTags ?
        

            ( ptagClick ? (
              <div >
                <TagsPage somelist={iTags} setTClick={setTClick} updateWelcome={updateWelcome} thisUser={thisUser} ptagClick={ptagClick} newQuestion={qObj} isLoggedIn={isLoggedIn} showForm={showForm} updateForm={updateForm} updateTBool={updateTBool} updateTSearch={updateTSearch} updateTags={updateTags} />
              </div>
            ) : (
              <div >
                <TagsPage somelist={tagsArray} setTClick={setTClick} updateWelcome={updateWelcome} thisUser={thisUser} ptagClick={ptagClick} newQuestion={qObj} isLoggedIn={isLoggedIn} showForm={showForm} updateForm={updateForm} updateTBool={updateTBool} updateTSearch={updateTSearch} updateTags={updateTags} />
              </div>
            )

            ) : searchResults ? ( 
              <div className="searchDiv">
              <div className="questions-info">
              <h1 className="questions_header">Search Results</h1>
            
              {isLoggedIn ? (
                  <button className="ask-btn" onClick={showF}>Ask Question</button>
              ) : null}
         
            </div>
            <div className="questions-nav">
              <h3 className="num-questions"> {qObj.length} questions</h3>
              <nav className="questions-sort">
                <button className="sort-buttons" onClick = {updateNewest}>Newest</button>
                <button className="sort-buttons" onClick = {updateActive}>Active</button>
                <button className="sort-buttons" onClick = {updateUnanswered}>Unanswered</button>
              </nav>
            </div>
  
            {tagClick ? (
            <div className="questions-list">
               <ShowSearch somelist={qObj} searchInput={tagSearch} headerClick={headerClick} tagsArray={tagsArray} />
              </div>):(
              <div className="questions-list">
                <ShowSearch somelist={qObj} searchInput={query} headerClick={headerClick} tagsArray={tagsArray} />
              </div>)
            }
  
              </div>
            ) : showForm ? 

            (
              <div className ="questions-info">
                 <QuestionForm somelist={qObj} tagsArray={tagsArray} updateForm={updateForm} setEdit={setEdit} is_edit={is_edit} specificQuestion={specificQuestion}/>
              </div>
            ) : detail ? (
                  <QuestDetails qObj={qObj} qAnsClick={qAnsClick} thisUser={thisUser} setEdit={setEdit} tagsArray={tagsArray} commentsArray={commentsArray} upvoteClick={upvoteClick} downvoteClick={downvoteClick} addAns={addAns} isLoggedIn={isLoggedIn} updateForm={updateForm} question={specificQuestion} updateDetail={updateDetail} answersArray={answersArray} />
  
              ) : (  
          <div>
            <div className="questions-info">
              <h1 className="questions_header">All Questions</h1>
          
              {isLoggedIn ? (
                  <button className="ask-btn" onClick={showF}>Ask Question</button>
              ) : null}
       
                {qAnsClick ? null : (
                  <>
                
                    <div className="questions-nav">
                      <h3 className="num-questions"> {qObj.length} questions</h3>
                      <nav className="questions-sort">
                        <button className="sort-buttons" onClick = {updateNewest}>Newest</button>
                        <button className="sort-buttons" onClick = {updateActive}>Active</button>
                        <button className="sort-buttons" onClick = {updateUnanswered}>Unanswered</button>
                      </nav>
                    </div>
                    <div className="noresults" style={{display: 'none'}}>
                      {'\n'}
                      <h2>No Questions Found</h2>
                    </div>

                  </>

                )}

            </div>

  
            <div className="display-box">

              { newest ? 

                qAnsClick ? (

                  <div className="questions-list">
                  <ShowQuestions somelist={qAnswered} tagsArray={tagsArray} setpClickBool={setpClickBool} updateWelcome={updateWelcome} questionPageNum={question_pagenum} headerClick={headerClick} upvoteClick={upvoteClick} downvoteClick={downvoteClick}/>
                  </div>

                ) :

              (
                <div className="questions-list">
                <ShowQuestions somelist={qObj} tagsArray={tagsArray} setpClickBool={setpClickBool} updateWelcome={updateWelcome} questionPageNum={question_pagenum} headerClick={headerClick} upvoteClick={upvoteClick} downvoteClick={downvoteClick}/>
                </div>
              ) : active ? (
  
                  <div className="questions-list">
                  <ShowActive somelist={qObj} tagsArray={tagsArray} answersArray={answersArray} headerClick={headerClick} questionPageNum={question_pagenum} increment_unnum={increment_unnum} unanswered_num={unanswered_num}/>
                  </div>
                
                ) : unanswered ? (
  
                  <div className="questions-list">
                  <ShowUnanswered somelist={qObj} tagsArray={tagsArray} headerClick={headerClick} questionPageNum={question_pagenum}/>
                  </div>
  
                ) :null}

                {showPrev ? (
                  <>
                    <button onClick={decrement_qpage}>Prev</button>
                  </>
                ) : null}

                {showNext ? (
                  <>
                    <button onClick={increment_qpage}>Next</button>
                  </>
                ) : null}

              </div>
  
          </div>
            
          )}
  
        </div>
        </div>
    );

  
}