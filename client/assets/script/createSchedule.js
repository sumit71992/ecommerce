var add = document.getElementById("add");

add.addEventListener("click" ,function(){
    var form = document.getElementById("form");
    var n = document.getElementById("nosch")
    if(form.style.display == "none" && n.style.display == "block")
        form.style.display = "block",
        n.style.display = "none";
    else
        form.style.display = "none",
        n.style.display = "block";
});
var edit = document.getElementById("editSlot");
var e = document.getElementById("eform");
edit.addEventListener("click", function(){
    if(e.style.display=="none")
    e.style.display = "block";
    else
    e.style.display = "none";
});
function edit(id)
{
    var slot = document.getElementById("eform"+id);
    if(slot.style.display == "none")
        slot.style.display = "block";
    else
        slot.style.display = "none"
}
function toggleSlot(param)
{
    var slot = document.getElementById("slots-container"+param);
    if(slot.style.display == "none")
        slot.style.display = "grid";
    else
        slot.style.display = "none"
}
function toggleDiv(param)
{
    var slot = document.getElementById("edit-container"+param);
    if(slot.style.display == "none")
        slot.style.display = "flex";
    else
        slot.style.display = "none"
}

function remove(param){
    console.log(param);
    fetch("/removeSlot",
    {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({index : param}),
        redirect: "follow"
    })
    .then(function(response){ 
        if( response.redirected){
            location.href = response.url;
        }
    })
    }

    function check(){
        
        var day = document.getElementsByClassName("day");
        var inp_day=document.getElementById("days");
        var msg = document.getElementById("message");
        for(var i=0 ; i<day.length; i++){
            if(day[i].innerHTML.trim() == inp_day.value.substring(0,3))
            {
                alert("Overlapping schedules");
                return false;
            }
        }
    }