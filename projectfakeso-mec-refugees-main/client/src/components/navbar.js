export default function Navbar({updateForm, setqAns, setTClick, setpClickBool, isLoggedIn, updateTags, updateDetail, showSearchRes, updateTBool}) {


  function showQuests (){
    updateForm(false);
    setTClick(false);
    updateTags(false);
    updateDetail(false);
    updateTBool(false);
    showSearchRes(false);
    setqAns(false);
    console.log("This is updateForm after the nav func:" + false);
  }

  function showNewTags (){
    updateForm(false);
    setTClick(false);
    updateTags(true);
    showSearchRes(false);
    setqAns(false);
  }

  return (

    <div className="menu">
    <nav className="menu-nav">
      <a href= "#/" className="question-nav" onClick={showQuests}>Questions</a>
      <a href = "#/" className= "tag-nav" onClick={showNewTags}>Tags</a>
      
      {isLoggedIn ? (
      <>
      <a href = "#/" className = "tag-nav" onClick = {() => setpClickBool(true)}>Profile</a>
      </> 
      ) : null}
    </nav>


{/* the reason that this is not working the second time around is because we are trying to set the original questionbox
to invisible when it already is invisble */}

{/* we shouldn't return our own questionBox, rather rerender the already existent one */}
</div>
  )
    
  

}