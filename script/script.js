'use strict';

let whole_amount_of_cards,
    card_counter,
    match_cards = [],
    start_date,
    timerId,
    result_time = {},
    theme;

class Card {
    constructor(i, img, element) {
        this.img = img;
        this.i = i;
        this.element = element;
        this.element.addEventListener('click', () => flip(this));
        this.isShown = false;
    }
}

function flip(obj) {
    if (!obj.isShown) {
        obj.element.className = 'flipped' + ' ' + obj.i;
        obj.isShown = true;
        setTimeout(() => match(obj), 1000);
    }
}

function show_records(){ 
	let str="Record table:\n\n";
	let records = Object.keys(window.localStorage);
	// for (var i=0; i < records.length; i++) 
	// 	str+= (i+1) + ") " + records[i]+ " - " + localStorage.getItem(records[i])+" sec." + '\n'; 
    var dict = new Array();
    var keys = Object.keys(localStorage);
    for(var key in keys) {
    dict[localStorage.getItem(keys[key])] = keys[key];
    }
    dict = sortOnKeys(dict);

    var i = 1;
    for(var key in dict) {
        str += i + ") " + dict[key] + " - " + key +" sec." + '\n';
        i++;
    }
	alert(str);
}

function clear_records(){
    alert("Done");
    window.localStorage.clear();
}

function match(obj) {
    if ((match_cards[0] === undefined) && (match_cards[1] === undefined)) {    // if no card is open
        match_cards[0] = obj;
    } else {    // if one card is open
        match_cards[1] = obj;
        if (match_cards[0].i === match_cards[1].i) {  // if the cards coincided
            match_cards[0].element.className = 'unflipped coincided' + ' ' + match_cards[0].i;
            match_cards[1].element.className = 'unflipped coincided ' + ' ' + match_cards[1].i;
            card_counter -= 2;
            if (card_counter == 0) {
                setTimeout(gameOver(), 3000);
            }
        } else {
            match_cards[0].element.className = 'unflipped' + ' ' + match_cards[0].i;
            match_cards[1].element.className = 'unflipped' + ' ' + match_cards[1].i;
        }
        match_cards[0].isShown = false;
        match_cards[1].isShown = false;
        match_cards[0] = undefined;
        match_cards[1] = undefined;
    }
}

function compareRandom(a, b) {
    return Math.random() - 0.5;  // [-0.5 ... 0.5)
}

function randomArr(length) {
    let arr = [];
    for (let i = 1; i <= (length / 2); i++) {
        arr.push(i);
        arr.push(i);
    }
    arr.sort(compareRandom);
    return arr;
}

function updateTime() {
    let clock = document.getElementById('clock_div');
    let date = new Date();
    let minutes = date.getMinutes() - start_date.getMinutes();
    if (date.getMinutes() < start_date.getMinutes()) {
        minutes += 60;
    }
    let seconds = date.getSeconds() - start_date.getSeconds();
    if (date.getSeconds() < start_date.getSeconds()) {
        seconds += 60;
        minutes -= 1;
    }
    if (minutes < 10) { minutes = '0' + minutes; }
    clock.children[0].innerHTML = minutes;
    if (seconds < 10) { seconds = '0' + seconds; }
    clock.children[2].innerHTML = seconds;
}

function clockStart() {
    timerId = setInterval(updateTime, 1000);
    updateTime();
}

function clockStop() {
    clearInterval(timerId);
    timerId = null;
}

function validate() {
    let elems = document.forms.init.elements;
    if (!elems.firstname.value) { elems.firstname.className = 'error'; }
    else { elems.firstname.className = ''; }
    if (!elems.lastname.value) { elems.lastname.className = 'error'; }
    else { elems.lastname.className = ''; }
    if (!elems.email.value) { elems.email.className = 'error'; }
    else { elems.email.className = ''; }
    
    let rad = document.getElementsByName('theme');
    for (var i = 0; i < rad.length; i++) {
        if (rad[i].checked) {
            theme = rad[i].value;
        }
    }
    rad = document.getElementsByName('difficulty');
    for (var i = 0; i < rad.length; i++) {
        if (rad[i].checked) {
            whole_amount_of_cards = Number(rad[i].value);
        }
    }

    if (elems.firstname.value && elems.lastname.value && elems.email.value) {        
        //window.localStorage.setItem(elems.firstname.value + " " + elems.lastname.value + " " + elems.email.value, "no result");
        document.querySelector('.wrapper').style.display = 'block';
        newField();
    }
}


function newField() {
    document.getElementById('field').innerHTML = '';
    card_counter = whole_amount_of_cards;
    document.getElementById('start').style.display = 'none';
    let arr_of_cards = randomArr(whole_amount_of_cards);
    for (let i = 0; i <= (whole_amount_of_cards - 1); i++) {
        let div = document.createElement('div');
        div.className = String(arr_of_cards[i]);
        div.innerHTML = '<img src="images/' + theme + '/' + (arr_of_cards[i]) + '.jpg" alt=":(" width="100%">';
        document.getElementById('field').appendChild(div);
        let card = new Card(arr_of_cards[i], div.innerHTML, div);
    }
    start_date = new Date();
    clockStart();
}


function gameOver() {
    let elems = document.forms.init.elements;
    clockStop();
    result_time.min = document.querySelector('.minutes').innerHTML;
    result_time.sec = document.querySelector('.seconds').innerHTML;
    document.querySelector('.wrapper').style.display = 'none';
    document.querySelector('.result').style.display = 'block';
    window.localStorage.setItem(elems.firstname.value + " " + elems.lastname.value + " " + elems.email.value, result_time.min + ":" + result_time.sec);
    
    document.querySelector('.result').innerHTML = elems.firstname.value + ", your result is " + result_time.min + ":" + result_time.sec;
    document.getElementById('start').style.display = 'block';   
}



function sortOnKeys(dict) {
    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}

//console.log("asas");


