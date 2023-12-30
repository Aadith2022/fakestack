import '../stylesheets/App.css';
import axios from 'axios'
import React, { useEffect, useState } from 'react';

 function ShowAnswers({question, thisUser, setEdit, setAnswer, editAns, qAnsClick, isLoggedIn}) {
    const [answersArray, setAnswersArr] = useState([])
    const [actualQuest, setActual] = useState([])
    const [dataBool, setDataBool] = useState(false)
    const [question_pagenum, setq_num] = useState(0)
    const [showPrev, setPrev] = useState(true)
    const [showNext, setNext] = useState(true)
    const [buttonBool, setbtn] = useState(false)
    const [specificAnswer, setIndiv] = useState(null)
    const [ansComments, setansComments] = useState({})
    const [realComments, setComms] = useState([])

    const [comment_pagenum, setc_num] = useState(0);
    const [showcPrev, setcPrev] = useState(true);
    const [showcNext, setcNext] = useState(true);
    const [cbuttonBool, setcbtn] = useState(false);

    //THIS IS THE NEW COMMENT STUFF FOR HW5
   const [formInput, setFormInput] = useState({
    text: '',
    commentDate: new Date()
    
})

  useEffect(() => {
   
    if(!dataBool){
       getSingleQuest()
       fetchAnswers()
       getComments()
       setDataBool(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBool]);

  useEffect(() => {

    fetchAllComments();

  }, [answersArray])

    const fetchAnswers = async () => {
        try {

          const response = await axios.get('http://localhost:8000/answers');
          setAnswersArr(response.data);

          //console.log('response data', response.data)
        } catch (error) {
        console.error(error);
        }
    };

    const fetchAllComments = async () => {

      console.log("This is the length of the answers array", answersArray.length);

      for (let i = 0; i < answersArray.length; i++) {

        for (let j = 0; j < answersArray[i].comments.length; j++) {

          //console.log('This is the indiv comment', answersArray[i].comments[j]);

          const response = await axios.get(`http://localhost:8000/thiscomment/${answersArray[i].comments[j]}`);
          const comment = response.data;
          setansComments((previous) => ({...previous, [answersArray[i].comments[j]]:comment}));

        }

      }

    }

    const getSingleQuest = async() => {
        try{
            const response = await axios.get(`http://localhost:8000/getSingleQuest/${question._id}`)
            setActual(response.data)
            //console.log('THIS DA INVIDUAL QUESITON', response.data)
            
        } catch(error){
            console.log(error)
        }

    }

    function updateText(event) {
      const {value} = event.target;
  
      setFormInput((formInput) => ({
          ...formInput,
          text: value
      }))
  }

  async function commClick(id) {
    for (let i = 0; i < answersArray.length; i++) {
      if (answersArray[i]._id === id) {
        setIndiv(answersArray[i]);
       // console.log('this is the specific answer', answersArray[i])
        break;
      }
    }

  }

   //THIS IS FOR THE COMMENT FORM FOR THE ANSWERSSSSS
   async function submitComment(event) {
    event.preventDefault();

    const {text, commentDate} = formInput;

    try {
     const res = await axios.post('http://localhost:8000/createComment', { text, commentDate });
    // console.log('COMMENT was added successfully:', res.data);
 
     const copied_comments = [...specificAnswer.comments];

     copied_comments.push(res.data._id);

    // console.log("This is the new id");
    // console.log(res.data._id);
 
     const res2 = await axios.put(`http://localhost:8000/add_answer_comment/${specificAnswer._id}`, {
       //views: question.views + 1,
       comments: copied_comments,
     });

     setDataBool(false)

    setFormInput({
      text: ""
    })
 
    // console.log('Question was updated successfully', res2.data);
     
   } catch (err) {
     console.error('Error:', err);
   }
}

    //console.log("This is the answers array in show answers ");
    //console.log(question.answers);

    var uniqueAns = [];
    var answerList = []
   // console.log('this actual quest', actualQuest)
    if(actualQuest.answers != null){
       // console.log('WE ARE NOT NULLLLLLLLLL')
       // console.log('this actual quest', actualQuest)
        //console.log('this the actualquest.answer', actualQuest.answers)
        actualQuest.answers.forEach(id => {
            // console.log('questiondataaaaa', question.answers)
            // console.log('ansarayyyyyy', answersArray)
             answersArray.forEach(answer => {
                 if(id === answer._id){
                     if(!uniqueAns.includes(answer._id)){
                         uniqueAns.push(answer._id);
                     }
                 }
             })
         })
     
     
         for(let i = 0; i < uniqueAns.length; i++){
             answersArray.forEach(answer => {
     
                 if (uniqueAns[i] === answer._id) {
                     answerList.push(answer);
                 }
     
             })
         
         }
    }

    answerList.sort(function (a, b) {
        const dateA = new Date(a.ans_date_time);
        const dateB = new Date(b.ans_date_time);
        return dateB - dateA;
    });

    if (qAnsClick) {

      var ourSortedAnswers = [];
      var otherAnswers = [];

      console.log("WE ARE IN QANS TERRITORY")

      console.log("This is the answerList before our sort", answerList)

      for (let i = 0; i < answerList.length; i++) {

        if (answerList[i].asker[0] == thisUser._id) {
          ourSortedAnswers.push(answerList[i]);
        } else {
          otherAnswers.push(answerList[i]);
        }

      }

      answerList = ourSortedAnswers.concat(otherAnswers);

    }

    const showAForm = async (answerId) => {

      const response = await axios.get(`http://localhost:8000/thisanswer/${answerId}`);

      setAnswer(response.data);

      editAns(true);

    }


    useEffect(() => {

      if (!buttonBool) {

        if (answerList.legth != 0) {

           // console.log("This is getting hit");
            if (answerList.length <= 5) {
             // console.log("This is the answerlist lenght")
             // console.log(answerList.length);
              setNext(false);
            }
        
            if (question_pagenum === 0) {
              setPrev(false);
             // console.log('This is the length of the answerList:' + answerList.length);
            }

            if (question_pagenum * 5 >= answerList.length) {
              setq_num(0);
              setPrev(false);
            }

            setbtn(true);

        }

      }

    }, [buttonBool]);

    function increment_qpage() {
      setq_num(question_pagenum + 1);
      setbtn(false);
  
      if (showPrev === false) {
        setPrev(true);
      }
  
    }
  
    function decrement_qpage() {
      setq_num(question_pagenum - 1);
      setbtn(false);
    }

    async function upvoteClick(id){
        console.log('hittin this upvote')
        if(isLoggedIn){
          for (let i = 0; i < answerList.length; i++) {
            if (answerList[i]._id === id) {

              var user = await axios.get(`http://localhost:8000/getSingleUser/${answerList[i].asker[0]}`)

              console.log('this da repu of the askerrrr', user.data.reputation) 

             // if(user.data.reputation < 50) break;
       
              await axios.put(`http://localhost:8000/ansUpvotes/${id}`, {
                upvotes: answerList[i].upvotes + 1
              });

              await axios.put(`http://localhost:8000/questReputation/${answerList[i].asker[0]}`, {
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
          for (let i = 0; i < answerList.length; i++) {
            if (answerList[i]._id === id) {

              var user = await axios.get(`http://localhost:8000/getSingleUser/${answerList[i].asker[0]}`)

              console.log('this da repu of the askerrrr', user.data.reputation) 

              //if(user.data.reputation < 50) break;
       
              await axios.put(`http://localhost:8000/ansUpvotes/${id}`, {
                upvotes: answerList[i].upvotes - 1
              });
    
              await axios.put(`http://localhost:8000/questReputation/${answerList[i].asker[0]}`, {
                reputation: user.data.reputation - 10
              });
      
             setDataBool(false)
      
              break;
            }
          }
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

      async function upvoteComment(id){
        //console.log('hittin this upvote')
        if(isLoggedIn){
          for (let i = 0; i < realComments.length; i++) {
            if (realComments[i]._id === id) {
       
              await axios.put(`http://localhost:8000/commentsUpvotes/${id}`, {
                upvotes: realComments[i].upvotes + 1
              });
      
              setDataBool(false)//this triggers the databool to false which updates the upvotes asynchronously
      
              break;
            }
          }
        }
      }

      async function deleteAnswer(id){

        console.log('ID OF THE ANSWER WE WANNA DELETE', id)

        for(var answer of question.answers){ //LOOP THRU QUESTIONS ANSWERS ARRAY
          if(answer == id){ //IF ANSWER ID MATCHES OUR ID
            var copied_answers = [...question.answers];

            copied_answers = copied_answers.filter(function (value) {
              return value !== id;
            });

            var res2 = await axios.put(`http://localhost:8000/add_question_answer/${question._id}`, {
            answers: copied_answers,
            });

          }
        }

        var gottenAns = await axios.get(`http://localhost:8000/thisanswer/${id}`)

        for(const ansComment of gottenAns.data.comments){ //DELETING THE COMMENTS OF THE ANSWER OF THE QUESTION LFAMO!!?!?!??!
          const ansComRes = await axios.delete(`http://localhost:8000/deleteComment/${ansComment}`)
        }

        const ansDelRes = await axios.delete(`http://localhost:8000/deleteAnswer/${id}`);

        setEdit(false)
        setDataBool(false)

        try{

        }catch(error){
          console.log(error)
        }
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


      let grabStart = question_pagenum * 5;

      let grabEnd = grabStart + 5;

      const five_list = answerList.slice(grabStart, grabEnd);

      return (
        <>
          {qAnsClick ? (
            <ul className="answers-list">
              {five_list.map((answer, index) => {
                const isAnswerInOurSortedAnswers = ourSortedAnswers.some(ourAnswer => ourAnswer._id === answer._id);
      
                return (
                  <li key={index}>
                    <p>{answer.text}</p>
                    <p className="answerer">{answer.ans_by}</p>

                    <p>{calcDate(answer.ans_date_time)}</p>
                    <p>{answer.upvotes} upvotes</p>
      
                    {isLoggedIn ? (
                      <>
                        <button className="votesContainer" onClick={() => upvoteClick(answer._id)}>
                          upvote
                        </button>
                        <button className="votesContainer" onClick={() => downvoteClick(answer._id)}>
                          downvote
                        </button>
                      </>
                    ) : null}
      
                    <ul className="answer_comments">
                      {answer.comments.map((commentid, commentIndex) => (
                        <li key={commentIndex}>
                          <p>{ansComments[commentid]?.text}</p>
                          <p>{ansComments[commentid]?.upvotes} upvotes</p>
                          {isLoggedIn ? (
                            <>
                              <button
                                className="votesContainer"
                                onClick={() => upvoteComment(ansComments[commentid]?._id)}
                              >
                                upvote
                              </button>
                            </>
                          ) : null}
                          <p>asked by {ansComments[commentid]?.commenter}</p>
                        </li>
                      ))}
                    </ul>
      
                    {isLoggedIn ? (
                      <>
                        <div className="commentContainer">
                          <form onSubmit={submitComment}>
                            <textarea cols="40" rows="2" required placeholder="Add a comment" onChange={updateText} />
                            <button onClick={() => commClick(answer._id)}>Add Comment</button>
                          </form>
                        </div>
                      </>
                    ) : null}
      
                    {isAnswerInOurSortedAnswers ? 
                    <>
                    <button className='editAnswer_btn' onClick={() => showAForm(answer._id)}>Edit</button> 
                    <button className='deleteAnsBtn' onClick={() => deleteAnswer(answer._id)}>Delete</button>
                    </>
                    : null}
                  </li>
                );
              })}
      
              {showPrev ? <button onClick={decrement_qpage}>Prev</button> : null}
      
              {showNext ? <button onClick={increment_qpage}>Next</button> : null}
            </ul>
          ) : (
            <ul className="answers-list">
              {five_list.map((answer, index) => (
                <li key={index}>

                  <p>{answer.text}</p>
                  <p className="answerer">{answer.ans_by}</p>
                  <p>{calcDate(answer.ans_date_time)}</p>
                  <p>{answer.upvotes} upvotes</p>
          
                  {isLoggedIn ? (
                    <>
                      <button className="votesContainer" onClick={() => upvoteClick(answer._id)}>upvote</button>
                      <button className="votesContainer" onClick={() => downvoteClick(answer._id)}>downvote</button>
                    </>
                  ) : null}
          
                  <ul className="answer_comments">
                    {answer.comments.map((commentid, commentIndex) => (
                      <li key={commentIndex}>
                        <p>{ansComments[commentid]?.text}</p>
                        <p>{ansComments[commentid]?.upvotes} upvotes</p>
                        {isLoggedIn ? (
                        <>
                        <button className="votesContainer" onClick = {() => upvoteComment(ansComments[commentid]?._id)} >upvote</button>
                        </> 
                        ) : null}
                        <p>asked by {ansComments[commentid]?.commenter}</p>
                      </li>
                    ))}
                  </ul>

                  {isLoggedIn ? (
                    <>
                      <div className="commentContainer">
                    <form onSubmit={submitComment}>
                      <textarea cols="40" rows="2" required placeholder="Add a comment" onChange={updateText} />
                      <button onClick={() => commClick(answer._id)}>Add Comment</button>
                    </form>
                  </div>
                    </>
                  ) : null}
                  
                </li>
              ))}
      
              {showPrev ? <button onClick={decrement_qpage}>Prev</button> : null}
      
              {showNext ? <button onClick={increment_qpage}>Next</button> : null}
            </ul>
          )}
        </>
      );
      
}

export default ShowAnswers;