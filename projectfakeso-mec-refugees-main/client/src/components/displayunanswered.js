
import '../stylesheets/App.css';
import ShowTags from './displaytags.js';

function showUnanswered({somelist, tagsArray, headerClick, questionPageNum}) {

    const newList = somelist.filter((thisQuestion) => thisQuestion.answers.length === 0);

    let grabStart = questionPageNum * 5;

    let grabEnd = grabStart + 5;

    const five_list = newList.slice(grabStart, grabEnd);

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

export default showUnanswered;