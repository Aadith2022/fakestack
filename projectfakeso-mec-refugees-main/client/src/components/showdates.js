import '../stylesheets/App.css';

function showDates({question}) {

    console.log("This is the question sent in");
    console.log(question);
    
    var currentT = new Date()
    var currentTime = new Date(currentT.toISOString());
    
    var timeDifference = currentTime - question.ask_date_time;
    var timeDifferenceMinutes = timeDifference / (1000 * 60);
    var timeDifferenceHours = timeDifference / (1000 * 60 * 60);
    var timeDifferenceYears = timeDifference / (1000 * 60 * 60 * 24 * 365.25);

    console.log("This is the TM");
    console.log(timeDifference);


    console.log("TDM")
    console.log(timeDifferenceMinutes);

    if (timeDifferenceMinutes < 1) {

        return (

            <div className = "view_time" style = {{padding: '5px'}}>
                <p className = "asker"> {question.asked_by} </p>
                <p> asked {Math.floor(timeDifference/(1000))} seconds ago</p>
            </div>

        );

    } else if (timeDifferenceMinutes < 60) {

        return (

            <div className = "vew_time" style = {{padding: '5px'}}>

                <p className = "asker"> {question.asked_by} </p>
                <p> asked {Math.floor(timeDifferenceMinutes)} minutes ago</p>

            </div>

        );
        
    } else if ((timeDifferenceMinutes >= 60) && (timeDifferenceHours < 24)) {

        return (

            <div className = "view_time" style = {{padding: '5px'}}>
                <p className = "asker"> {question.asked_by} </p>
                <p> asked {Math.floor(timeDifference/(1000 * 60 * 60))} hours ago</p>
            </div>

        );

    } else if ((timeDifferenceHours >= 24) && (timeDifferenceYears < 1)) {

        var monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

          var dayHours = 0;

          if (question.ask_date_time.getHours() > 12) {
              dayHours = question.ask_date_time.getHours() - 12;
          } else {
              dayHours = question.ask_date_time.getHours();
          }

        
        if (question.ask_date_time.getMinutes() < 10) {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p class = "asker"> {question.asked_by} </p>
                    <p> asked on {monthNames[question.ask_date_time.getMonth()]} {question.ask_date_time.getDay()} at {dayHours}:0{question.ask_date_time.getMinutes()}</p>

                </div>

            );


        } else {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p className = "asker"> {question.asked_by} </p>
                    <p> asked on {monthNames[question.ask_date_time.getMonth()]} {question.ask_date_time.getDay()} at {dayHours}:{question.ask_date_time.getMinutes()}</p>
                    
                </div>

            );

        }

    } else if (timeDifferenceYears > 1) {

        monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];

        dayHours = 0;

          if (question.ask_date_time.getHours() > 12) {
              dayHours = question.ask_date_time.getHours() - 12;
          } else {
              dayHours = question.ask_date_time.getHours();
          }

        
        if (question.ask_date_time.getMinutes() < 10) {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p className = "asker"> {question.asked_by} </p>
                    <p> asked on {monthNames[question.ask_date_time.getMonth()]} {question.ask_date_time.getDay()}, {question.ask_date_time.getFullYear()} at {dayHours}:0{question.ask_date_time.getMinutes()}</p>
                
                </div>

            );

        } else {

            return (

                <div className = "view_time" style = {{padding: '5px'}}>

                    <p className = "asker"> {question.asked_by} </p>
                    <p> asked on {monthNames[question.ask_date_time.getMonth()]} {question.ask_date_time.getDay()}, {question.ask_date_time.getFullYear()} at {dayHours}:{question.ask_date_time.getMinutes()}</p>

                </div>

            );


        }

    }

}

export default showDates;