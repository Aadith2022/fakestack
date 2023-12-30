
import '../stylesheets/App.css';

function showTags({question, tagsArray}) {
    
    var pList = [];

    for (let j = 0; j < question.tags.length; j++) {

        for (let j2 = 0; j2 < tagsArray.length; j2++) {
            
            if (question.tags[j] === tagsArray[j2]._id) {
               // console.log('am i making in if statement')

               
                pList.push(

                    <p key = {j} style = {{ display: 'inline-block', padding: '5px', margin: '3px', marginLeft: '3px', marginRight: '3px', backgroundColor: '#585858', color: 'white', borderRadius: '3px', border: '1px solid black' }}>

                        {tagsArray[j2].name}

                    </p>

                )

            };

        }

    }

    return pList;

}

export default showTags;