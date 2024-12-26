var addDiv = createDivisionObject(['addClockParentDiv']);
addDiv = callCreateElement(addDiv);
var addIconDiv = createDivisionObject(['addClock']);
addIconDiv = callCreateElement(addIconDiv);
var addIcon = new element('i', ['fa', 'fa-plus', 'addIcon'], '', ['title'], ['Add'])
addIcon = addIcon.createElement();
appendElements(addIconDiv, [addIcon]);
var dropdownDivForAdd = createDivisionObject(['dropdownForAdd']);
dropdownDivForAdd = callCreateElement(dropdownDivForAdd);
optionsForAdd.forEach(function(option){
    var link = new element('a', [`${option.replace(/\s+/g, '').toLowerCase()}`], option, ['href'], ['#']);
    link = link.createElement();
    appendElements(dropdownDivForAdd, [link]);
});
appendElements(addDiv, [addIconDiv, dropdownDivForAdd]);
appendElements(document.body, [addDiv]);
var addClockFormElement = new addForm();
appendElements(document.body, [addClockFormElement.createClockModal()]);
var addAlarmFormElement = new addForm();
appendElements(document.body, [addAlarmFormElement.createAlarmModal()]);