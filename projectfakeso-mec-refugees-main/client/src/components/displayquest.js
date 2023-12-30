
import '../stylesheets/App.css';
import ShowTags from './displaytags.js';


function showQuestions({somelist, tagsArray, setpClickBool, headerClick, questionPageNum, upvoteClick, downvoteClick}) {

    //made this things default behavior to be that of the newest button, since we want to press that on default anyway
    somelist.sort(function (a, b) {
        const dateA = new Date(a.ask_date_time);
        const dateB = new Date(b.ask_date_time);

        return dateB - dateA;
    });

    
    let grabStart = questionPageNum * 5;

    let grabEnd = grabStart + 5;

    const five_list = somelist.slice(grabStart, grabEnd);

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
    
  
    return (
        
        <ul className = "questDisplay">

            {five_list.map((question, index) => (
                <li style = {{display: 'flex', justifyContent: 'space-between'}} key={index}>

                    <div className="view_data" style={{padding: '5px'}}>
                        <p className="q-view-data"> Views: {question.views}</p>

                        <p className="q-view-data"> 
                      
                        <button className="votesContainer" onClick = {() => upvoteClick(question._id)} >upvote</button>
                         {question.upvotes} upvotes
                        <button className="votesContainer" onClick = {() => downvoteClick(question._id)}>downvote</button>
                 
                        </p>

                        <p className="q-view-data"> {question.answers.length} answers</p>
                    </div>

                    <div style={{padding: '5px', paddingLeft: '30px', textAlign: 'center'}} className="view_heading">

                        <h3 onClick = {() => headerClick(question._id)} className="questTit" style={{color: 'blue'}}>{question.title}</h3>

                        <p className="q-view-data">
                            {question.summary}
                        </p>

                        <br/>

                        <ShowTags question = {question} tagsArray={tagsArray}/>
                    </div>

                    {/* <ShowDate question = {question}/> */}

                    <div className = "view_time" style = {{padding: '20px', marginLeft: '70px'}}>

                {/* <button onClick = {() => setpClickBool(true)}><p className = "asker"> {question.asked_by} </p></button> */}

                <p className = "asker"> {question.asked_by} </p>
                
                

                <p>{calcDate(question.ask_date_time)}</p>

                </div>
                
                </li>
            ))}

        </ul>

    );

}

export default showQuestions;