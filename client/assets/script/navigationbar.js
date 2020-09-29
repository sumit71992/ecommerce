var menu=document.getElementById('menu');
var nav=document.getElementById('nav');
var exit=document.getElementById('exit');
menu.addEventListener('click',function(links){
    nav.classList.toggle('hide-mobile');
    links.preventDefault();
});
exit.addEventListener('click',function(links){
    nav.classList.add('hide-mobile');
    links.preventDefault();
});
