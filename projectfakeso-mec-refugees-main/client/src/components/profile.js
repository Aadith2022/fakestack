import '../stylesheets/App.css';
import axios from 'axios'
import React, { useEffect, useState } from 'react';


function Profile({answersArray, user, setUser, updateDetail, otherUser, setOther, usersArray, commentsArray, isAdmin, tClickSetter, qAnsSetter, updateForm, setQAns, setShowTags, setqAnswered, setTClick, setiTag, setindivQuestion, tagsArray, questions}) {

    var ourQuestions = [];

    var ourTags = [];

    var answeredQuest = [];

    console.log("This is the UARRAY in profile", usersArray);

    useEffect(() => {
        updateForm(false);
        updateDetail(false);
        setShowTags(false);
        qAnsSetter(false);
        tClickSetter(false);
    }, [])

    for (let i = 0; i < questions.length; i++) {

        if (questions[i].asker[0] === user._id) {
            ourQuestions.push(questions[i]);
        }

    }

    for (let i = 0; i < tagsArray.length; i++) {

        if (tagsArray[i].creator[0] == user._id) {
            ourTags.push(tagsArray[i]);
        }

    }
    

    const fetchAnsQuestions = async () => {

        for (let i = 0; i < questions.length; i++) {

            for (let j = 0; j < questions[i].answers.length; j++) {

                console.log("This one of the answers for this question", questions[i].answers[j]);

                //here we are gonna have to fetch this single answer
                const response = await axios.get(`http://localhost:8000/thisanswer/${questions[i].answers[j]}`);

             //   console.log("This is the answer", response.data);

              //  console.log("This is the asker of the answer", response.data.asker);

                if (response.data.asker.length != 0) {

                    //now we are gonna have to get the asker of this answer
                    const user_reponse = await axios.get(`http://localhost:8000/getSingleUser/${response.data.asker[0]}`)

                    console.log("This is the user for this question", user_reponse.data);

                    if (response.data.asker[0] == user._id) {
                        answeredQuest.push(questions[i]);
                    }

                }

            }

        }

        setqAnswered(answeredQuest);

    }

    console.log("This is the user that clicked", user.username, user.reputation);

    console.log("This is ourTags", ourTags);
    
    console.log("These are the questions which we have answered", answeredQuest);

    function calcDate(registryDate) {

        const registrationDate = new Date(registryDate)
        const currentDate = new Date()
      
        const secs = Math.floor((currentDate - registrationDate) / 1000)
        const days = Math.floor((secs % (30 * 24 * 60 * 60)) / (24 * 60 * 60))
        const hours = Math.floor((secs % (24 * 60 * 60)) / (60 * 60))
        const minutes = Math.floor((secs % (60 * 60)) / 60)
        const seconds = secs % 60;
      
        let result = ''
        if (days > 0) {
          result += `${days} days, `
        }
      
        if (hours > 0) {
          result += `${hours} hours, `
        }
        if (minutes > 0) {
          result += `${minutes} minutes, `
        }
        if (seconds > 0) {
          result += `${seconds} seconds`
        }
        result = result.replace(/, $/, '')
      
        return result

      }

      const confirm = async (id) => {

        const check = window.confirm("Are you sure you want to delete this user");

        console.log("This is the id for the user", id);

        if (check) {

            //before we delete the user we will delete everything associated with them

            for (let i = 0; i < questions.length; i++) {

                if (questions[i].asker[0] === id) {

                    var specificQuestion = questions[i]
                    console.log('this the specifiic question', specificQuestion);
                    
                        try{

                    
                          for (const answer of specificQuestion.answers) { 
                    
                            var gottenAns = await axios.get(`http://localhost:8000/thisanswer/${answer}`)
                           // console.log('le gotten ans', gottenAns.data)
                    
                            for(const ansComment of gottenAns.data.comments){ //DELETING THE COMMENTS OF THE ANSWER OF THE QUESTION LFAMO!!?!?!??!
                              const ansComRes = await axios.delete(`http://localhost:8000/deleteComment/${ansComment}`)
                            }
                    
                            const ansDelRes = await axios.delete(`http://localhost:8000/deleteAnswer/${answer}`); //DELETING EVERY ANSWER
                            
                          }
                    
                          for (const comment of specificQuestion.comments) { //DELETING THE COMMENTS OF QUESTION
                            //console.log('le indiv comms', comment);
                            const commDelRes = await axios.delete(`http://localhost:8000/deleteComment/${comment}`);
                           
                          }
                    
                        
                          for(const tag of specificQuestion.tags){  //LOOP THROUGH ALL OUR TAGS
                            var tagCount = 0
                            console.log('WHAT IS QUESTIONS', questions)

                            var myTag = true;

                            for(const question of questions){ //LOOP THROUGH ALL OUR QUESTIONS
                            
                              for(const questTag of question.tags){ //LOOP THROUGH ALL OF OUR QUESTION TAGS ARRAY

                                if(tag == questTag){
                                  tagCount++
                                }
                              }
                            }
                            console.log('THIS LE TAGCOUNT', tagCount)
                            if(tagCount == 1){
                              console.log('TIME TO DELETE THIS TAG ')
                              const ansTagRes = await axios.delete(`http://localhost:8000/deleteTag/${tag}`)
                            }
                          }
                    
                          const deleteRes = await axios.delete(`http://localhost:8000/deleteQuestion/${specificQuestion._id}`) //DELETING THE QUESTION ITSELF
                    
                        }catch(error){
                          console.log(error)
                        }
                }

            }

            const deleteReponse = await axios.delete(`http://localhost:8000/deleteUser/${id}`);

        } else {
            console.log("They pressed no");
        }

      }
    

    return(
        <>

        <div className="user_info">
            <div className="username_div">
                <nav>Username</nav>
                <h3>{user.username}</h3>
            </div>

            <div className="username_div">
                <nav>Member Since</nav>
                <h3>{calcDate(user.registryDate)} ago</h3>
            </div>
            
            <div className='userrep_div'>
                <nav>Reputation</nav>
                <h3>{user.reputation}</h3>
            </div>
            
        </div>

        <br/>
        <br/>
        <br/>

        <div className='user_questions_container'>
            <div className='user_questions'>
                <nav>Your Questions</nav>
                <ul>
                    {ourQuestions.length == 0 ? (
                        <li className='no_quest'>No Questions Found</li>
                    ) : (
                        ourQuestions.map((question, index) => (
                            <li key={index}>
                                <p onClick={() => { setindivQuestion(question._id); setOther(false);}} className="questTit" style={{ color: 'blue' }}>
                                    {question.title}
                                </p>
                            </li>
                        ))
                    )}
                </ul>
            </div>


            <ul className="user_links">
                <li>
                    <p className="questTit" onClick={() => { setTClick(true); setiTag(ourTags); setOther(false);}} style={{ color: 'blue', fontSize: '28px' }}>
                        View all tags
                    </p>
                </li>
                <li>
                    <p className="questTit" onClick={() => { setQAns(true); fetchAnsQuestions(); setOther(false);}} style={{ color: 'blue', fontSize: '28px' }}>
                        View all answered questions
                    </p>
                </li>
            </ul>
        </div>

        {isAdmin ? (

            otherUser ? (
                null
            ) : (

                <div className='user_questions'>
                    <nav>All Users</nav>
                    <ul>
                        {usersArray.map((user, index) => (
                            <li key={index} className='user_lister'>
                                <p className='profileTit' onClick={() => {setOther(true); setUser(user)}} style={{ color: 'blue', fontSize: '20px' }}>{user.username}</p>
                                <button className='user_delete' onClick={() => confirm(user._id)}>Delete User</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )

        ) : null}

        </>
        
    );    

}

export default Profile;