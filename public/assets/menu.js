var flag = false;
function toggleMenu(){
    if(flag == false){
        document.getElementById('h-m-m').style.transform="translateX(0px)";
        flag = true;
    }else{
        document.getElementById('h-m-m').style.transform="translateX(100vw)";
        flag = false;
    }
}


function playVideo(){
    window.scrollTo(0, 520);
}


function sellPop(){
document.getElementById("p-s-c").style.display = 'block';}
