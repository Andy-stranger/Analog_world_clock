class element{
    constructor(tag, classes, content, eventName, eventCallback){
        this.tag = tag;
        this.classes = classes;
        this.content = content;
        this.eventName = eventName;
        this.eventCallback = eventCallback;
    }

    createElement(){
        var tempElement = document.createElement(this.tag);
        tempElement.textContent = this.content;
        if(this.classes.length>0){
            this.classes.forEach(entry => tempElement.classList.add(entry));
        }
        if(this.eventName!=null && this.eventCallback!=null){
            this.eventName.forEach(function(entry, index){
                tempElement.setAttribute(entry, this.eventCallback[index]);
            }.bind(this));
        }
        return tempElement;
    }
}

function callCreateElement(elementObject){
    var newElement = new element(elementObject.tag, elementObject.classes, elementObject.content, elementObject.eventName, elementObject.eventCallback);
    newElement = newElement.createElement();
    return newElement;
}

function createDivisionObject(classes, content='', eventName=null, eventCallback=null){
    var divisionObject = {
        tag : 'div',
        classes : classes,
        content : content,
        eventName : eventName,
        eventCallback : eventCallback
    }
    return divisionObject;
}

class container{
    constructor(heading, optionsForDropdown){
        this.container;
        this.close;
        this.heading = heading;
        this.optionsForDropdown = optionsForDropdown;
    }

    setOptionsForDropdown(){
        if(this.heading=='Clock'){
            this.optionsForDropdown = optionsForClock;
        }
        else if(this.heading=='Alarm'){
            this.optionsForDropdown = optionsForAlarm;
        }
        else if(this.heading=='Timer'){
            this.optionsForDropdown = optionsForTimer;
        }
    }

    getZoneValue(){
        if(this.zone=='Asia/Kolkata'){
            return 'Zone: India';
        }
        else if(this.zone=='America/New_York'){
            return 'Zone: USA - New York';
        }
        else if(this.zone=='America/Los_Angeles'){
            return 'Zone: USA - Los Angeles'
        }
        else if(this.zone=='Europe/London'){
            return 'Zone: London';
        }
        else if(this.zone=='Asia/Tokyo'){
            return 'Zone: Japan'
        }
        else if(this.zone=='Asia/Shanghai'){
            return 'Zone: China';
        }
    }

    createDivision(){
        this.setOptionsForDropdown();
        this.container = createDivisionObject(['container']);
        this.container = callCreateElement(this.container);
        this.close = new element('i', ['fa', 'fa-trash', 'clockCloseBtn'], '', ['title'], ['Delete']);
        this.close = this.close.createElement();
        this.close.addEventListener('click', function(){parent.removeChild(this.container);}.bind(this));
        var headingDiv = createDivisionObject(['clockHeading'], this.heading);
        headingDiv = callCreateElement(headingDiv);
        var optionDiv = createDivisionObject(['clockOptionDiv']);
        optionDiv = callCreateElement(optionDiv);
        var optionIcon = new element('i', ['fa', 'fa-caret-right', 'clockOptionIcon'], '', ['title'], ['Options']);
        optionIcon = optionIcon.createElement();
        var dropDownDiv = createDivisionObject(['optionDropDownContent']);
        dropDownDiv = callCreateElement(dropDownDiv);
        this.optionsForDropdown.forEach(function(option){
            var className = option.replaceAll('/', '').toLowerCase();
            className = className.replaceAll(' ', '');
            var link = new element('a', [className], option, ['href'], ['#']);
            link = link.createElement();
            link.addEventListener('click', function(e){this.optionClickEvent(e)}.bind(this));
            appendElements(dropDownDiv, [link]);
        }.bind(this));
        var zoneDisplay = createDivisionObject(['zoneDisplay']);
        zoneDisplay = callCreateElement(zoneDisplay);
        zoneDisplay.textContent = this.getZoneValue();
        appendElements(optionDiv, [optionIcon, dropDownDiv]);
        appendElements(this.container, [optionDiv, this.close, headingDiv, zoneDisplay]);
    }

    optionClickEvent(e){
        if(e.target.classList.contains('darklightmode')){
            this.darkFlag = !(this.darkFlag);
            this.digitalDisplay == undefined ? null : this.digitalDisplay.classList.toggle('digitalTimeDivDark');
            this.timerDisplay == undefined ? null : this.timerDisplay.classList.toggle('darkTimerDisplay');
            this.alarmTimerDiv == undefined ? null : this.alarmTimerDiv.classList.toggle('darkAlarmTimerDiv');
            if(this.container.querySelector('.watch') !== undefined){
                var watch = this.container.querySelector('.watch');
                var dial = watch.querySelector('.dial');
                var lines = dial.querySelector('.lines');
                var line = lines.querySelectorAll('.line');
                var twelve = dial.querySelector('.twelve');
                var hourHand = dial.querySelector('.handWrapper').querySelector('.hours').querySelector('.current').querySelector('.hand');
                var minuteHand = dial.querySelector('.handWrapper').querySelector('.minutes').querySelector('.current').querySelector('.hand');
                var twentyFour = dial.querySelector('.twentyFour');
                lines.classList.toggle('darkLines');
                line.forEach(function(element){
                    element.classList.toggle('darkLine');
                });
                twelve.classList.toggle('darkTwelve');
                twentyFour.classList.toggle('darkTwentyFour');
                hourHand.classList.toggle('darkHand');
                minuteHand.classList.toggle('darkHand');
            }
            e.target.parentNode.classList.toggle('show');
        }
        else if(e.target.classList.contains('showhidedigitaltime')){
            this.digitalDisplay.classList.toggle('hide');
            e.target.parentNode.classList.toggle('show');
        }
        else if(e.target.classList.contains('showhideseconds')){
            if(this.container.querySelector('.watch') !== undefined){
                var watch = this.container.querySelector('.watch');
                var dial = watch.querySelector('.dial');
                var lines = dial.querySelector('.lines');
                var line = lines.querySelectorAll('.line');
                if(this.secondLinesHidden){
                    lines.classList.toggle('linesHide');
                    setTimeout(function(){
                        this.hideSecondLines(line)
                    }.bind(this), 2000);
                }
                else{
                    this.hideSecondLines(line)
                    setTimeout(function(){
                        lines.classList.toggle('linesHide');
                    }, 2000);
                }
            }
            this.secondLinesHidden = !(this.secondLinesHidden);
            e.target.parentNode.classList.toggle('show');
        }
        else if((e.target.classList.contains('showhidesecondhand')) && (this.heading=='Clock')){
            this.container.querySelector('.watch').querySelector('.dial').querySelector('.handWrapper').querySelector('.seconds').querySelector('.current').querySelector('.hand').classList.toggle('secondHandHide');
            e.target.parentNode.classList.toggle('show');
        }
    }

    hideSecondLines(line){
        line.forEach(function(element, index){
            if(element.style.opacity == '0'){
                element.style.opacity = '1';
                element.style.transition = 'opacity 0.5s ease-in-out ' + (index * 0.05) + 's';
            }
            else{
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.5s ease-in-out ' + ((line.length - index) * 0.05) + 's';
            }
        });
    }

    getTime(){
        options.timeZone = this.zone;
        options.hour12 = this.format=="24 hours" ? false : true;
        const now = new Date().toLocaleTimeString("en-US", options);
        const regexTime = /(\d{1,2}):(\d{2}):(\d{2})(\s(AM|PM))?/;
        const match = regexTime.exec(now);
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const seconds = parseInt(match[3]);
        if(this.heading=='Clock'){
            this.digitalDisplay.textContent = options.hour12 ? new Date().toLocaleString("en-US", options) : new Date().toLocaleString("en-GB", options);
        }
        return [hours, minutes, seconds];
    }
}

class clock extends container{
    constructor(heading, optionsForDropdown, zone, format){
        super(heading, optionsForDropdown);
        this.digitalDisplay;
        this.currentWeather;
        this.forecastWeather;
        this.zone = zone;
        this.format = format;
        this.weatherParentDiv;
        this.weatherDivision;
        this.weatherDropdownDiv;
        this.currentWeatherDiv;
        this.forecastWeatherDiv;
        this.parentWeatherDiv;
        this.weatherCities;
        this.darkFlag = false;
        this.secondLinesHidden = false;
    }

    appendDigitalTime(){
        this.digitalDisplay = createDivisionObject(['digitalTimeDiv']);
        this.digitalDisplay = callCreateElement(this.digitalDisplay);
        appendElements(this.container, [this.digitalDisplay]);
    }

    createClock(){
        this.createDivision();
        var watch = createDivisionObject(['watch']);
        watch = callCreateElement(watch);
        var clockFace = createDivisionObject(['clockFace']);
        clockFace = callCreateElement(clockFace);
        var dial = createDivisionObject(['dial']);
        dial = callCreateElement(dial);
        var lines = createDivisionObject(['lines']);
        lines = callCreateElement(lines);
        for(let i=0; i<30; i++){
            var line = createDivisionObject(['line']);
            line = callCreateElement(line);
            appendElements(lines, [line]);
        }
        var numberTwelve = createDivisionObject(['twelve']);
        numberTwelve = callCreateElement(numberTwelve);
        for(let i=0; i<12; i++){
            var number = createDivisionObject(['number']);
            number = callCreateElement(number);
            var span = new element('span', [], `${i+1}`, null, null);
            span = span.createElement();
            appendElements(number, [span]);
            appendElements(numberTwelve, [number]);
        }
        var numberTwentyFour = createDivisionObject(['twentyFour']);
        numberTwentyFour = callCreateElement(numberTwentyFour);
        for(let i=0; i<12; i++){
            var number = createDivisionObject(['number']);
            number = callCreateElement(number);
            var span = new element('span', [], `${i+13}`, null, null);
            span = span.createElement();
            appendElements(number, [span]);
            appendElements(numberTwentyFour, [number]);
        }
        var handWrapper = createDivisionObject(['handWrapper']);
        handWrapper = callCreateElement(handWrapper);
        var classNames = ['hours', 'minutes', 'seconds'];
        for(let i=0; i<3; i++){
            var parentHandDiv = createDivisionObject([`${classNames[i]}`]);
            parentHandDiv = callCreateElement(parentHandDiv);
            var current = createDivisionObject(['current']);
            current = callCreateElement(current);
            var hand = createDivisionObject(['hand']);
            hand = callCreateElement(hand);
            appendElements(current, [hand]);
            appendElements(parentHandDiv, [current]);
            appendElements(handWrapper, [parentHandDiv]);
        }
        appendElements(dial, [lines, numberTwelve, numberTwentyFour, handWrapper]);
        appendElements(watch, [clockFace, dial]);
        appendElements(this.container, [watch]);
        this.appendDigitalTime();
        this.appendWeatherDivision();
        appendElements(parent, [this.container]);
        this.setTime();
    }  
    
    appendWeatherDivision(){
        this.weatherParentDiv = createDivisionObject(['weatherParentDiv']);
        this.weatherParentDiv = callCreateElement(this.weatherParentDiv);
        this.weatherDivision = createDivisionObject(['weatherDivision'], 'GET WEATHER', ['title'], ['Get weather'] );
        this.weatherDivision = callCreateElement(this.weatherDivision);
        this.weatherDropdownDiv = createDivisionObject(['weatherDropDownContent']);
        this.weatherDropdownDiv = callCreateElement(this.weatherDropdownDiv);
        this.weatherCities = this.getWeatherCities();
        this.weatherCities.forEach(function(option){
            var className = option.replaceAll('/', '').toLowerCase();
            className = className.replaceAll(' ', '');
            var link = new element('a', [className], option, ['href'], ['#']);
            link = link.createElement();
            link.addEventListener('click', function(event){
                this.getWeather(event);
            }.bind(this));
            appendElements(this.weatherDropdownDiv, [link]);
        }.bind(this));
        this.weatherDivision.addEventListener('click', function(){this.weatherDropdownDiv.classList.toggle('show')}.bind(this));
        appendElements(this.weatherParentDiv, [this.weatherDivision, this.weatherDropdownDiv]);
        appendElements(this.container, [this.weatherParentDiv]);
    }

    async getWeather(event){
        this.weatherDropdownDiv.classList.remove('show');
        var city = event.target.text;
        var currentWeatherUrl = currentWeatherPath+city+apiKey+units;
        this.currentWeather = await this.fetchData(currentWeatherUrl);
        var forecastWeatherUrl = forecastWeatherPath+city+apiKey+units;
        this.forecastWeather = await this.fetchData(forecastWeatherUrl);
        this.displayWeather();
    }

    async fetchData(url){
        const response = await fetch(url);
        const jsonObject = await response.json();
        return jsonObject;
    }

    displayWeather(){
        this.weatherParentDiv.classList.toggle('hide');
        this.parentWeatherDiv = createDivisionObject(['parentWeatherDiv']);
        this.parentWeatherDiv = callCreateElement(this.parentWeatherDiv);
        var weatherHeading = new element('span', ['weatherHeading'], `City: ${this.currentWeather.name}`, ['title'], ['Change city']);
        weatherHeading = weatherHeading.createElement();
        this.currentWeatherDiv = createDivisionObject(['currentWeather']);
        this.currentWeatherDiv = callCreateElement(this.currentWeatherDiv);
        var nowSpan = new element('span', ['currentWeatherSpan'], 'Now', null, null);
        nowSpan = nowSpan.createElement();
        var currentWeatherBox = new element('div', ['currentWeatherContent'], '', null, null);
        currentWeatherBox = currentWeatherBox.createElement();
        currentWeatherBox.textContent = `${this.currentWeather.main.temp}C, ${this.currentWeather.weather[0].description}`;
        appendElements(this.currentWeatherDiv, [currentWeatherBox, nowSpan]);
        this.forecastWeatherDiv = createDivisionObject(['forecastWeather']);
        this.forecastWeatherDiv = callCreateElement(this.forecastWeatherDiv);
        var forecastSpan = new element('span', ['forecastWeatherSpan'], 'Forecast', null, null);
        forecastSpan = forecastSpan.createElement();
        var forecastWeatherBox = createDivisionObject(['forecastWeatherContent']);
        forecastWeatherBox = callCreateElement(forecastWeatherBox);
        forecastWeatherBox.innerHTML = `${this.forecastWeather.list[9].main.temp}C ${this.forecastWeather.list[9].weather[0].description}, ${new Date(Number(this.forecastWeather.list[9].dt)*1000).toDateString()}<br>
        ${this.forecastWeather.list[17].main.temp}C ${this.forecastWeather.list[17].weather[0].description}, ${new Date(Number(this.forecastWeather.list[17].dt)*1000).toDateString()}<br>
        ${this.forecastWeather.list[25].main.temp}C ${this.forecastWeather.list[25].weather[0].description}, ${new Date(Number(this.forecastWeather.list[25].dt)*1000).toDateString()}<br>
        ${this.forecastWeather.list[33].main.temp}C ${this.forecastWeather.list[33].weather[0].description}, ${new Date(Number(this.forecastWeather.list[33].dt)*1000).toDateString()}`;
        appendElements(this.forecastWeatherDiv, [forecastWeatherBox, forecastSpan]);
        appendElements(this.parentWeatherDiv, [weatherHeading, this.currentWeatherDiv, this.forecastWeatherDiv]);
        appendElements(this.container, [this.parentWeatherDiv]);
        this.updateBackground();
        weatherHeading.addEventListener('click', function(){
            this.removeWeather();
        }.bind(this));
    }

    updateBackground(){
        var classes = ['partlySunny', 'verySunny', 'partlyRainy', 'veryRainy', 'partlyCold', 'veryCold'];
        classes.forEach(function(className){
            this.container.classList.remove(className);
        }.bind(this));
        if(Number(this.currentWeather.main.temp)<-10){
            this.container.classList.add('veryCold');
            this.textToBlack();
        }
        else if(Number((this.currentWeather.main.temp)>=-10) && (this.currentWeather.main.temp)<0){
            this.container.classList.add('partlyCold');
            this.textToWhite();
        }
        else if(Number((this.currentWeather.main.temp)>=0) && (this.currentWeather.main.temp)<10){
            this.container.classList.add('veryRainy');
            this.textToBlack();
        }
        else if(Number((this.currentWeather.main.temp)>=10) && (this.currentWeather.main.temp)<20){
            this.container.classList.add('partlyRainy');
            this.textToWhite();
        }
        else if(Number((this.currentWeather.main.temp)>=20) && (this.currentWeather.main.temp)<30){
            this.container.classList.add('partlySunny');
            this.textToWhite();
        }
        else if(Number((this.currentWeather.main.temp)>=30)){
            this.container.classList.add('verySunny');
            this.textToWhite();            
        }
    }

    textToBlack(){
        this.container.querySelector('.zoneDisplay').classList.add('blackColor');
        this.container.querySelector('.parentWeatherDiv').querySelector('.weatherHeading').classList.add('blackColor');
        this.container.querySelector('.parentWeatherDiv').querySelector('.currentWeather').querySelector('.currentWeatherSpan').classList.add('blackColor');
        this.container.querySelector('.parentWeatherDiv').querySelector('.forecastWeather').querySelector('.forecastWeatherSpan').classList.add('blackColor');
        this.container.querySelector('.weatherParentDiv').querySelector('.weatherDivision').classList.add('blackColor');
    }

    textToWhite(){
        this.container.querySelector('.zoneDisplay').classList.add('whiteColor');
        this.container.querySelector('.parentWeatherDiv').querySelector('.weatherHeading').classList.add('whiteColor');
        this.container.querySelector('.parentWeatherDiv').querySelector('.currentWeather').querySelector('.currentWeatherSpan').classList.add('whiteColor');
        this.container.querySelector('.parentWeatherDiv').querySelector('.forecastWeather').querySelector('.forecastWeatherSpan').classList.add('whiteColor');
        this.container.querySelector('.weatherParentDiv').querySelector('.weatherDivision').classList.add('whiteColor');
    }

    removeWeather(){
        this.container.removeChild(this.parentWeatherDiv);
        this.weatherParentDiv.classList.toggle('hide');
    }

    getWeatherCities(){
        if(this.zone=='Asia/Kolkata'){return citiesInIndia;}
        else if(this.zone=='America/New_York'){return citiesInNewYork;}
        else if(this.zone=='America/Los_Angeles'){return citiesInLosAngeles;}
        else if(this.zone=='Europe/London'){return citiesInLondon;}
        else if(this.zone=='Asia/Tokyo'){return citiesInJapan;}
        else if(this.zone=='Asia/Shanghai'){return citiesInChina;}
    }

    setTime(){
        this.hourHand = this.container.querySelector('.watch').querySelector('.dial').querySelector('.handWrapper').querySelector('.hours').querySelector('.current');
        this.minuteHand = this.container.querySelector('.watch').querySelector('.dial').querySelector('.handWrapper').querySelector('.minutes').querySelector('.current');
        this.secondHand = this.container.querySelector('.watch').querySelector('.dial').querySelector('.handWrapper').querySelector('.seconds').querySelector('.current');
        var [hour, minute, second] = this.getTime();
        var secondsAngle = 6 * second;
        this.secondHand.style.transform = `rotate(${secondsAngle}deg)`;
        setInterval(()=>{
            var [hour, minute, second] = this.getTime();
            var hourAngle = 0.5 * ((hour * 60) + minute + ((0.5 / 60) * second));
            var minuteAngle = 0.1 * ((minute * 60) + second);
            this.hourHand.style.transform = `rotate(${hourAngle}deg)`;
            this.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        }, 1000);
    }

    setDigitalTime(){
        options.timeZone = this.zone;
        options.hour12 = this.format=="24 hours" ? false : true;
        setInterval(()=>{
            this.digitalDisplay.textContent = options.hour12 ? new Date().toLocaleString("en-US", options) : new Date().toLocaleString("en-GB", options);
        }, 1000);
    }
}

class alarm extends container{
    constructor(heading, optionsForDropdown, zone){
        super(heading, optionsForDropdown);
        this.alarmTime;
        this.newAlarm;
        this.setAlarmButton;
        this.elapsedTime = 0;
        this.zone = zone;
        this.alarmId;
        this.snoozeBtn;
        this.dismissBtn;
        this.cancelAlarmBtn;
        this.snoozeOptionsDiv;
        this.alarmCountDownDiv;
        this.alarmTimerDiv;
        this.currentAlarmHours;
        this.currentAlarmMinutes;
        this.darkFlag = false;
        this.alarmFlag = false;
    }

    createAlarm(){
        this.createDivision();
        this.newAlarm = createDivisionObject(['alarm']);
        this.newAlarm = callCreateElement(this.newAlarm);
        var defaultDiv = createDivisionObject(['defaultAlarmDiv'], "When to ring?");
        defaultDiv = callCreateElement(defaultDiv);
        this.alarmTime = new element('input', [], '', ['type', 'id'], ['datetime-local', 'alarmTime']);
        this.alarmTime = this.alarmTime.createElement();
        this.setAlarmButton = new element('span', ['setAlarmBtn'], 'SET', ['title'], ['Set alarm']);
        this.setAlarmButton = this.setAlarmButton.createElement();
        this.setAlarmButton.addEventListener('click', function(){this.setAlarm()}.bind(this));
        this.alarmCountDownDiv = createDivisionObject(['alarmCountDownDiv']);
        this.alarmCountDownDiv = callCreateElement(this.alarmCountDownDiv);
        var alarmRingingInSpan = new element('div', ['alarmRingingInSpan'], 'Next alarm ringing in', null, null);
        alarmRingingInSpan = alarmRingingInSpan.createElement();
        this.alarmTimerDiv = createDivisionObject(['alarmTimerDiv'], '00:00:00');
        this.alarmTimerDiv = callCreateElement(this.alarmTimerDiv);
        var snoozeDiv = this.createSnoozeDiv();
        appendElements(this.newAlarm, [defaultDiv, this.alarmTime, this.setAlarmButton]);
        appendElements(this.alarmCountDownDiv, [alarmRingingInSpan, this.alarmTimerDiv, snoozeDiv]);
        appendElements(this.container, [this.newAlarm, this.alarmCountDownDiv]);
        appendElements(parent, [this.container]);
    }

    createSnoozeDiv(){
        var snoozeDiv = createDivisionObject(['snoozeDiv']);
        snoozeDiv = callCreateElement(snoozeDiv);
        this.snoozeBtn = new element('span', ['snoozeBtnUnactive'], 'SNOOZE', ['title'], ['Snooze alarm']);
        this.snoozeBtn = this.snoozeBtn.createElement();
        this.snoozeOptionsDiv = createDivisionObject(['snoozeOptionsDiv']);
        this.snoozeOptionsDiv = callCreateElement(this.snoozeOptionsDiv);
        optionsForSnooze.forEach(function(option){
            var className = option.replaceAll(' ', '').toLowerCase();
            var link = new element('a', [className], option, ['href'], ['#']);
            link = link.createElement();
            link.addEventListener('click', function(e){this.snoozeAlarm(e)}.bind(this));
            appendElements(this.snoozeOptionsDiv, [link]);
        }.bind(this));
        this.snoozeBtn.addEventListener('click', function(e){this.showSnoozeOptions(e)}.bind(this));
        appendElements(this.snoozeBtn, [this.snoozeOptionsDiv]);
        this.dismissBtn = new element('span', ['dismissBtnUnactive'], 'DISMISS', ['title'], ['Dismiss alarm']);
        this.dismissBtn = this.dismissBtn.createElement();
        this.dismissBtn.addEventListener('click', function(e){this.cancelAlarm(e)}.bind(this));
        this.cancelAlarmBtn = createDivisionObject(['cancelAlarm'], 'CANCEL', ['title'], ['Cancel alarm']);
        this.cancelAlarmBtn = callCreateElement(this.cancelAlarmBtn);
        this.cancelAlarmBtn.addEventListener('click', function(e){this.cancelAlarm(e)}.bind(this));
        appendElements(snoozeDiv, [this.snoozeBtn, this.dismissBtn, this.cancelAlarmBtn]);
        return snoozeDiv;
    }

    showSnoozeOptions(e){
        if(e.target.classList.contains('snoozeBtnActive')){
            this.snoozeOptionsDiv.classList.toggle('show');
        }
    }

    setAlarm(){
        this.alarmFlag = false;
        const regex = /T(\d{2}):(\d{2})/;
        const match = this.alarmTime.value.match(regex);
        var alarmHours = match[1] % 12;
        var alarmMinutes = match[2];
        if(!(match==[] || match==null || match==undefined)){
            this.newAlarm.classList.add('hide');
            this.alarmCountDownDiv.classList.remove('hide');
            this.alarmCountDownDiv.classList.add('show');
        }
        this.ringAlarm(alarmHours, alarmMinutes);     
    }

    snoozeAlarm(e){
        var callRingAlarm = function (hours, minutes){
            alarmSound.pause();
            alarmSound.currentTime = 0;
            this.snoozeBtn.classList.remove('snoozeBtnActive');
            this.dismissBtn.classList.remove('dismissBtnActive');
            this.ringAlarm(hours, minutes);
        }.bind(this);
        var [currentHours, currentMinutes, currentSeconds] = this.getTime();
        if(e.target.classList.contains('for10minutes')){
            e.target.parentNode.classList.remove('show');
            callRingAlarm(Number(currentHours), Number(currentMinutes)+10);
        }
        else if(e.target.classList.contains('for5minutes')){
            e.target.parentNode.classList.remove('show');
            callRingAlarm(Number(currentHours), Number(currentMinutes)+5);
        }
        else if(e.target.classList.contains('for1minutes')){
            e.target.parentNode.classList.remove('show');
            callRingAlarm(Number(currentHours), Number(currentMinutes)+1);
        }
    }

    cancelAlarm(e){
        if(e.target.classList.contains('dismissBtnActive') || e.target.classList.contains('cancelAlarm')){
            clearInterval(this.alarmId);
            alarmSound.pause();
            alarmSound.currentTime = 0;
            this.alarmTimerDiv.textContent = '00:00:00';
            this.snoozeBtn.classList.remove('snoozeBtnActive');
            this.dismissBtn.classList.remove('dismissBtnActive');
            this.alarmCountDownDiv.classList.add('hide');
            this.newAlarm.classList.remove('hide');
        }
    }

    ringAlarm(alarmHours, alarmMinutes){
        this.currentAlarmHours = alarmHours;
        this.currentAlarmMinutes = alarmMinutes;
        this.alarmId = setInterval(()=>{
            var [currentHours, currentMinutes, currentSeconds] = this.getTime();
            var totalCurrentSeconds = Number(currentHours)*3600 + Number(currentMinutes)*60 + Number(currentSeconds);
            var totalAlarmSeconds = Number(this.currentAlarmHours)*3600 + Number(this.currentAlarmMinutes)*60;
            var totalDifferenceSeconds = totalAlarmSeconds - totalCurrentSeconds;
            var displayHour = Math.floor(totalDifferenceSeconds/3600);
            var displayMinute = Math.floor((totalDifferenceSeconds % 3600) / 60);
            var displaySecond = Math.floor((totalDifferenceSeconds % 3600) % 60);
            this.alarmTimerDiv.textContent = `${displayHour.toString().padStart(2, '0')}:${displayMinute.toString().padStart(2, '0')}:${displaySecond.toString().padStart(2, '0')}`;
            if(currentHours>=alarmHours && currentMinutes>=alarmMinutes){
                this.alarmFlag = true;
                alarmSound.play();
                clearInterval(this.alarmId);
                this.alarmTimerDiv.textContent = '00:00:00';
                this.snoozeBtn.classList.add('snoozeBtnActive');
                this.dismissBtn.classList.add('dismissBtnActive');
            }
        }, 1000);
    }
}

class timer extends container{
    constructor(heading, optionsForDropdown){
        super(heading, optionsForDropdown);
        this.timerDisplay;
        this.timerId;
    }

    createTimer(){
        this.createDivision();
        var newTimer = createDivisionObject(['timer']);
        newTimer = callCreateElement(newTimer);
        this.timerDisplay = createDivisionObject(['timerDisplay'], '00:00:00');
        this.timerDisplay = callCreateElement(this.timerDisplay);
        var timerBtns = createDivisionObject(['timerBtn']);
        timerBtns = callCreateElement(timerBtns);
        var startBtn = new element('span', ['timerStartBtn'], 'START', ['title'], ['Start']);
        startBtn = startBtn.createElement();
        var stopBtn = new element('span', ['timerStopBtn'], 'STOP', ['title'], ['Stop']);
        stopBtn = stopBtn.createElement();
        var resetBtn = new element('span', ['timerResetBtn'], 'RESET', ['title'], ['Reset']);
        resetBtn = resetBtn.createElement();
        startBtn.addEventListener('click', function(){this.startTimer();}.bind(this));
        stopBtn.addEventListener('click', function(){clearInterval(this.timerId);}.bind(this));
        resetBtn.addEventListener('click', function(){this.resetTimer();}.bind(this));
        appendElements(timerBtns, [startBtn, stopBtn, resetBtn])
        appendElements(newTimer, [this.timerDisplay, timerBtns]);
        appendElements(this.container, [newTimer]);
        appendElements(parent, [this.container]);
    }

    startTimer(){
        var startTime = Date.now();
        this.timerId = setInterval(()=>{
            const  currentTime = Date.now();
            this.elapsedTime = currentTime - startTime;
            const hours = Math.floor(this.elapsedTime/3600000);
            const minutes = Math.floor((this.elapsedTime % 3600000)/60000);
            const seconds = Math.floor((this.elapsedTime % 60000)/1000);
            this.timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }, 1000);
    }

    resetTimer(){
        clearInterval(this.timerId);
        this.timerDisplay.textContent = '00:00:00';
    }
}

class addForm{
    constructor(){
        this.modal;
        this.modalContent;
        this.zoneDropdown;
        this.formatDropdown;
    }

    createClockModal(){
        [this.modal, this.modalContent] = this.createModalAndContent('addClockModalParentDiv', 'addClockModalContentDiv');
        var closeIcon = this.createCloseIcon();
        var formElement = this.createClockForm();
        var buttonDiv = this.createButtons('addClockSpan');
        appendElements(this.modalContent, [closeIcon, formElement, buttonDiv]);
        appendElements(this.modal, [this.modalContent]);
        return this.modal;
    }

    createClockForm(){
        var formElement = new element('form', [], '', null, null);
        formElement = formElement.createElement();
        var zoneDiv = this.createZoneForm();
        var formatDiv = this.createFormatForm();
        appendElements(formElement, [zoneDiv, formatDiv]);
        return formElement;
    }

    createAlarmModal(){
        [this.modal, this.modalContent] = this.createModalAndContent('addAlarmModalParentDiv', 'addAlarmModalContentDiv');
        var closeIcon = this.createCloseIcon();
        var formElement = this.createAlarmForm();
        var buttonDiv = this.createButtons('addAlarmSpan');
        appendElements(this.modalContent, [closeIcon, formElement, buttonDiv]);
        appendElements(this.modal, [this.modalContent]);
        return this.modal;
    }

    createAlarmForm(){
        var formElement = new element('form', [], '', null, null);
        formElement = formElement.createElement();
        var zoneDiv = this.createZoneForm();
        appendElements(formElement, [zoneDiv]);
        return formElement;
    }

    createModalAndContent(parent, child){
        this.modal = createDivisionObject([parent]);
        this.modal = callCreateElement(this.modal);
        this.modalContent = createDivisionObject([child]);
        this.modalContent = callCreateElement(this.modalContent);
        return [this.modal, this.modalContent];
    }

    createCloseIcon(){
        var close = new element('i', ['fa', 'fa-window-close', 'modalClose'], '', ['title'], ['Close']);
        return close.createElement();
    }

    createZoneForm(){
        var labelForZone = new element('label', [], 'Choose a time Zone: ', ['for'], ['timezones'])
        labelForZone = labelForZone.createElement();
        var display = ['IST - India (New Delhi)', 'EST - USA (New York)', 'PST - USA (Los Angeles)', 'GMT - London', 'JST - Japan (Tokyo)', 'CST - China (Beijing)'];
        var values = ['Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo', 'Asia/Shanghai'];
        this.zoneDropdown = new element('select', [], '', ['name', 'id'], ['timezones', 'timezones']);
        this.zoneDropdown = this.zoneDropdown.createElement();
        display.forEach(function(entry, index){
            var option = new element('option', [], entry, ['value'], [values[index]]);
            option = option.createElement();
            appendElements(this.zoneDropdown, [option]);
        }.bind(this));
        var zoneDiv = new element('div', ['zoneDiv'], '', null, null);
        zoneDiv = zoneDiv.createElement();
        appendElements(zoneDiv, [labelForZone, this.zoneDropdown]);
        return zoneDiv;
    }

    createFormatForm(){
        var labelForFormat = new element('label', [], 'Choose a format: ', ['for'], ['format']);
        labelForFormat = labelForFormat.createElement();
        this.formatDropdown = new element('select', [], '', ['name', 'id'], ['format', 'format']);
        this.formatDropdown = this.formatDropdown.createElement();
        var values = ['12 hours', '24 hours'];
        values.forEach(function(value){
            var option = new element('option', [], value, ['value'], [value]);
            option = option.createElement();
            appendElements(this.formatDropdown, [option]);
        }.bind(this));
        var formatDiv = new element('div', ['formatDiv'], '', null, null);
        formatDiv = formatDiv.createElement();
        this.formatDropdown.style.marginLeft = '1.4rem';
        appendElements(formatDiv, [labelForFormat, this.formatDropdown]);
        return formatDiv;
    }

    createButtons(addClass){
        var buttonDiv = createDivisionObject(['buttonDiv']);
        buttonDiv = callCreateElement(buttonDiv);
        var addBtn = new element('span', [addClass], 'ADD', null, null);
        addBtn = addBtn.createElement();
        var cancelBtn = new element('span', ['cancel'], 'CANCEL', null, null);
        cancelBtn = cancelBtn.createElement();
        appendElements(buttonDiv, [addBtn, cancelBtn]);
        return buttonDiv;
    }
}

function appendElements(parentElement, childElement){
    childElement.forEach(function(entry){
        parentElement.appendChild(entry);
    });
}

function addNewClock(zone, format){
    var newContainer = new clock('Clock', optionsForClock, zone, format);
    newContainer.createClock();
}

function addNewAlarm(zone){
    var newContainer = new alarm('Alarm', optionsForAlarm, zone);
    newContainer.createAlarm();
}