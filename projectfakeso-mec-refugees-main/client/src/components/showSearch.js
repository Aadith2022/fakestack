import '../stylesheets/App.css';
import ShowTags from './displaytags.js';

//maybe a tagClick boolean as well as another searchInput, and if the tag is clicked we render it with the dup
function ShowSearch({somelist, searchInput, headerClick, tagsArray}) {
    
    console.log('im here in SHOWSEARCHHH!!!')
    console.log('THIS THE SEARCH RES: ' + searchInput);
    var search = searchInput.toLowerCase(); 
    search = searchInput.trim();
    if(search === ''){
      
        //setNoRes(true); // this means there was no results
        console.log("are we in the return nothing stament");
       return;
    }
    search = search.split(' '); //split each word in input String by whitespace 
    
    var resultsArray = []; //this is the questions array we will display as results
    var uniqueResults = []; //need this b/c for some reasont theres duplicates

    //HIDING EVERY PAGE
    // document.querySelector('.tag-page').style.display ='none';
    // document.querySelector('.questions-box').style.display = 'block';
    // document.querySelector('.question-form').style.display = 'none';
    // document.querySelector('.question-details').style.display = 'none';
    // document.querySelector('.answer-form').style.display = 'none';

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

    //CHECKING THROUGH THE QUESTION TITLE WORDS
    for(let i = 0; i < somelist.length; i++){ //iterate through question array
        console.log("This is some list", somelist[i]);
        var questionWords = somelist[i].title.split(' '); //splits the words of the question title

        for(let j = 0; j < search.length; j++){ //iterate through input strings words
            for(let k = 0; k < questionWords.length; k++){ //iterate through question title words
                if(questionWords[k].toLowerCase().includes(search[j].toLowerCase())){ // at least 1 word matches
                    //we have to use include instead of == for substrings
                    resultsArray.push(somelist[i]); //add it to the questions results we WANT to show to user
                    console.log('search success! Found a question');
                    console.log(resultsArray);
                    break; 
                    
                }
            }
        }
    }
     //TAG START
     var tag_search = searchInput.toLowerCase();

     //takes out spaces
     const tag_search_array = tag_search.split(' ');
     console.log("this the array after splitting spaces:" + tag_search_array);

     const actualTags = []
     const otherWords = [];

     //gets the tag names
     for (let j = 0; j < tag_search_array.length; j++) {

         //if there are brackets, delimit the string into a new string without brackets
         //if they meet this criteria then we put it into the actualTags array
         if ((tag_search_array[j].includes('[')) && (tag_search_array[j].includes(']'))) {

             let tagString = tag_search_array[j].replace(/\[|\]/g, '');
             console.log('tagString:'+ tagString);
             actualTags.push(tagString);

         } else {
             //otherwise we put it into the otherwords array
             otherWords.push(tag_search_array[j]);

         }

     }

     if (actualTags.length !== 0) {

         //this will hold any complete matches we find

         //now we will look through the question for matches in these both
         for (let j = 0; j < somelist.length; j++) {
             //some variable to check whether all the words in the search are included in this questions tags list
             var allMatch = 0

             //start by going through the words in the input
             for (let k = 0; k < actualTags.length; k++) {

                 //we need to look for this questions tids within the tag objects
                 const searchTags = [];

                 for (let z = 0; z < somelist[j].tags.length; z++) {

                     //looks for them in the tag object array and pushes the tag names into searchTags
                     for (let z2 = 0; z2 < tagsArray.length; z2++) {

                         if (tagsArray[z2]._id === somelist[j].tags[z]) {
                             console.log("hey they matched");
                             searchTags.push(tagsArray[z2].name);
                         }

                     }

                 }

                 console.log(searchTags);


                 //then we check to see if it is in this quesions tagsid array
                 //if so we increment allMatch, and at the end, we see check if it has
                 //if it is zero, we go to the next word
                 for (let k2 = 0; k2 < searchTags.length; k2++) {

                     console.log(searchTags[k2].includes(actualTags[k]));

                     if (searchTags[k2].includes(actualTags[k])) {
                         allMatch += 1;
                         break;
                     } else {
                         continue;
                     }

                 }

             }

             console.log("Here are the ones the I found:" + allMatch);

             //this means the tags for this question do not match the input tags at all
             if (allMatch === 0) {
                 continue;
             }

             //if there are no other words other than the tags, then push it
             if (otherWords.length === 0) {
                 uniqueResults.push(somelist[j]);
             } else {

                 //now we will check for title matches and body matches
                 var thisTitle = somelist[j].title.toLowerCase();

                 var thisBody = somelist[j].text.toLowerCase();

                 var foundAny = 0;

                 for (let m = 0; m < otherWords.length; m++) {

                     //if the title matches, push and break, else if the body does, also push and break
                     if (thisTitle.includes(otherWords[m].toLowerCase())) {
                         uniqueResults.push(somelist[j]);
                         foundAny = 1;
                         break;
                     } else if (thisBody.includes(otherWords[m].toLowerCase())) {
                         uniqueResults.push(somelist[j]);
                         foundAny = 1;
                         break;
                     }

                 }

                 if (foundAny === 0) {
                     uniqueResults.push(somelist[j]);
                 }

             }

         }

         console.log(uniqueResults);

         console.log("This is the length of uniqueResults:" + uniqueResults.length);

         //now we call the diplay search on this
        // displaySearch(uniqueResults);

     }

    //CHECKING THROUGH THE QUESTION TEXT WORDS
    for(let i = 0; i < somelist.length; i++){ //iterate through question array
        questionWords = somelist[i].text.split(' '); //splits the words of the question text

        for(let j = 0; j < search.length; j++){ //iterate through input strings words
            for(let k = 0; k < questionWords.length; k++){ //iterate through question text words
                if(questionWords[k].toLowerCase().includes(search[j].toLowerCase())){ // at least 1 word matches
                    //we have to use include instead of == for substrings
                    resultsArray.push(somelist[i]); //add it to the questions results we WANT to show to user
                    console.log('search success! Found a question');
                    console.log(resultsArray);
                    break; 
                    
                }
            }
        }
    }

    for(let i = 0; i < resultsArray.length; i++){
        if(!uniqueResults.includes(resultsArray[i])){
            uniqueResults.push(resultsArray[i]); //only include unique results 
        }
    }

    // if(uniqueResults.length == 0){
    //     document.querySelector('.noresults').style.display = 'block';
    // }

    console.log('BELOW IS UNIQUE')
    console.log(uniqueResults);
    

    return(
        
        <ul className = "questDisplay">

            {uniqueResults.map((question, index) => (
                <li style = {{display: 'flex', justifyContent: 'space-between'}} key={index}>

                    <div className="view_data" style={{padding: '5px'}}>
                        <p className="q-view-data"> Views: {question.views}</p>
                        <p className="q-view-data"> {question.answers.length} answers</p>
                    </div>

                    <div style={{padding: '5px', textAlign: 'center'}} className="view_heading">
                        <h3 onClick = {() => headerClick(question._id)} className="questTit" style={{color: 'blue'}}>{question.title}</h3>
                        <ShowTags question = {question} tagsArray = {tagsArray}/>
                    </div>

                    <p className = "asker"> {question.asked_by} </p>
                    
                    <p>{calcDate(question.ask_date_time)}</p>
                    
                    

                    {/* <ShowDate question = {question}/> */}
                
                </li>
            ))}

        </ul>

    );
}
            



export default ShowSearch;