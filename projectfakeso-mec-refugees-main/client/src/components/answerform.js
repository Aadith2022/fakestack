import React, {useEffect, useState } from 'react';
import axios from "axios";
import '../stylesheets/App.css';

function AnswerForm({question, editAnswer, thisAnswer, updateForm, addAns}) {

    const [formInput, setFormInput] = useState({

        text: '',
        ans_by: '',
        ans_date_time: new Date()

    })

    async function submitActivity(event) {

        event.preventDefault();

        const {text, ans_by, ans_date_time} = formInput;

        console.log("This is the formInput obbject");
        console.log({text, ans_by, ans_date_time});

        try {
          const res = await axios.post('http://localhost:8000/add_answer', { text, ans_by, ans_date_time });
          console.log('Answer was added successfully:', res.data);
      
          const copied_answers = [...question.answers];

          copied_answers.push(res.data._id);

          console.log("This is the new id");
          console.log(res.data._id);
      
          const res2 = await axios.put(`http://localhost:8000/add_question_answer/${question._id}`, {
            //views: question.views + 1,
            answers: copied_answers,
          });
      
          console.log('Question was updated successfully', res2.data);
      
          updateForm(false)
          addAns(true)
          
        } catch (err) {
          console.error('Error:', err);
        }

    }

    async function editActivity(event) {

      event.preventDefault();

      const {text, ans_by} = formInput;

      console.log("This is the formInput obbject");
      console.log({text, ans_by});

      try {
        const res = await axios.put(`http://localhost:8000/editanswer/${thisAnswer._id}`, { text, ans_by });
        console.log('Answer was updated successfully:', res.data);
    
        const copied_answers = [...question.answers];

        const index = copied_answers.findIndex(answer => answer._id === res.data._id);

        copied_answers[index] = res.data._id;

        console.log("This is the new id");
        console.log(res.data._id);
    
        const res2 = await axios.put(`http://localhost:8000/add_question_answer/${question._id}`, {
          answers: copied_answers,
        });
    
        console.log('Question was updated successfully', res2.data);
    
        updateForm(false)
        addAns(true)
        
      } catch (err) {
        console.error('Error:', err);
      }

  }

    function updateUser(event) {
        const {value} = event.target;

        setFormInput((formInput) => ({
            ...formInput,
            ans_by:value
        }))

    }

    function editUser(event) {
      const {value} = event.target;

      setUserVal(value);

      setFormInput((formInput) => ({
          ...formInput,
          ans_by:value
      }))

  }

    function updateText(event) {
        const {value} = event.target;

        setFormInput((formInput) => ({
            ...formInput,
            text: value
        }))
    }

    function editText(event) {
      const {value} = event.target;

      setTextVal(value);

      setFormInput((formInput) => ({
          ...formInput,
          text: value
      }))
  }

  const [userVal, setUserVal] = useState('');
  const [textVal, setTextVal] = useState('');

  useEffect(() => {

    if (editAnswer === true) {

      setUserVal(`${thisAnswer.ans_by}`);
      setTextVal(`${thisAnswer.text}`);

      setFormInput({
        ...formInput,
        text: thisAnswer.text,
        ans_by: thisAnswer.asked_by,
      });

    }

  }, [editAnswer])

    return (

      <>

        {

          editAnswer ? (

            <div className="answer-form-div" >
            <form className="answer-form" onSubmit = {editActivity}>
              <h2 className="answer-username-head">Edit Username*</h2>
              <textarea className="answer-username" name="" cols="80" rows="2" placeholder="Write Username" value = {userVal} onChange = {editUser} required></textarea>

              <h2 className="answer-text-head">Edit Answer Text*</h2>
              <textarea className="answer-text" name="" cols="80" rows="12" placeholder="Write Answer" value = {textVal} onChange = {editText} required></textarea>

                <br/>

              <button className="post-ans-btn">Update Answer</button>
              <h4 className = "required-field-header" style = {{ display: 'inline', marginLeft: '60px'}}>*indicates mandatory fields</h4>

            </form>
          </div>

          ) : (

          <div className="answer-form-div" >
            <form className="answer-form" onSubmit = {submitActivity}>
              <h2 className="answer-username-head">Username*</h2>
              <textarea className="answer-username" name="" cols="80" rows="2" placeholder="Write Username" onChange = {updateUser} required></textarea>

              <h2 className="answer-text-head">Answer Text*</h2>
              <textarea className="answer-text" name="" cols="80" rows="12" placeholder="Write Answer" onChange = {updateText} required></textarea>

                <br/>

              <button className="post-ans-btn">Post Answer</button>
              <h4 className = "required-field-header" style = {{ display: 'inline', marginLeft: '60px'}}>*indicates mandatory fields</h4>

            </form>
          </div>

          )

        }      
      
      </>

    );

}

export default AnswerForm;