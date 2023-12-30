import React, {useEffect, useState } from 'react';
import axios from 'axios'

axios.defaults.withCredentials = true;

export default function Questionform( {somelist, tagsArray, updateForm, is_edit, specificQuestion, setEdit}) {

  const [newQuestionTags, setnewTags] = useState('');

  if (is_edit) {
    console.log("THE PROFILE QUESTION HAS BEEN CLICKED, IS EDIT IS TRUE");
    console.log("This is the specific question", specificQuestion);
  }

  let questId = somelist.length + 1; //for calculating the qid for each quest

  const [tagInput, setTags] = useState('');
  const [titleError, setTitle] = useState(false);
  const [charTagError, setCharError] = useState(false);
  const [tagError, setTagError] = useState(false)
 // var [textError, setText] = useState(false);

  var textError = false 

  var response;

  console.log('This is somelist', somelist);
  
  //console.log('TEXT AT THE TOP: ' + textError);

  const [formInput, setFormInput] = useState({ //STATE FOR QUESTION INPUT IS AN OBJECT
    qid: 'q' + questId,
    title: '',
    summary: '',
    text: '', 
    tagIds: [],
    askedBy: '',
    askDate: new Date(),
    ansIds: [],
    views: 0

  })

  useEffect(() => {

    fetchTags();

  }, [])

  const fetchTags = async () => {

    const tagQuestions = []

    if (specificQuestion != null) {

      for (let i = 0; i < specificQuestion.tags.length; i++) {

        //here we are going to have to get a specific tag
        const response = await axios.get(`http://localhost:8000/thistag/${specificQuestion.tags[i]}`);

        tagQuestions.push(response.data.name);

      }

      setnewTags(tagQuestions.join(' '));      

    }


  }

  useEffect(() => {

    setTags(newQuestionTags);

  }, [newQuestionTags]);

  console.log("These are the questionTags", newQuestionTags);

  const newTags = [] //make a new tags array and add all the tags we got from user input INTO it

  async function submitActivity(event) { //when the form is submitted

    event.preventDefault(); //prevent page refresh

    if (formInput.title.length > 100) {
      setTitle(true);
      
    } else if (formInput.summary.length > 140) {
        alert('Question Summary is too long')
    } 
    else {

      const storeArray = tagInput.split(" ")

      let foundSomeError = 0;

      if(storeArray.length > 5){
        setTagError(true)
        alert('You have more than 5 tags')
        foundSomeError = 1;
      } else {
        for(let i = 0; i < storeArray.length; i++){
          if(storeArray[i].length > 10){
            setCharError(true)
            alert('Each tag must be less than 10 characters')
            foundSomeError = 1
            break;
          }
        }
      }
      if(foundSomeError == 0){
        setTitle(false);
      const tagArray = tagInput.split(" ");

      for (let j = 0; j < tagArray.length; j++) {

        //first check if the tag name already exists or not
        var alreadyExists = 0;
        var commonTag;

        for (let j2 = 0; j2 < tagsArray.length; j2++) {

           // console.log("This is the name in tagarray:" + tagArray[j]);
            //console.log("This is the name in newquest:" + newQuestion.data.tags[j2].name);

            if (tagsArray[j2].name.toLowerCase() === tagArray[j].toLowerCase()) {
                commonTag = tagsArray[j2];
                alreadyExists = 1;
                break;
            }

        }


        if (alreadyExists === 0) {

           // var tempTagLength = tagsArray.length + 1;

            // let tObj = ({
            //     tid: 't' + tempTagLength,
            //     name: tagArray[j]
            // })

          // tagsArray.push(tObj);

           try{
            response = await axios.post('http://localhost:8000/createTag',
            {
              name: tagArray[j]
            })

            newTags.push(response.data._id); //all we need is the ID from the server response haha
            response = null;

           } catch(error){

            console.log(error)
           }//GOTTA RESET THIS 
           // console.log(response.data)

            
           // console.log("below is the new question tags");
            console.log('This is new tags array', newTags)

    var regExp = /\(([^)]+)\)/g;
    var matches = formInput.text.match(regExp);

    var matchesNoParen = []

    if(matches != null){
      for (let i = 0; i < matches.length; i++) {
        matchesNoParen.push(matches[i].substring(1, matches[i].length - 1));
      }
    }

    var secondExp = /\[(.*?)\]/g;
    var matches_two = formInput.text.match(secondExp);

    var matchesTwoParen = []

   if(matches_two != null){
    for (let i = 0; i < matches_two.length; i++) {
      matchesTwoParen.push(matches_two[i].substring(1, matches_two[i].length - 1));
    }   
   } 

    // console.log("Below is the text from the form after the regEX");
    // console.log(matchesNoParen);
    
    // console.log("Below is matches 2");
    // console.log(matchesTwoParen);

    if ((matchesTwoParen != null) && (matchesNoParen == null)) {
      //let x = 0;

    } else if ((matchesTwoParen != null) && (matchesNoParen != null)) {

      if(matches != null){
        for(let i = 0; i < matches.length; i++){
          formInput.text = formInput.text.replace(`[${matchesTwoParen[i]}]`, `<a href="${matchesNoParen[i]}">${matchesTwoParen[i]}</a>`);
            //console.log('i is this: ' + i);
          formInput.text = formInput.text.replace(`(${matchesNoParen[i]})`,'')
          }
          //console.log("Google text");
          //console.log(formInput.text);
      }

    }

    //const { qid, title, text, tagIds, askedBy, askDate, ansIds, views } = formInput;


        } else { //else if the tag already exists !
             // formInput.tagIds.push(commonTag.tid);
             console.log('AT LEAST I MADE IT TO ELSE STATE')
          try{
            
            //console.log('THIS IS THE COMMON TAG', commonTag.name)
            var response2 = await axios.get(`http://localhost:8000/findTag/${commonTag.name}`)
            
            //console.log('IM GETTING RESPONSE2 BACK', response2.data[0]._id)
            newTags.push(response2.data[0]._id); //HAVE TO PUT IT TO AN ARRAY[0] TO GET THE ID
            response2 = null;
         
            
          } catch(error){
            console.log(error)
          }
        }

      //  console.log("Below is the realTags array final product");
       // console.log(realTags);

        //console.log("Below is the newQuestion final product");
        //console.log(tagsArray);

      }

       regExp = /\(([^)]+)\)/g;
       matches = formInput.text.match(regExp);

       matchesNoParen = []

      if(matches != null){ //matches is parentheses
        for (let i = 0; i < matches.length; i++) {
          const index2 = formInput.text.indexOf(matches[i]);
          if(formInput.text.charAt(index2 - 1) === ']'){
            var httpsLink = formInput.text.substring(index2 + 1, index2 + 9);
            var httpLink = formInput.text.substring(index2 + 1, index2 + 8);
            if(httpsLink === 'https://' || httpLink === 'http://'){
          matchesNoParen.push(matches[i].substring(1, matches[i].length - 1));
           }else{
            textError = true 
            alert('Link must start with https:// or http://')
           // console.log('HUGE HTTP ERROR LOLL OLOLOL')
            
           }
        }
        }
      }

     
      secondExp = /\[(.*?)\]/g;
       matches_two = formInput.text.match(secondExp);

       matchesTwoParen = []

    if(matches_two != null){
      for (let i = 0; i < matches_two.length; i++) {

      const index = formInput.text.indexOf(matches_two[i]);
      if(formInput.text.charAt(index + matches_two[i].length) === '('){
        if(formInput.text.charAt(index + matches_two[i].length + 1) !== ')'){
          //console.log('IM HEREEEEEEEEEEEEE')
        matchesTwoParen.push(matches_two[i].substring(1, matches_two[i].length - 1));
        }else{
         // console.log('THIS IS FALSE INSIDEINSIDE');
          textError = true;
          alert('Enter a valid hyperlink in the parentheses')
         // console.log('TEXT ERROR INSIDE INSIDEINSIDE: ' + textError);
          break;
        }
      }
      }   
    } 

    //console.log('TEXT ERROR BENEATH: ' + textError);

      // console.log("Below is the text from the form after the regEX");
      // console.log(matchesNoParen);
      
      // console.log("Below is matches 2");
      // console.log(matchesTwoParen);
      // console.log('TEXT ERROR IS NOW: ' + textError);

      if(textError === false){
        if ((matchesTwoParen != null) && (matchesNoParen == null)) {
          //let x = 0;
  
        } else if ((matchesTwoParen != null) && (matchesNoParen != null)) {
  
          if(matches != null){
            for(let i = 0; i < matches.length; i++){
              formInput.text = formInput.text.replace(`[${matchesTwoParen[i]}]`, `<a href="${matchesNoParen[i]}">${matchesTwoParen[i]}</a>`);
               // console.log('i is this: ' + i);
              formInput.text = formInput.text.replace(`(${matchesNoParen[i]})`,'')
              }
             // console.log("Google text");
             // console.log(formInput.text);
          }
  
        }
  
         // console.log("Below is the tagIds object see if it updated");
       // console.log(tagIds);

        const { title, summary, text, askedBy, askDate, views } = formInput;
  
     //  question.push({ qid, title, text, tagIds, askedBy, askDate,  ansIds, views });
        
        try{
          const response = await axios.post('http://localhost:8000/createQuestion',
        {
          title: title,
          summary: summary,
          text: text,
          tags: newTags,
          asked_by: askedBy,
          ask_date_time: askDate,
         // answers: ansIds,
          views: views
        }
        )

        if (response.data.message) {
          alert(response.data.message);
        }

        } catch(error){
          console.log(error)
        }

  
        setFormInput({ //reset back to default empty input!
          qid: '',
          title: '',
          summary: '',
          text: '',
          tagIds: [],
          askedBy: '',
          askDate: '',
          ansIds: [],
          views: 0
  
        })
  
       // console.log('successfully added question!')
       // console.log(somelist.length)
      //  console.log(somelist)
  
        updateForm(false);
        
      }
      }
      
    }
    

  }


  async function editActivity(event) { //when the form is submitted

    event.preventDefault(); //prevent page refresh

    console.log("Does this ever get activated");

    console.log("This is the formInput", formInput);

    if (formInput.title.length > 100) {
      setTitle(true);
      
    } else if (formInput.summary.length > 140) {
        alert('Question Summary is too long')
    } 
    else {

      const storeArray = tagInput.split(" ")

      let foundSomeError = 0;

      if(storeArray.length > 5){
        setTagError(true)
        alert('You have more than 5 tags')
        foundSomeError = 1;
      } else {
        for(let i = 0; i < storeArray.length; i++){
          if(storeArray[i].length > 10){
            setCharError(true)
            alert('Each tag must be less than 10 characters')
            foundSomeError = 1
            break;
          }
        }
      }
      if(foundSomeError == 0){
        setTitle(false);
      const tagArray = tagInput.split(" ");

      for (let j = 0; j < tagArray.length; j++) {

        //first check if the tag name already exists or not
        var alreadyExists = 0;
        var commonTag;

        for (let j2 = 0; j2 < tagsArray.length; j2++) {

           // console.log("This is the name in tagarray:" + tagArray[j]);
            //console.log("This is the name in newquest:" + newQuestion.data.tags[j2].name);

            if (tagsArray[j2].name.toLowerCase() === tagArray[j].toLowerCase()) {
                commonTag = tagsArray[j2];
                alreadyExists = 1;
                break;
            }

        }


        if (alreadyExists === 0) {


           try{
            response = await axios.post('http://localhost:8000/createTag',
            {
              name: tagArray[j]
            })

            newTags.push(response.data._id);
            response = null;

           } catch(error){

            console.log(error)
           }//GOTTA RESET THIS 
            
            console.log('This is new tags array', newTags)

    var regExp = /\(([^)]+)\)/g;
    var matches = formInput.text.match(regExp);

    var matchesNoParen = []

    if(matches != null){
      for (let i = 0; i < matches.length; i++) {
        matchesNoParen.push(matches[i].substring(1, matches[i].length - 1));
      }
    }

    var secondExp = /\[(.*?)\]/g;
    var matches_two = formInput.text.match(secondExp);

    var matchesTwoParen = []

   if(matches_two != null){
    for (let i = 0; i < matches_two.length; i++) {
      matchesTwoParen.push(matches_two[i].substring(1, matches_two[i].length - 1));
    }   
   } 

    if ((matchesTwoParen != null) && (matchesNoParen == null)) {
      //let x = 0;

    } else if ((matchesTwoParen != null) && (matchesNoParen != null)) {

      if(matches != null){
        for(let i = 0; i < matches.length; i++){
          formInput.text = formInput.text.replace(`[${matchesTwoParen[i]}]`, `<a href="${matchesNoParen[i]}">${matchesTwoParen[i]}</a>`);
            //console.log('i is this: ' + i);
          formInput.text = formInput.text.replace(`(${matchesNoParen[i]})`,'')
          }

      }

    }

        } else { //else if the tag already exists !
             // formInput.tagIds.push(commonTag.tid);
             console.log('AT LEAST I MADE IT TO ELSE STATE')
          try{
            
            //console.log('THIS IS THE COMMON TAG', commonTag.name)
            var response2 = await axios.get(`http://localhost:8000/findTag/${commonTag.name}`)
            
            //console.log('IM GETTING RESPONSE2 BACK', response2.data[0]._id)
            newTags.push(response2.data[0]._id); //HAVE TO PUT IT TO AN ARRAY[0] TO GET THE ID
            response2 = null;
         
          } catch(error){
            console.log(error)
          }
        }

      }

       regExp = /\(([^)]+)\)/g;
       matches = formInput.text.match(regExp);

       matchesNoParen = []

      if(matches != null){ //matches is parentheses
        for (let i = 0; i < matches.length; i++) {
          const index2 = formInput.text.indexOf(matches[i]);
          if(formInput.text.charAt(index2 - 1) === ']'){
            var httpsLink = formInput.text.substring(index2 + 1, index2 + 9);
            var httpLink = formInput.text.substring(index2 + 1, index2 + 8);
            if(httpsLink === 'https://' || httpLink === 'http://'){
          matchesNoParen.push(matches[i].substring(1, matches[i].length - 1));
           }else{
            textError = true 
            alert('Link must start with https:// or http://')
           // console.log('HUGE HTTP ERROR LOLL OLOLOL')
            
           }
        }
        }
      }

     
      secondExp = /\[(.*?)\]/g;
       matches_two = formInput.text.match(secondExp);

       matchesTwoParen = []

    if(matches_two != null){
      for (let i = 0; i < matches_two.length; i++) {

      const index = formInput.text.indexOf(matches_two[i]);
      if(formInput.text.charAt(index + matches_two[i].length) === '('){
        if(formInput.text.charAt(index + matches_two[i].length + 1) !== ')'){
          //console.log('IM HEREEEEEEEEEEEEE')
        matchesTwoParen.push(matches_two[i].substring(1, matches_two[i].length - 1));
        }else{
         // console.log('THIS IS FALSE INSIDEINSIDE');
          textError = true;
          alert('Enter a valid hyperlink in the parentheses')
         // console.log('TEXT ERROR INSIDE INSIDEINSIDE: ' + textError);
          break;
        }
      }
      }   
    } 

      if(textError === false){
        if ((matchesTwoParen != null) && (matchesNoParen == null)) {
          //let x = 0;
  
        } else if ((matchesTwoParen != null) && (matchesNoParen != null)) {
  
          if(matches != null){
            for(let i = 0; i < matches.length; i++){
              formInput.text = formInput.text.replace(`[${matchesTwoParen[i]}]`, `<a href="${matchesNoParen[i]}">${matchesTwoParen[i]}</a>`);
               // console.log('i is this: ' + i);
              formInput.text = formInput.text.replace(`(${matchesNoParen[i]})`,'')
              }
             // console.log("Google text");
             // console.log(formInput.text);
          }
  
        }
  
         // console.log("Below is the tagIds object see if it updated");
       // console.log(tagIds);

        const { title, summary, text, askedBy, askDate, views } = formInput;

        console.log("HEY WE AR GETTING IT AGAIN HOHO", formInput);
  
     //  question.push({ qid, title, text, tagIds, askedBy, askDate,  ansIds, views });
        
        try{
          const response = await axios.put(`http://localhost:8000/editquestion/${specificQuestion._id}`,
          {
            title: title,
            summary: summary,
            text: text,
            tags: newTags,
            asked_by: askedBy,
            ask_date_time: askDate,
          // answers: ansIds,
            views: views
          }
        )

        if (response.data.message) {
          alert(response.data.message);
        }

        } catch(error){
          console.log(error)
        }

  
        setFormInput({ //reset back to default empty input!
          qid: '',
          title: '',
          summary: '',
          text: '',
          tagIds: [],
          askedBy: '',
          askDate: '',
          ansIds: [],
          views: 0
  
        })
  
       // console.log('successfully added question!')
       // console.log(somelist.length)
      //  console.log(somelist)
  
        updateForm(false);
        
      }
      }
      
    }
    

  }

  const [titleVal, setTitleVal] = useState('');
  const [sumVal, setSumVal] = useState('');
  const [textVal, setTextVal] = useState('');
  const [userVal, setUserVal] = useState('');

  useEffect(() => {

    if (is_edit === true) {

      console.log("This is the specificQuestion", specificQuestion);

      setTitleVal(`${specificQuestion.title}`);
      setSumVal(`${specificQuestion.summary}`);
      setTextVal(`${specificQuestion.text}`);
      setUserVal(`${specificQuestion.asked_by}`)

      setFormInput({
        ...formInput,
        title: specificQuestion.title,
        summary: specificQuestion.summary,
        text: specificQuestion.text,
        askedBy: specificQuestion.asked_by,
      });

    }

  }, [is_edit])

  //when input changes, update the input
  function updateTitle(event){
    const { value } = event.target;

    setFormInput((formInput) => ({
      ...formInput,
      title: value,
    }));
  }

  function editTitle(event) {
    const { value } = event.target; // Destructure the value directly from event.target
    setTitleVal(value); // Update the state with the value
  
    setFormInput((formInput) => ({
      ...formInput,
      title: value,
    }));
  }

  function updateSummary(event) {
    const {value} = event.target;

    setFormInput((formInput) => ({
      ...formInput,
      summary: value,
    }));
  }

  function editSummary(event) {
    const { value } = event.target; // Destructure the value directly from event.target
    setSumVal(value); // Update the state with the value
  
    setFormInput((formInput) => ({
      ...formInput,
      summary: value,
    }));
  }

  function updateText(event){
    const { value } = event.target;

    setFormInput((formInput) => ({
      ...formInput,
      text: value,
    }));
  }

function editText(event) {
  const { value } = event.target; // Destructure the value directly from event.target
  setTextVal(value); // Update the state with the value

  setFormInput((formInput) => ({
    ...formInput,
    text: value,
  }));
}

  function updateUser(event){
    const { value } = event.target;

    setFormInput((formInput) => ({
      ...formInput,

      askedBy: value,

    }));
  }

  function editUser(event) {
    const { value } = event.target; // Destructure the value directly from event.target
    setUserVal(value); // Update the state with the value
  
    setFormInput((formInput) => ({
      ...formInput,
      askedBy: value,
    }));
  }

  async function deleteQuestion(event){
    event.preventDefault();

    try{
      //THIS IS SO CRAZY MAN, WE HAVE TO DELETE THE COMMENTS, 
      //THEN THE COMMENTS OF AN ANSWER, THEN THE ANSWER, AND THEN THE QUESTION
      //AND THEN CHECK IF THE TAG WE'RE DELETING ONLY BELONGS TO 1 QUESTION
      //AND THEN DELETE THAT TAG IF SO

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

      //after i delete a tag, i will loop through tag array
    //then loop through the question.tags arrays and check if that tag exists
    //if the tag does not exist in any of the questions, will remove it from the list
    
      for(const tag of specificQuestion.tags){  //LOOP THROUGH ALL OUR TAGS
        var tagCount = 0
        for(const question of somelist){ //LOOP THROUGH ALL OUR QUESTIONS
        
          for(const questTag of question.tags){ //LOOP THROUGH ALL OF OUR QUESTION TAGS ARRAY
           // console.log('le quest tag',questTag)
           //console.log('le real tag', tag)
            if(tag == questTag){
              tagCount++
            }
          }
        }
       // console.log('THIS LE TAGCOUNT', tagCount)
        if(tagCount == 1){ //WE ONLY HAVE 1 TAG, SO WE CAN SAFELY DELETE IT NOW WITHOUT WORRY OF DELETING OTHER USERS TAG
         // console.log('TIME TO DELETE THIS TAG ')
          const ansTagRes = await axios.delete(`http://localhost:8000/deleteTag/${tag}`)
        }
      }

      const deleteRes = await axios.delete(`http://localhost:8000/deleteQuestion/${specificQuestion._id}`) //DELETING THE QUESTION ITSELF
      //console.log(deleteRes.data);
      setEdit(false)
      updateForm(false)

    }catch(error){
      console.log(error)
    }

  }

  console.log("This is the form input", formInput);

  return (
    
    <div className = "question-form" style={{display: 'block'}}>

      {is_edit ? (

        <form className="question-box-form" action="" onSubmit = {editActivity}>
        <h2 className="question-heading"> Edit Question Title*</h2>
        <h4 className="question-require">Limit title to 100 characters or less</h4>
        <textarea className="question-text" onChange = {editTitle}  name="" id="q-title" cols="80" rows="2" placeholder="Write Question Title" value={titleVal} required></textarea>
        <br/>
        {titleError ? (

          <span className="error-message">Enter a title with 100 characters or less</span>

        ) : null}

        <h2 className="question-heading">Edit Question Summary*</h2>
        <h4 className="question-require">Limit summary to 140 characters or less</h4>
        <textarea className="question-text" onChange = {editSummary } name="" id="q-description" cols="80" rows="4" placeholder="Write Question Summary" value={sumVal} required></textarea>
        <br/>

        <h2 className="question-heading">Edit Question Text*</h2>
        <h4 className="question-require">Add Details</h4>
        <textarea className="question-text" onChange = {editText}  name="" id="q-description" cols="80" rows="7" placeholder="Write Question Text" value={textVal} required></textarea>
        {textError ? (

          <span className="error-message">Enter a valid hyperlink in the parentheses</span>

          ) : null}

        <h2 className="question-heading">Edit Tags*</h2>
        <h4 className="question-require">Add keywords separated by whitespace</h4>
        <textarea className="question-text" onChange = {(e) => setTags(e.target.value)} name="" id="q-tags" cols="80" rows="2" placeholder="Write Tags" value={tagInput} required></textarea>

        <span id="tag-error" className="error-message" style={{display: 'none'}}>Enter a tag with 10 characters or less</span>
        <span id="max-tags" className="error-message" style={{display: 'none'}}>Enter 5 or less tags</span>

        <h2 className="question-heading">Edit Username*</h2>

        <textarea className="question-text" onChange = {editUser} name="" id="q-username" cols="80" rows="2" placeholder="Your Username" value={userVal} required></textarea>


        <br/>
        <br/>
        <input type="submit" name="" value="Post Question" className="send-btn"/>
        <button onClick={deleteQuestion} className="deleteBtn">Delete</button>
        <h4 className = "required-field-header" style={{display: 'inline'}}>*indicates mandatory fields</h4>

        </form>


      ) : (

      <form className="question-box-form" action="" onSubmit = {submitActivity}>
        <h2 className="question-heading">Question Title*</h2>
        <h4 className="question-require">Limit title to 100 characters or less</h4>
        <textarea className="question-text" onChange = {updateTitle}  name="" id="q-title" cols="80" rows="2" placeholder="Write Question Title" required></textarea>
        <br/>
        {titleError ? (

          <span className="error-message">Enter a title with 100 characters or less</span>

        ) : null}

        <h2 className="question-heading">Question Summary*</h2>
        <h4 className="question-require">Limit summary to 140 characters or less</h4>
        <textarea className="question-text" onChange = {updateSummary } name="" id="q-description" cols="80" rows="4" placeholder="Write Question Summary" required></textarea>
        <br/>

        <h2 className="question-heading">Question Text*</h2>
        <h4 className="question-require">Add Details</h4>
        <textarea className="question-text" onChange = {updateText}  name="" id="q-description" cols="80" rows="7" placeholder="Write Question Text" required></textarea>
        {textError ? (

          <span className="error-message">Enter a valid hyperlink in the parentheses</span>

          ) : null}

        <h2 className="question-heading">Tags*</h2>
        <h4 className="question-require">Add keywords separated by whitespace</h4>
        <textarea className="question-text" onChange = {(e) => setTags(e.target.value)} name="" id="q-tags" cols="80" rows="2" placeholder="Write Tags" required></textarea>

        <span id="tag-error" className="error-message" style={{display: 'none'}}>Enter a tag with 10 characters or less</span>
        <span id="max-tags" className="error-message" style={{display: 'none'}}>Enter 5 or less tags</span>

        <h2 className="question-heading">Username*</h2>

        <textarea className="question-text" onChange = {updateUser} name="" id="q-username" cols="80" rows="2" placeholder="Your Username" required></textarea>


        <br/>
        <br/>
        <input type="submit" name="" value="Post Question" className="send-btn"/>
        <h4 className = "required-field-header" style={{display: 'inline'}}>*indicates mandatory fields</h4>

      </form>

      )}





    </div>
    
  );
}