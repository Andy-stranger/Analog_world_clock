var newClock = document.querySelector(".addnewclock");
var newTimer = document.querySelector(".addnewtimer");
var newAlarm = document.querySelector(".addnewalarm");
var clearAll = document.querySelector(".clearall");
var addClockModal = document.querySelector(".addClockModalParentDiv");
var addAlarmModal = document.querySelector(".addAlarmModalParentDiv");

addIcon.onclick = function(){
    dropdownDivForAdd.classList.toggle('show');
}
window.onclick = function(e){
    if(e.target.classList.contains('modalClose')){
        addClockModal.classList.remove('show');
        addAlarmModal.classList.remove('show');
    }

    if(e.target.classList.contains('addClockSpan')){
        var zone = e.target.parentNode.parentNode.querySelector('.zoneDiv').querySelector('#timezones').value;
        var format = e.target.parentNode.parentNode.querySelector('.formatDiv').querySelector('#format').value;
        addNewClock(zone, format);
        e.target.parentNode.parentNode.parentNode.classList.remove('show');
    }

    if(e.target.classList.contains('addAlarmSpan')){
        var zone = e.target.parentNode.parentNode.querySelector('.zoneDiv').querySelector('#timezones').value;
        addNewAlarm(zone);
        e.target.parentNode.parentNode.parentNode.classList.remove('show');
    }

    if(e.target.classList.contains('addnewtimer')){
        var newContainer = new timer('Timer', optionsForTimer);
        newContainer = newContainer.createTimer();
        dropdownDivForAdd.classList.remove('show');
    }

    if(e.target.classList.contains('cancel')){
        e.target.parentNode.parentNode.parentNode.classList.remove('show');
    }

    if(e.target.classList.contains('clockOptionIcon')){
        e.target.nextSibling.classList.toggle('show');
    }
}

newClock.addEventListener('click', function(){
    addClockModal.classList.add('show');
    dropdownDivForAdd.classList.remove('show');
});

newAlarm.addEventListener('click', function(){
    addAlarmModal.classList.add('show');
    dropdownDivForAdd.classList.remove('show');
});

clearAll.addEventListener('click', function(){
    var containers = document.querySelectorAll(".container");
    containers.forEach((item)=>parent.removeChild(item));
    dropdownDivForAdd.classList.remove('show');
});