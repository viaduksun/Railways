
console.log('test');
const burger = document.querySelector('.header__burger');
const navBar = document.querySelector('.nav-bar');
const headerMenue = document.querySelectorAll('.header__link');

burger.addEventListener('click', function() {  
  console.log('click');     
  navBar.classList.toggle('toggle');  
  document.body.classList.toggle('lock');  
});

headerMenue.forEach(function(item) {  
  item.addEventListener('click', function(){
    active();
    item.classList.toggle('header__link--active');
  })    
  }  
)
function active() {
  headerMenue.forEach(function(item) {
    item.classList.remove('header__link--active');
  })    
}
const Offset = 150;
const fixTop = document.querySelector('.fixed-top');
window.addEventListener('scroll', function() {    
    if (pageYOffset > Offset) {
      fixTop.classList.add('min')} 
        else if (pageYOffset < Offset) {
          fixTop.classList.remove('min')
        }
    }
  );