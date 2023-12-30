import '../stylesheets/App.css';
import axios from 'axios'
import React, { useEffect, useState } from 'react';

function ShowComments({ question, commentsArray, isLoggedIn, updateComment}) {

    const [question_pagenum, setq_num] = useState(0);
    const [showPrev, setPrev] = useState(true);
    const [showNext, setNext] = useState(true);
    const [buttonBool, setbtn] = useState(false);
    const [realComments, setComms] = useState([])
    const [dataBool, setDataBool] = useState(false);
    const [actualQuest, setActual] = useState([]);

    useEffect(() => {
   
        if(!dataBool){
           getComments()
           getSingleQuest()
           setDataBool(true)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [dataBool]);
  
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

   // console.log("These are the original comments");
   // console.log(commentsArray);

    //console.log("These are the comments array");
    //console.log(question.comments);

    var these_comments = [];

   //console.log('showcomments QQUESTION', question)
    if(question.comments != null){
        for (let i = 0; i < commentsArray.length; i++) {
            for (let j = 0; j < question.comments.length; j++) {
                if (commentsArray[i]._id === question.comments[j]) {
                    these_comments.push(commentsArray[i]);
                }
            }
        }
    }
    

    // console.log("These the comments afterwards");
    // console.log(these_comments);

    const getComments = async () => {
        try {
        const response = await axios.get('http://localhost:8000/comments');
        setComms(response.data)
        //console.log('COMMS data', response.data)
        } catch (error) {
        console.error(error);
        }
    };

    const getSingleQuest = async() => {
        try{
            const response = await axios.get(`http://localhost:8000/getSingleQuest/${question._id}`)
            setActual(response.data)
            updateComment(false)
            //console.log('THIS DA INVIDUAL QUESITON', response.data)
            
        } catch(error){
            console.log(error)
        }

    }

    useEffect(() => {

        if (!buttonBool) {

            if (these_comments.length != 0) {

            // console.log("This is getting hit");
              if ( these_comments.length <= 3) {
                  console.log("This is the answerlist lenght")
                //  console.log(these_comments.length);
                  setNext(false);
              }
          
              if (question_pagenum === 0) {
                  setPrev(false);
              }
      
              if (question_pagenum * 3 >= these_comments.length) {
                  setq_num(0);
                  setPrev(false);
              }
      
              setbtn(true);

            }
  
        }
  
    }, [buttonBool]);

    these_comments.sort(function (a, b) {
        const dateA = new Date(a.commentDate);
        const dateB = new Date(b.commentDate);
        return dateB - dateA;
    });

    let grabStart = question_pagenum * 3;

    let grabEnd = grabStart + 3;

    const three_list = these_comments.slice(grabStart, grabEnd);

    async function upvoteClick(id){
        console.log('hittin this upvote')
        if(isLoggedIn){
          for (let i = 0; i < these_comments.length; i++) {
            if (these_comments[i]._id === id) {
       
              await axios.put(`http://localhost:8000/commentsUpvotes/${id}`, {
                upvotes: these_comments[i].upvotes + 1
              });
      
              setDataBool(false)//this triggers the databool to false which updates the upvotes asynchronously
      
              break;
            }
          }
        }
      }

    return (
        <ul className="comments-list">
            {three_list.map((comment, index) => (
                <li key={index}>
                    <p>{comment.text}</p>
                    <p>  {comment.upvotes} upvotes</p>
                    {isLoggedIn ? (
                    <>
                    <button className="votesContainer" onClick = {() => upvoteClick(comment._id)} >upvote</button>
                    </> 
                    ) : null}
                    <p>   Asked By: {comment.commenter}</p>
                    
                </li>
            ))}

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

        </ul>
    );
}

export default ShowComments;
