import '../stylesheets/App.css';

function showDateAnswer({answer}) {

    var currentT = new Date()
    var currentTime = new Date(currentT.toISOString());
    
    var timeDifference = currentTime - answer.ans_date_time;
    var timeDifferenceMinutes = timeDifference / (1000 * 60);
    var timeDifferenceHours = timeDifference / (1000 * 60 * 60);
    var timeDifferenceYears = timeDifference / (1000 * 60 * 60 * 24 * 365.25);

    if (timeDifferenceMinutes < 1) {

        return (

            <div className = "view_time" style = {{padding: '5px'}}>
                <p className = "asker"> {answer.asked_by} </p>
                <p> asked {Math.floor(timeDifference/(1000))} seconds ago</p>
            </div>

        );

    } else if (timeDifferenceMinutes < 60) {

        return (

            <div className = "vew_time" style = {{padding: '5px'}}>

                <p className = "asker"> {answer.asked_by} </p>
                <p> asked {Math.floor(timeDifferenceMinutes)} minutes ago</p>

            </div>

        );
        
    } else if ((timeDifferenceMinutes >= 60) && (timeDifferenceHours < 24)) {

        return (

            <div className = "view_time" style = {{padding: '5px'}}>
                <p className = "asker"> {answer.asked_by} </p>
                <p> asked {Math.floor(timeDifference/(1000 * 60 * 60))} hours ago</p>
            </div>

        );

    } else if ((timeDifferenceHours >= 24) && (timeDifferenceYears < 1)) {

        var monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

          var dayHours = 0;

          if (answer.ans_date_time.getHours() > 12) {
              dayHours = answer.ans_date_time.getHours() - 12;
          } else {
              dayHours = answer.ans_date_time.getHours();
          }

        
        if (answer.ans_date_time.getMinutes() < 10) {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p class = "asker"> {answer.asked_by} </p>
                    <p> asked on {monthNames[answer.ans_date_time.getMonth()]} {answer.ans_date_time.getDay()} at {dayHours}:0{answer.ans_date_time.getMinutes()}</p>

                </div>

            );


        } else {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p className = "asker"> {answer.asked_by} </p>
                    <p> asked on {monthNames[answer.ans_date_time.getMonth()]} {answer.ans_date_time.getDay()} at {dayHours}:{answer.ans_date_time.getMinutes()}</p>
                    
                </div>

            );

        }

    } else if (timeDifferenceYears > 1) {

        monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

        dayHours = 0;

          if (answer.ans_date_time.getHours() > 12) {
              dayHours = answer.ans_date_time.getHours() - 12;
          } else {
              dayHours = answer.ans_date_time.getHours();
          }

        
        if (answer.ans_date_time.getMinutes() < 10) {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p className = "asker"> {answer.ans_by} </p>
                    <p> asked on {monthNames[answer.ans_date_time.getMonth()]} {answer.ans_date_time.getDay()}, {answer.ans_date_time.getFullYear()} at {dayHours}:0{answer.ans_date_time.getMinutes()}</p>
                
                </div>

            );

        } else {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p className = "asker"> {answer.asked_by} </p>
                    <p> asked on {monthNames[answer.ans_date_time.getMonth()]} {answer.ans_date_time.getDay()}, {answer.ans_date_time.getFullYear()} at {dayHours}:{answer.ans_date_time.getMinutes()}</p>

                </div>

            );


        }

    }
}

export default showDateAnswer;