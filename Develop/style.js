var timeblockRow = $('.time-block');
var timeblockListRow = $('#timeblock-list');

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

// 
function getCurrentHour() {
    currentHour = moment().format("h:00 a");
}

// 
function init() {
    getCurrentHour();
    getLocalStorage();

    workHours.forEach(hour => {
        var hourBlock = $('<div>');
        var hourCol = $('<div>')
            .addClass("col-1 hour")
            .text(hour);

        var descCol = $('<textarea>')
            .addClass("col-10 description " + getTimeStyle(hour))
            .append(savedDescriptions[hour])

        var saveCol = $('<div>')
            .addClass("col-1 saveBtn")
            .append("<i>")

        hourBlock.addClass("row time-block");

        hourBlock.append(
            hourCol,
            descCol,
            saveCol
        )

        timeblockListRow.append(hourBlock);

    });

}

// 
function getTimeStyle(hour) {

    // convert the parsed hour to 24-hour time
    if (hour.includes("pm") && hour.includes("12")) {
        var hour24 = parseInt(hour.split(":")[0]);
    } else if (hour.includes("pm")) {
        var hour24 = parseInt(hour.split(":")[0]) + 12;
    } else {
        var hour24 = parseInt(hour.split(":")[0]) 
    }

    // convert the CURRENT hour to 24-hour time
    if (currentHour.includes("pm") && currentHour.includes("12")) {
        var hour24 = parseInt(hour.split(":")[0]);
    } else if(currentHour.includes("pm")) {
        var currentHour24 = parseInt(currentHour.split(":")[0]) + 12;
    } else {
        var currentHour24 = parseInt(currentHour.split(":")[0])
    }

    // now compare the hours to see which class to return
    if (hour24 < currentHour24) {
        return "past"
    } else if (hour24 === currentHour24) {
        return "present"
    } else if (hour24 > currentHour24) {
        return "future"
    }
}

// 
function getLocalStorage () {
    savedDescriptions = localStorage;
}

// 
function setLocalStorage(hour, dexcription) {
    localStorage.setItem(hour, dexcription);
}

init()

timeblockListRow.on("click", ".saveBtn", function() {
    var descInput = $(this).siblings(".description").val();
    var descHour = $(this).siblings(".hour").text();

    console.log(descHour)
    console.log(descInput)

    setLocalStorage(descHour, descInput)
})