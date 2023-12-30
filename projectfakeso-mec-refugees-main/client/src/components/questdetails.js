
import '../stylesheets/App.css';
import ShowAnswers from './showanswers.js';
import AnswerForm from './answerform.js';
import ShowTags from './displaytags.js';
import ShowComments from './showcomments.js';
import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function QuestDetails({qObj, question, qAnsClick, thisUser, setEdit, commentsArray, isLoggedIn, updateForm, updateDetail, tagsArray, answersArray, addAns}) {
  const [singleQuest, setQuestion] = useState(null)
  const [dataBool, setDataBool] = useState(false)
  const [realComments, setComms] = useState([])
  const [editAnswer, setEditAns] = useState(false);
  const [thisAnswer, setAnswer] = useState(null);
  
   //THIS IS THE NEW COMMENT STUFF FOR HW5
   const [formInput, setFormInput] = useState({
    text: '',
    commentDate: new Date()
    
})

  async function upvoteClick(id){
    console.log('hittin this upvote')
    if(isLoggedIn){
      for (let i = 0; i < qObj.length; i++) {
        if (qObj[i]._id === id) {

          var user = await axios.get(`http://localhost:8000/getSingleUser/${qObj[i].asker[0]}`)

          console.log('this da repu of the askerrrr', user.data.reputation) 

         // if(user.data.reputation < 50) break;
   
          await axios.put(`http://localhost:8000/upvotes/${id}`, {
            upvotes: qObj[i].upvotes + 1
          });
  
            await axios.put(`http://localhost:8000/questReputation/${qObj[i].asker[0]}`, {
              reputation: user.data.reputation + 5
            });
  
          setDataBool(false)//this triggers the databool to false which updates the upvotes asynchronously
  
          break;
        }
      }
    }
  }

  async function downvoteClick(id){
    if(isLoggedIn){
      for (let i = 0; i < qObj.length; i++) {
        if (qObj[i]._id === id) {

          var user = await axios.get(`http://localhost:8000/getSingleUser/${qObj[i].asker[0]}`)

          console.log('this da repu of the askerrrr', user.data.reputation) 

         // if(user.data.reputation < 50) break;
   
          await axios.put(`http://localhost:8000/upvotes/${id}`, {
            upvotes: qObj[i].upvotes - 1
          });

            await axios.put(`http://localhost:8000/questReputation/${qObj[i].asker[0]}`, {
              reputation: user.data.reputation - 10
            });
  
         setDataBool(false)
  
          break;
        }
      }
    }
  }


  const getSingleQuest = async() => {
    try{
     // console.log('make it in here at least!?!??!?!')
      if(question != null){
       // console.log('this the specific quest: ', question)
        const response = await axios.get(`http://localhost:8000/getSingleQuest/${question._id}`)
        setQuestion(response.data)
       // console.log('THIS DA INVIDUAL QUESITON', response.data)
      }
      
        
    } catch(error){
        console.log(error)
    }

}

const getComments = async () => {
  try {
  const response = await axios.get('http://localhost:8000/comments');
  setComms(response.data)
  //console.log('COMMS data', response.data)
  } catch (error) {
  console.error(error);
  }
};

    useEffect(() => {
      //console.log('this is databool', dataBool)
      if(!dataBool){
        getSingleQuest()
        getComments()
        setDataBool(true)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataBool])

  function showF(){
    updateForm(true);
    updateDetail(false);
  }

  //console.log("This is the question details");

 // console.log(singleQuest);

  const [showAnswers, setAnswers] = useState(false);
  const updateAnswer = (formBool) => {
    setAnswers(formBool);
  }

  const [commBool, setCommBool] = useState(false)
  const updateComment = (commBool) => {
    setCommBool(commBool);
    setDataBool(false)
  }

  function showAns() {
    updateAnswer(true);
  }

  function editAns(editBool) {
    
    setEditAns(editBool);
    setAnswers(true);

  }

  //THIS IS FOR THE COMMENT FORM
  async function submitComment(event) {
       event.preventDefault();

       const {text, commentDate} = formInput;

       try {
        const res = await axios.post('http://localhost:8000/createComment', { text, commentDate });
        console.log('COMMENT was added successfully:', res.data);
    
        const copied_comments = [...question.comments];

        copied_comments.push(res.data._id);

        console.log("This is the new id");
        console.log(res.data._id);
    
        const res2 = await axios.put(`http://localhost:8000/add_question_comment/${question._id}`, {
          //views: question.views + 1,
          comments: copied_comments,
        });

        setDataBool(false)

        setFormInput({
          text: ""
        })
    
        console.log('Question was updated successfully', res2.data);
        
      } catch (err) {
        console.error('Error:', err);
      }
  }

  function updateText(event) {
    const {value} = event.target;

    setFormInput((formInput) => ({
        ...formInput,
        text: value
    }))
}

function calcDate(registryDate) {
  const regDate = new Date(registryDate);
  const currDate = new Date();

  const secs = Math.floor((currDate - regDate)/1000);

  if (secs >= 86400) {
    const year = regDate.getFullYear()
    const currYear = currDate.getFullYear()

    //console.log('THIS DA CURRENT YEAR', currentYear)

    const yearString = (year !== currYear) ? `, ${year}` : '';
    
    var formDate
    
    if(currYear === year){
      formDate = regDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'

      })
    }
     else{
      formDate = regDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })

    }

    const formTime = regDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false, 

    })

    return `asked on ${formDate} at ${formTime}`

  } 
  else if (secs >= 3600) {
    const hours = Math.floor(secs / 3600)
    return `asked ${hours} hour${hours > 1 ? 's' : ''} ago`

  } 
  else if (secs >= 60) {
    const minutes = Math.floor(secs / 60)
    return `asked ${minutes} minute${minutes > 1 ? 's' : ''} ago`

  } 
  else {
    return `asked ${secs} second${secs !== 1 ? 's' : ''} ago`

  }

}

  if(question != null && singleQuest != null){
    return (

      <div>
          {showAnswers ? 
            ( <AnswerForm question = {question} editAnswer={editAnswer} thisAnswer={thisAnswer} updateForm = {updateAnswer} addAns={addAns}/> )
          :
          (
          
            <div className="question-details" style={{display: 'block'}}>
              <div className="quest-column">
                <h3 className="num-answers"> {question.answers.length} answers</h3>
                <h3 className="question-title">{question.title}</h3>
  
            <a href="#/"> 
            
              {isLoggedIn ? (
                    <button className="ask-btn ask-btn2" onClick={showF}>Ask Question</button>
              ) : null}
            </a>
          </div>
  
              <div className="quest-column" id="quest-column2">
                <h3 className="num-views">{question.views + 1} views</h3>
                <p className="quest-text" dangerouslySetInnerHTML={{ __html: question.text }}></p>
                <div style={{padding: '5px', paddingLeft: '30px', textAlign: 'center'}} className="view_heading">
                <ShowTags question = {question} tagsArray={tagsArray}/>
                </div>
  
                {/* <ShowDate question = {question}/> */}
  
              </div>
  
             <div className="quest-column">
             <p> 
               {singleQuest ? (
                <>
                 {singleQuest.upvotes} upvotes
                 </>
               ) : null}
                 
             {isLoggedIn ? (
              <>
               <button className="votesContainer" onClick = {() => upvoteClick(question._id)} >upvote</button>
                <button className="votesContainer" onClick = {() => downvoteClick(question._id)}>downvote</button>
              </> 
              ) : null}
  
             </p>
           
             <p className = "asker"> {question.asked_by} </p>
             <p>{calcDate(question.ask_date_time)}</p>
             </div>

              {/* this is the COMMENT FORM */}

              {isLoggedIn ? (
                   
              <div className="commentContainer">
                <form onSubmit={submitComment}>
                  <textarea cols="60" rows="3" required placeholder="Add a comment" onChange={updateText}/>
                  <button>Add Comment</button>
                </form>

              </div>

              ) : null}



             <div className="comments-display">
              <h3>Comments:</h3>
                <br/>
                <ShowComments question = {singleQuest} commentsArray={realComments} isLoggedIn={isLoggedIn} updateComment={updateComment}/>
              </div>
          
              <div className="answers-display">

                <ShowAnswers question = {question} setAnswer={setAnswer} setEdit={setEdit} thisUser={thisUser} editAns={editAns} qAnsClick={qAnsClick} answersArray = {answersArray} isLoggedIn={isLoggedIn}/>
              </div>
  
              <a href="#/"> 
                
                {isLoggedIn ? (
                   <button className="ans-btn" onClick = {showAns}>Answer Question</button>
              ) : null}
                
              </a>
  
            </div>
          
          )}
          
      </div>
  
    );
  }
        
}