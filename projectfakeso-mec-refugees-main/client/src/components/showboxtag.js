import '../stylesheets/App.css';
import axios from "axios";
import React, { useEffect, useState } from 'react';

function ShowTagsBox({somelist, newQuestion, setTClick, setTEdit, setTTag, ptagClick, updateTBool, updateTSearch, updateTags}) {
  
   const [dataBool, setDataBool] = useState(false)
   const [tagsArray, setTags] = useState(null)
   var tagsRes = null;

   //GET ALL THE TAGS
  const getTags = async() => {
    try{
      tagsRes = await axios.get('http://localhost:8000/tags')
      setTags(tagsRes.data);

     // console.log("This is the tag data below");
      console.log('tags data', tagsRes.data)

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    // console.log('this is databool', dataBool)
     if(!dataBool){
       getTags();
 
       setDataBool(true)
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dataBool])

    var hashMap = new Map ();
    newQuestion.forEach(question => {

        question.tags.forEach(tagId => {

            if(!hashMap.has(tagId)){ //if map doesnt contains the tagid
                hashMap.set(tagId, 1); //set its value to 1
            }
            else{ //if map does contain the tagId already
                hashMap.set(tagId, hashMap.get(tagId) + 1); //just increment its value by 1
            }
        
        })
    })

    var singleTags = [];

    var occurrence = 0;

    if(tagsArray!= null){
        for (let i = 0; i < tagsArray.length; i++) {


        for (let j = 0; j < newQuestion.length; j++) {

            for (let k = 0; k < newQuestion[j].tags.length; k++) {

                console.log("These are the tags for each question", newQuestion[j].tags[k]);

                if (newQuestion[j].tags[k] == tagsArray[i]._id) {
                    console.log("do the ever match");
                    occurrence += 1;
                }

            }

        }

        console.log("This is the occurence", occurrence);

        if (occurrence == 1) {
            console.log("Yes this is happening");
            singleTags.push(tagsArray[i]);
            occurrence = 0;
        } else {
            occurrence = 0;
        }

    }
    }

    console.log("This is some list:", somelist);
    console.log("This is the singleList:", singleTags);


    // console.log(hashMap)

    function HClick(tag) {
        
        updateTBool(true);
        updateTSearch('[' + tag.name + ']');
        updateTags(false);
        console.log("the tag header has been clicked");
        
    }

    function editClick(tag) {
        console.log("edit button has been clicked");
        setTTag(tag);
        setTEdit(true);
    }

    async function deleteTag(tag){
        try{
            const ansTagRes = await axios.delete(`http://localhost:8000/deleteTag/${tag}`)
        //     setTEdit(false)
        //    setTClick(false)
             updateTags(true);
             setTClick(false)
             setDataBool(false)
        //     updateWelcome(false)
          //  updateTBool(false);
            //updateTSearch(false)
            
        }catch(error){
            console.log(error)
        }
    }

    if(tagsArray != null){
        return (

            <>
            
                {ptagClick ? (
    
                    <div className="tags-box">
                        <ul className="tags-list">
                            {somelist.map((tag, index) => (
                            <li key={index}>
    
                                <h3 className="ansTit" style={{ color: 'rgb(35, 144, 246)', textDecoration: 'underline', cursor: 'pointer' }} onClick =  {() => HClick(tag)}>
                                {tag.name}
                                </h3>
    
                                <p> {hashMap.get(tag._id)} questions</p>
    
                                {singleTags.some((singleTag) => singleTag._id === tag._id) && (
                                    <>
                                    <button className="tag_edit" onClick={() => editClick(tag)}>
                                    Edit
                                    </button>
    
                                    <button className="tag_del" onClick={() => deleteTag(tag._id)}>
                                    Delete
                                    </button>
                                    </>
                                )}
    
                                {/* <button className='tag_edit' onClick={()=>editClick(tag)}>Edit Tag</button>  */}
    
                            </li>
                        ))}
                        </ul>
                    </div>
    
                ) : (
    
                    <div className="tags-box">
                        <ul className="tags-list">
                            {tagsArray.map((tag, index) => (
                            <li key={index}>
    
                                <h3 className="ansTit" style={{ color: 'rgb(35, 144, 246)', textDecoration: 'underline', cursor: 'pointer' }} onClick =  {() => HClick(tag)}>
                                {tag.name}
                                </h3>
    
                                <p> {hashMap.get(tag._id)} questions</p> 
    
                            </li>
                        ))}
                        </ul>
                    </div>
    
                )}
            
            </>
            
    
    
        );
    
    }
}

export default ShowTagsBox;