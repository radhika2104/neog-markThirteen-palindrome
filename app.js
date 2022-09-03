var showBtn = document.querySelector('#btn-show');
var birthdate = document.querySelector('#birthdate');
var messageArea = document.querySelector('#message');
var giffy = document.querySelector('.gif-container');
// Hide gif for timer
giffy.style.display = 'none';

function splitStringAndCreateObject(datestr){

    // split format '2022-08-04' to ['2022','08,'04']
    var datearray = datestr.split('-')
    // make a date object to use to convert all dateformats
    var bdate = {day: datearray[2],
                month: datearray[1],
                year: datearray[0]}
    return bdate
}

function convertToStringFormat(datestr) {
    // If a valid date has been received, derive dateformats array in string form ['mmddyyyy','ddmmyy'....]
    var bdate = splitStringAndCreateObject(datestr)
    
    var mmddyyyy = bdate.month + bdate.day + bdate.year
    var ddmmyyyy = bdate.day + bdate.month + bdate.year
    var yyyymmdd = bdate.year + bdate.month + bdate.day
    var mmddyy = bdate.month + bdate.day + bdate.year.slice(2,5)
    var ddmmyy = bdate.day + bdate.month + bdate.year.slice(2,5)
    var yymmdd = bdate.year.slice(2,5) + bdate.month + bdate.day
    var dateformatArray = [mmddyyyy, ddmmyyyy, yyyymmdd, mmddyy, ddmmyy,yymmdd]
    return dateformatArray
    
}

function checkPalindrome(dateformatArray){
    for (var i = 0; i < dateformatArray.length; i++)
    {
        // splits strings into characters, reverses the array of characters and joins them into string
        // Notice different syntax of .split and .join from python 
        var reversedDateStr = dateformatArray[i].split("").reverse().join("")
        if (dateformatArray[i] === reversedDateStr){
            return true;
        }
    }
    // None of the formats is a palindrome when for loop completes, return false
    return false;
}


function checkLeapYear(year) {
    // Determine whether the year is leap year or not - markOne-bonus
    year = Number(year)
    if (year % 4 !== 0) {
        boolyear = false;
    } else {
        if (year % 100 !== 0) {
            boolyear = true;
        } else {
            if (year % 400 !== 0) {
                boolyear = false;
            }
            else {
                boolyear = true;
            }
        }
    }
    return boolyear
}
var daysCalendar = [31,28,31,30,31,30,31,31,30,31,30,31]
var leapdaysCalendar = [31,29,31,30,31,30,31,31,30,31,30,31]

function processCalendar(datestr) {
    var currentDate = splitStringAndCreateObject(datestr);
    var isleapYear = checkLeapYear(currentDate.year);
    if (isleapYear === false) {
        var calendar = daysCalendar;
    } else {
        calendar = leapdaysCalendar;
    }
    return [calendar,currentDate]
}

function convertCalendartoString(year,month,day) {
    if (day < 10){
        day = '0' + day.toString()
    }
    if (month < 10){
        month = '0' + month.toString()
    }
    return ([year.toString(), month, day]).join('-')

}


function getNextDate(datestr) {
    var [calendar,currentDate] = processCalendar(datestr)
    var day = Number(currentDate.day) + 1
    var month = Number(currentDate.month)
    var year = Number(currentDate.year)
    if (day === 32 && month === 12){
        // December case where year increments
        day = 1;
        month = 1;
        year = year + 1;
    } else if (!(day <= calendar[month - 1])){
        // month increments
        day = 1;
        month = month + 1;
    }
    nextDateStr = convertCalendartoString(year, month, day)
    return nextDateStr
}


function getPreviousDate(datestr) {
    var [calendar,currentDate] = processCalendar(datestr)
    var day = Number(currentDate.day) - 1
    var month = Number(currentDate.month)
    var year = Number(currentDate.year)

    if (day === 0 && month !== 1) {
        // month decrements
        month = month - 1;
        // Indexes are 0,1,2,...11 and Months are 1,2,3,...12
        day = calendar[month - 1]
    }
    else if (day === 0 && month === 1){
        // January case where year decrements
        month = 12;
        day = 31;
        year = year - 1;
    }
    
    var previousDateStr = convertCalendartoString(year, month, day)
    return previousDateStr
}

function changeToDisplayFormat(datestr) {
    var day = datestr.slice(6,8)
    var month = datestr.slice(4,6)
    var year = datestr.slice(0,4)
    return ([day,month,year]).join('-')
}


function findNearestPalindrome(datestr) {
    // Find no.of days missed - next or previous
    var missedDays = 0
    while (true) {
        // Check Palindromes until you get a previous or a next date which is a palindrome
        missedDays++; 
        // Fetch previous or next date strings
        if (!(previousDateStr)){
            var previousDateStr = getPreviousDate(datestr);
        } else {
            previousDateStr = getPreviousDate(previousDateStr);
        }
        // If next date is not defined, that means this is first loop, so enter original date string
        if (!(nextDateStr)){
            var nextDateStr = getNextDate(datestr);
        } else {
            // Otherwise, enter date used in previous loop
            nextDateStr = getNextDate(nextDateStr);
        }
        
        var daycount = missedDays > 1 ? "days":"day"
        // if any previous date format is a palindrome, show message and exit loop
        var previousdateformatArray = convertToStringFormat(previousDateStr)
        
        var previousDayPalindrome = checkPalindrome(previousdateformatArray)
        
        if (previousDayPalindrome) {
            //  [missedDays, previousdateformatArray[2]]
            var previousdob = changeToDisplayFormat(previousdateformatArray[2]);
            messageArea.innerText = `The nearest palindrome day is ${previousdob}. You missed it by ${missedDays} ${daycount}.`
            return 
        } else {
            // if any next date format is a palindrome, show message and exit loop
            var nextdateformatArray = convertToStringFormat(nextDateStr)
            
            var nextDayPalindrome = checkPalindrome(nextdateformatArray)
            if (nextDayPalindrome){
                var nextdob = changeToDisplayFormat(nextdateformatArray[2]);
                //  [missedDays, nextdateformatArray[2]]
                messageArea.innerText = `The nearest palindrome day is ${nextdob}. You missed it by ${missedDays} ${daycount}.`
                return 
            }
        }
        // continue loop if none of them is palindrome

    }
}

function clickHandler() {
    // Use datestring to convert to all dateformats we want to check for palindrome
    giffy.style.display = 'block';
    messageArea.style.display = 'none';
    var datestr = birthdate.value
    
    if (datestr.length === 0) {
        // No date entered by user
        messageArea.innerText = 'Please enter a date to check for palindrome!'
        giffy.style.display = 'none';
        messageArea.style.display = 'block';
    }
    else{
        var dateformatArray = convertToStringFormat(datestr)
        var isPalindrome = checkPalindrome(dateformatArray)
        setTimeout(function() {
            if (isPalindrome) {
            messageArea.innerText = 'Yaye! Your birthday is a palindrome!'
            return true;
            } 
            else {
                // find Nearest Palindrome -from previous or next dates
                findNearestPalindrome(datestr);
            }
            giffy.style.display = 'none';
            messageArea.style.display = 'block';
        }, 3000);
    }
    
}

showBtn.addEventListener('click',clickHandler)