const hamDiv = document.createElement('div');
hamDiv.id='hamburgerDiv';
const hamBtn = document.createElement('button');
hamBtn.id='hamburgerBtn';
hamBtn.textContent= "☰";
hamDiv.appendChild(hamBtn);

document.getElementById('titleBanner').before(hamDiv);


hamBtn.addEventListener('click',(e)=>{
    const sidebar=document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    e.target.classList.toggle('active');
});
