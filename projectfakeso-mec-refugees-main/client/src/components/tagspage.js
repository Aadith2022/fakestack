import '../stylesheets/App.css';
import React, { useEffect, useState } from 'react';
import QuestionForm from './questionform.js';
import axios from "axios";
import ShowTagsBox from './showboxtag.js';

export default function TagsPage({somelist,updateWelcome, setTClick, newQuestion, thisUser, ptagClick, showForm, updateForm, updateTBool, updateTSearch, updateTags}) {
  //HERE somelist IS THE TAGS ARRAY FOR SOME REASON

  console.log("This is the ptagclick", ptagClick);

  console.log("This is the somelist in tagspage", somelist);

  const [tEdit, setTEdit] = useState(false);
  const [tTag, setTTag] = useState(null);
  const [formInput, setFormInput] = useState({

      name: '',

  })

  const [tagList, setTagList] = useState(somelist);

  useEffect(() => {

    setTagList(somelist);

  }, [somelist]);

  const [tagInput, setTInput] = useState('');

    function showF (){
        updateForm(true);   //when ask question is clicked, set the boolean to true
        console.log("I set it back to true");
      }

    function editTag(event) {
      const {value} = event.target

      setTInput(value);

      setFormInput((formInput) => ({
        ...formInput,
        name:value
      }))

    }

    useEffect(() => {
      if (tTag) {
        setTInput(`${tTag.name}`);
        setFormInput((formInput) => ({
          ...formInput,
          name: tTag.name,
        }));
      }
    }, [tTag]);


    const editActivity = async (event) => {

      event.preventDefault();

      const {name} = formInput;

      if (name.length > 10) {
        alert("Input is too long")
      } else if (name.includes(' ')) {
        alert("Cannot have spaces");
      }

      console.log("This is the formInput", name);

      //first thing we are going to have to do is see if this tag exists already

      console.log("These are all of the tags", somelist);

      var exists = false;

      for (let i = 0; i < somelist.length; i++) {

        if (somelist[i].name == name) {
          exists = true;
          break;
        }

      }

      if (exists == false) {

        const response = await axios.put(`http://localhost:8000/edittag/${tTag._id}`, {name: name})

        console.log("The answer was updated sucessfully");

        console.log("This is the updated tag", response.data);

        const all_tags = await axios.get(`http://localhost:8000/tags`);

        const these_tags = all_tags.data;

        var our_tags = [];

        for (let i = 0; i < these_tags.length; i++) {

          if (these_tags[i].creator[0] == thisUser._id) {
            our_tags.push(these_tags[i]);
          }

        }

        console.log("These are all of the tags", our_tags);

        setTagList(our_tags);

        setTEdit(false);

      }

    }

    console.log("This is our TagList", tagList);


    return (
        <div>
        { showForm ? (
            <div className ="questions-info">
              <QuestionForm somelist={newQuestion} tagsArray = {somelist} updateForm = {updateForm}/>
            </div>
        ) :
        (

        <div className="tag-page" style={{display: 'block'}}>
         <div className="top-col">
          <h1 className="num-tags"> {somelist.length} Tags</h1>
          <h1 className="all-tags"> All Tags</h1>
  
          <a href="#/"> 

            <button className="ask-btn" onClick={showF}>Ask Question</button>

          </a>
         </div>

         <br/>

          {tEdit ? (

            <div className='edit-tag-div'>

              <form className='tag-form' onSubmit={editActivity}>
                <h2 className='answer-username-head'>Edit Tag</h2>
                <textarea className="answer-username" name="" cols="80" rows="2" value = {tagInput} onChange = {editTag} required></textarea>
                <button className="tag-btn">Update Tag</button>
              </form>

            </div>

          ) : (

          <div className="tags-box">

            <ShowTagsBox updateWelcome={updateWelcome} setTClick={setTClick} somelist={tagList} ptagClick={ptagClick} setTEdit={setTEdit} setTTag={setTTag} newQuestion = {newQuestion} updateTBool = {updateTBool} updateTSearch = {updateTSearch} updateTags = {updateTags}/>

          </div>

          )}


      </div>

        )}
        </div>
    )
    


}