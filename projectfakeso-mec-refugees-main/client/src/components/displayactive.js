import '../stylesheets/App.css';
import ShowTags from './displaytags.js';

function showActive({somelist, tagsArray, answersArray, headerClick, questionPageNum, increment_unnum, unanswered_num}) {
    
    const answeredQuestions = somelist.filter((thisQuestion) => thisQuestion.answers.length !== 0);
    const unansweredQuestions = somelist.filter((thisQuestion) => thisQuestion.answers.length === 0);

    console.log('This is the unanswered questions list');
    console.log(unansweredQuestions);

    const latestAnswers = [];

    for (let k = 0; k < answeredQuestions.length; k++) {

        //gets the last, most latest ansId within this questions ansids
        var this_latest = answeredQuestions[k].answers[answeredQuestions[k].answers.length - 1];

        console.log('this is the latestans');
        console.log(this_latest);

        for (let z = 0; z < answersArray.length; z++) {

            if (answersArray[z]._id === this_latest) {
                latestAnswers.push(answersArray[z]);
                break;
            }

        }

    }

    console.log("These are the latest answers");
    console.log(latestAnswers);

    //now we sort by descending date
    const sortedlatest = latestAnswers.sort(function(a, b) {
        const dateA = new Date(a.ans_date_time);
        const dateB = new Date(b.ans_date_time);
        return dateB - dateA;
    })


    console.log("This is sortedlatest");
    console.log(sortedlatest);

    const sortedQuestions = [];

    for (let j = 0; j < sortedlatest.length; j++) {

        for (let j2 = 0; j2 < answeredQuestions.length; j2++) {

            if (answeredQuestions[j2].answers.includes(sortedlatest[j]._id)) {
                sortedQuestions.push(answeredQuestions[j2]);
                console.log(answeredQuestions[j2]);
                break;
            }

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

    // console.log("These are the sorted questions");
    // console.log(sortedQuestions);

    const sortedUnanswered = unansweredQuestions.sort(function(a, b) {
        return b.ask_date_time - a.ask_date_time;
    })

    let answeredStart = questionPageNum * 5;

    let answeredEnd = answeredStart + 5;

    const five_list = sortedQuestions.slice(answeredStart, answeredEnd);

    var un_fivelist = [];

    if ((five_list.length < 5) && (unanswered_num === 0)) {
        //in this case we show the remaining as unanswered for the first time

        let unansweredStart = unanswered_num;

        let unansweredEnd = 5 - five_list.length;

        un_fivelist = sortedUnanswered.slice(unansweredStart, unansweredEnd);

        increment_unnum(unansweredStart - unansweredEnd);

    } else if (unanswered_num > 0) {

        let unansweredStart = unanswered_num;

        let unansweredEnd = unansweredStart + 5;

        un_fivelist = sortedUnanswered.slice(unansweredStart, unansweredEnd);

        increment_unnum(5);

    }


    if (unansweredQuestions.length !== 0) {

        return (
            
            <ul className = "questDisplay">

                {five_list.map((question, index) => (
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

                {un_fivelist.map((question, index) => (
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

    } else {

        return (
            
            <ul className = "questDisplay">

                {five_list.map((question, index) => (
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

}

export default showActive;