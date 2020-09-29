var hpass= document.getElementById("password-hidden");
var vpass= document.getElementById("password-visible");
var pass= document.getElementById("password");
 hpass.addEventListener("click", function(){
    hpass.style.display="none";
    vpass.style.display="block";
    pass.type="text";
 });

 vpass.addEventListener("click", function(){
    vpass.style.display="none";
    hpass.style.display="block";
    pass.type="password";
 });