//FN LOOKUP
  function lookup() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchbar");
    filter = input.value.toUpperCase();
    ul = document.getElementById("roles");
    li = ul.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
//FN DISPLAYBLOCK
  function displayblock(element_id) {
    document.getElementById(`${element_id}_hidden`).style.display = "block";
  }
//FN DISPLAYNONE
  function displaynone(element_id) {
    document.getElementById(`${element_id}_hidden`).style.display = "none";
  }
//OVERFLOW CONTROL
  if(document.getElementById("allowedroles").innerHTML === "\n                    No roles have been configured for this command!\n                  " || document.getElementById("allowedroles").childElementCount <= 4) document.querySelector("body").style.overflow = "hidden";
//POST FUNC
  async function post(element_id, action) {
    if(action === "add" && element_id.includes("rolebtn") || action === "remove" && element_id.includes("allowedrolebtn")) {
      const arolebtn = element_id.split("-")[0];
      const cmdpath = window.location.pathname.replace("/", "");
      const cmd = element_id.split("-")[1].split("_")[0];
      const roleid = element_id.split("_")[1].split("*")[0];
      const userid = element_id.split("*")[1];

      if(cmdpath === cmd) {
        await fetch(`//${window.location.host}/${action}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: userid,
            cmd: cmdpath,
            action: action,
            roleid: roleid
          })
        }).then(res => { return res.json(); })
        .then(data => {
          return window.location.href = data.redirect;
        }).catch(err => {
          console.error(err);
          return window.location.href = `${window.location.href.split("?success=")[0]}?success=fail`;
        });
      }
    }
  }
//POPUPS
  const search = window.location.search;
  const success = document.getElementById("success");
  const successdiv = document.getElementById("successdiv");
  const successtitle = document.getElementById("successtitle");
  const successdesc = document.getElementById("successdesc");

  if(search.includes("?success=")) {
    switch(true) {
      case search.includes("?success=add"): 
        {
          success.classList.add("slideIn");
          successtitle.innerHTML = `✅ Add`;
          successdesc.innerHTML = `The role was successfully added to the config!`;
          slOut();
          break;
        }
      case search.includes("?success=remove"):
        {
          success.classList.add("slideIn");
          successtitle.innerHTML = `✅ Remove`;
          successdesc.innerHTML = `The role was successfully removed from the config!`;
          slOut();
          break;
        }
      case search.includes("?success=fail"):
        {
          success.classList.add("slideIn");
          successdiv.setAttribute("class", "alert alert-dismissible alert-danger");
          successtitle.innerHTML = `❌ Request Error`;
          successdesc.innerHTML = `Error: The POST request to the config has failed!`;
          slOut();
          break;
        }
      case search.includes("?success=error"):
        {
          success.classList.add("slideIn");
          successdiv.setAttribute("class", "alert alert-dismissible alert-danger");
          successtitle.innerHTML = `❌ WS Connection Error`;
          successdesc.innerHTML = `WebSocket Connection Error: I couldn't reach the config!`;
          slOut();
          break;
        }
      default:
        //none
        break;
    }
  } else {
    success.setAttribute("style", "display: none;");
    successdiv.setAttribute("style", "display: none;");
  }
  function slOut() {
    setTimeout(() => {
      success.classList.remove("slideIn");
      success.classList.add("slideOut");
    }, 5000);
  }