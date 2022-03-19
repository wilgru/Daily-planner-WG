var timeblockList = $('#timeblock-list');
var descriptionTextArea = $(".description");
var clearScheduleBtn = $("#clear-schedule-button");

var currentHour = {}
var savedDescriptions = {};
const workHours = [
    "9:00 am",
    "10:00 am",
    "11:00 am",
    "12:00 pm",
    "1:00 pm",
    "2:00 pm",
    "3:00 pm",
    "4:00 pm",
    "5:00 pm"
];

// initial function
function init() {
    getCurrentHour(); // get the curretn our
    getLocalStorage(); // get all data in local storage
    renderTimeblock(); // render each timeblock
    renderDateAndTime(); // render todays date and time
}

// get the current hour
function getCurrentHour() {
    currentHour = moment().format("h:00 a");
}

// render thhe current date and time to the jumbotron
function renderDateAndTime() {
    $("#currentDay").text(moment().format("dddd, Do MMMM YYYY, h:mm a"))
}

// render a timeblock row for each working hour
function renderTimeblock(reset=false) {
    if (reset === true) {
        timeblockList.html("") // clear all timeblocks on page first
    }

    // go throug each work hour and render a timeblock for it
    workHours.forEach(hour => {
        // create eachh column item
        var hourCol = $('<div>')
            .addClass("col-1 hour")
            .text(hour);
        var descCol = $('<textarea>')
            .addClass("col-10 description " + getTimeStyle(hour))
            .append(savedDescriptions[hour])
        var saveCol = $('<div>')
            .addClass("col-1 saveBtn")
            .append("<img src='./images/save.png'>")

        // create the block and append each column to it then append it to the list of timeblocks
        var hourBlock = $('<div>');
        hourBlock.addClass("row time-block");
        hourBlock.append(
            hourCol,
            descCol,
            saveCol
        )
        timeblockList.append(hourBlock);
    });
}

// get the style for the time block depending on the time
function getTimeStyle(hour) {
    var hour24 = convertTo24Hour(hour) // convert the parsed hour to 24-hour time
    var currentHour24 = convertTo24Hour(currentHour) // convert the CURRENT hour to 24-hour time

    // now compare the hours to see which class to return
    if (hour24 < currentHour24) {
        return "past"
    } else if (hour24 === currentHour24) {
        return "present"
    } else if (hour24 > currentHour24) {
        return "future"
    }
}

// convert input to 24 hour time
function convertTo24Hour(hour) {
    if (hour.includes("pm") && hour.includes("12")) {
        return parseInt(hour.split(":")[0]);
    } else if (hour.includes("pm")) {
        return parseInt(hour.split(":")[0]) + 12;
    } else {
        return parseInt(hour.split(":")[0]) 
    } 
}

// get everything from localStorage
function getLocalStorage () {
    savedDescriptions = localStorage;
}

// put something into localStorage
function setLocalStorage(hour, dexcription) {
    localStorage.setItem(hour, dexcription);
}

init()

// check every minute for new time updates and render it
var minutelyUpdate = setInterval(() => {
    getCurrentHour();
    renderDateAndTime();
}, 60000);

// event listeners
// save button clicked
timeblockList.on("click", ".saveBtn", function() {
    $(this).children().text("") // remove any text in children <p> tags
    $(this).removeAttr("style") // remove any inline styling

    var descInput = $(this).siblings(".description").val();
    var descHour = $(this).siblings(".hour").text();

    setLocalStorage(descHour, descInput) // put the text from te correcsponding description into local storage

    $(this).append("<p class='saved-text'>saved!</p>")
    $(this).css("background-color", "var(--success)")

    // remove <p> tag and green background after 1 second
    setTimeout(() => {
        $(this).children().text("") 
        $(this).removeAttr("style")
    }, 1000)
})

// textarea changed
timeblockList.on("change", ".description", function() {
    $(this).siblings(".saveBtn")
        .css("background-color", "var(--danger)")
        .append("<p class='unsaved-changes-text'><i>unsaved changes</i></p>");
})

// clear schedule buttonn clicked
clearScheduleBtn.click(function() {
    var confirmCoice = confirm("Are you sure you would like to clear your schedule? (Thhis action cannot be undone!)");
    if (confirmCoice === true) {
        localStorage.clear();
        renderTimeblock(reset=true)
    }
})