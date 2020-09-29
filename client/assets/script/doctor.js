async function removeThis(val) {
  const item = document.getElementById(val.parentElement.firstElementChild.innerHTML);
  if (item) {
    item.checked = false;
    item.form.submit();
  }
  else {
    await fetch(`/addFilter/${val.parentElement.firstElementChild.innerHTML}`,
      { method: "post" });
    window.location = "/doctor";
  }
}




var counter = 0;
function moveLeft(a) {
  var x = a.parentElement.querySelectorAll(".sub_date_selector");
  x[counter].style.display = "none";
  counter = counter - 1 < 0 ? 2 : counter - 1;
  x[counter].style.display = "grid";
}
function moveRight(a) {
  var x = a.parentElement.querySelectorAll(".sub_date_selector");
  x[counter].style.display = "none";
  counter = counter + 1 > 2 ? 0 : counter + 1;
  x[counter].style.display = "grid";
}

/*  filter list with append nd prepend  start*/
var page = window.location.href.split("/")[4];
if (page) {
  document.getElementById("pTo_" + page).classList.add("active");
}
else if (document.getElementById("pTo_1")) {
  document.getElementById("pTo_1").classList.add("active");
}
var filterList = document.getElementById("selected-filters");
var allFilters = filterList.children;
for (var i = 0; i < allFilters.length; i++) {
  if (document.getElementById(allFilters[i].firstElementChild.innerHTML)) {
    document.getElementById(allFilters[i].firstElementChild.innerHTML).setAttribute("checked", "true");
    document.getElementById(allFilters[i].firstElementChild.innerHTML).parentElement.parentElement.insertBefore(document.getElementById(allFilters[i].firstElementChild.innerHTML).parentElement, document.getElementById(allFilters[i].firstElementChild.innerHTML).parentElement.parentElement.firstElementChild);
  }
}
/*  filter list with append nd prepend  end*/





var globalToday = new Date();//global variable

async function showDocSchedule(elem, docId) {
    const current = document.getElementById(elem);
    var parent = document.getElementById(elem.split("__")[0]);
    var child = document.getElementById(elem);
    if (parent.style.display == "grid") {
        parent.style.display = "none";
        document.getElementById("subScheduleContainer" + elem.split("")[elem.split("").length - 1]).style.display = "none";
        current.parentElement.nextElementSibling.nextElementSibling.firstElementChild.innerHTML = "";
        current.parentElement.parentElement.style.display = "none";
    }
    else {
        parent.style.display = "grid";
        current.parentElement.parentElement.style.display = "block";
        const result = await fetch("/scheduleOfCurrentDoctor/" + docId, { method: "put", });
        const c = await result.text();
        console.warn("c",c);
        const today = c.split("===")[0]; //complete date and time
        var d = c.split("===")[1].split(",");// first for day name and second for hospital name and third for subSlotCount
        const dayName = today.substring(0, 3).toLowerCase();
        globalToday = new Date(today);
        const allDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        //changes all day name to three latter format
        for (var i = 0; i < d.length; i += 3) {
            d[i] = d[i].substring(0, 3).toLowerCase();
        }
        const tem = [];
        if (dayName === "sun") {
            tem.push("Today", "none", 0);
            for (var i = 0; i < d.length; i += 3) {
                if (d[i] === "mon") {
                    tem.push("Tomorrow", d[i + 1], d[i + 2]);
                    d[i] = d[i + 1] = d[i + 2] = null;
                }
            }
            if (tem.indexOf("Tomorrow") === -1)
                tem.push("Tomorrow", "none", 0);

            for (var i = 1, j = 2; i < allDays.length - 1; i++, j++) {
                var dd = new Date(today);
                var m = dd.getDate() + j;
                dd.setDate(m);
                dd = dd.toString();
                var final = allDays[i][0].toUpperCase() + allDays[i].substring(1, 3) + " " + dd.split(" ")[1] + "," + dd.split(" ")[2] + " " + dd.split(" ")[3];
                tem.push(final, "none", 0);
            }
            for (var j = 1, k = 2; j < allDays.length - 1; j++, k++) {
                for (var i = 0; i < d.length - 3; i += 3) {
                    if (d[i] === allDays[j]) {
                        var dd = new Date(today);
                        var m = dd.getDate() + k;
                        dd.setDate(m);
                        dd = dd.toString();
                        var final = allDays[j][0].toUpperCase() + allDays[j].substring(1, 3) + " " + dd.split(" ")[1] + "," + dd.split(" ")[2] + " " + dd.split(" ")[3];
                        if (d.indexOf(d[i]) === i) {
                            tem[tem.indexOf(final) + 1] = d[i + 1];
                            tem[tem.indexOf(final) + 2] = d[i + 2];
                        }
                        else {
                            if (d[i + 1] === tem[(tem.indexOf(final) + 1)]) {
                                tem[tem.indexOf(final) + 2] = parseInt(tem[tem.indexOf(final) + 2]) + parseInt(d[i + 2]);
                            }
                            else {
                                tem.splice((tem.indexOf(final) + 3), 0, final, d[i + 1], d[i + 2]);
                            }
                        }
                    }
                }
            }
        }
        else {
            for (var i = 0; i < d.length - 3; i += 3) {
                if (d[i] === dayName) {
                    tem.push("Today", d[i + 1], d[i + 2]);
                    d[i] = d[i + 1] = d[i + 2] = null;
                }
            }
            if (tem.indexOf("Today") === -1)
                tem.push("Today", "none", 0);

            var dd = new Date(today);
            var m = dd.getDate() + 1;
            dd.setDate(m);
            dd = dd.toString();
            var nextDay = dd.substring(0, 3).toLowerCase();

            for (var i = 0; i < d.length; i += 3) {
                if (d[i] === nextDay) {
                    tem.push("Tomorrow", d[i + 1], d[i + 2]);
                    d[i] = d[i + 1] = d[i + 2] = null;
                }
            }
            if (tem.indexOf("Tomorrow") === -1)
                tem.push("Tomorrow", "none", 0);

            for (var i = allDays.indexOf(dayName) + 2, j = 1; i < allDays.length; i++) {
                var dd = new Date(today);
                var m = dd.getDate() + ++j;
                dd.setDate(m);
                dd = dd.toString();
                var final = allDays[i][0].toUpperCase() + allDays[i].substring(1, 3) + " " + dd.split(" ")[1] + "," + dd.split(" ")[2] + " " + dd.split(" ")[3];
                tem.push(final, "none", 0);
            }

            for (var i = 0; i < allDays.indexOf(dayName); i++) {
                var dd = new Date(today);
                var m = dd.getDate() + ++j;
                dd.setDate(m);
                dd = dd.toString();
                var final = allDays[i][0].toUpperCase() + allDays[i].substring(1, 3) + " " + dd.split(" ")[1] + "," + dd.split(" ")[2] + " " + dd.split(" ")[3];
                tem.push(final, "none", 0);
            }
            ////////////////////////////main work

            for (var j = allDays.indexOf(dayName) + 2, k = 2; j < allDays.length - 1; j++, k++) {
                for (var i = 0; i < d.length - 3; i += 3) {
                    if (d[i] === allDays[j]) {
                        var dd = new Date(today);
                        var m = dd.getDate() + k;
                        dd.setDate(m);
                        dd = dd.toString();
                        var final = allDays[j][0].toUpperCase() + allDays[j].substring(1, 3) + " " + dd.split(" ")[1] + "," + dd.split(" ")[2] + " " + dd.split(" ")[3];
                        if (d.indexOf(d[i]) === i) {
                            tem[tem.indexOf(final) + 1] = d[i + 1];
                            tem[tem.indexOf(final) + 2] = d[i + 2];
                        }
                        else {
                            if (d[i + 1] === tem[(tem.indexOf(final) + 1)]) {
                                tem[tem.indexOf(final) + 2] = parseInt(tem[tem.indexOf(final) + 2]) + parseInt(d[i + 2]);
                            }
                            else {
                                tem.splice((tem.indexOf(final) + 3), 0, final, d[i + 1], d[i + 2]);
                            }
                        }
                    }
                }
            }
            if (dayName !== "sat")
                k = k + 1;
            for (var j = 0; j < allDays.indexOf(dayName); j++, k++) {
                for (var i = 0; i < d.length - 3; i += 3) {
                    if (d[i] === allDays[j]) {
                        var dd = new Date(today);
                        var m = dd.getDate() + k;
                        dd.setDate(m);
                        dd = dd.toString();
                        var final = allDays[j][0].toUpperCase() + allDays[j].substring(1, 3) + " " + dd.split(" ")[1] + "," + dd.split(" ")[2] + " " + dd.split(" ")[3];
                        if (d.indexOf(d[i]) === i) {
                            tem[tem.indexOf(final) + 1] = d[i + 1];
                            tem[tem.indexOf(final) + 2] = d[i + 2];
                        }
                        else {
                            if (d[i + 1] === tem[(tem.indexOf(final) + 1)]) {
                                tem[tem.indexOf(final) + 2] = parseInt(tem[tem.indexOf(final) + 2]) + parseInt(d[i + 2]);
                            }
                            else {
                                tem.splice((tem.indexOf(final) + 3), 0, final, d[i + 1], d[i + 2]);
                            }
                        }
                    }
                }
            }
        }
        d = tem;
        var temp2 = [];
        for (var i = 0; i < tem.length; i += 3) {
            if (temp2.indexOf(tem[i]) === -1)
                temp2.push(tem[i], tem[i + 1], tem[i + 2]);
            for (var j = i + 3; j < tem.length; j += 3)
                if (tem[i] === tem[j]) {
                    temp2[temp2.length - 2] += " , " + tem[j + 1];
                    temp2[temp2.length - 1] = parseInt(temp2[temp2.length - 1]) + parseInt(tem[j + 2]);
                }
        }
        d = temp2;
        child.innerHTML = "";
        for (var i = 0, a = 0; i < d.length; i += 3) {
            var div = document.createElement("div");
            div.setAttribute("class", `carouselItem ${elem}__carouselItem${++a}`);
            div.setAttribute("id", `${elem}__carouselItem${a}`);
            var x = "subScheduleContainer" + elem.split("")[elem.split("").length - 1];
            div.setAttribute("onclick", `showDocSubSchedule("${x}","${docId}","${d[i]}","${d[i + 1]}",this)`);
            div.style.cursor = "pointer";

            var h4 = document.createElement("h4");
            h4.innerHTML = d[i];
            div.appendChild(h4);

            var hiddenHospitalName = document.createElement("span");
            hiddenHospitalName.setAttribute("id", `${elem}__carouselItem${a}__hiddenHospitalName${a}`);
            hiddenHospitalName.innerHTML = d[i + 1];
            hiddenHospitalName.setAttribute("style", "display: none;");

            var span = document.createElement("span");
            span.setAttribute("class", "slot");
            span.innerHTML = `${d[i + 2]} Slot Available`;
            div.appendChild(hiddenHospitalName);
            div.appendChild(span);
            child.appendChild(div);
        }
        if (a > 3) {
            for (var i = 4; i < a + 1; i++) {
                document.getElementById(`${elem}__carouselItem${i}`).style.display = "none";
            }
        }
    }
}

async function moveCarousel(dirc, carouselId) {
    var carouselItems = document.getElementById(carouselId).children;
    if (dirc === "right") {
        for (var i = 0; i < carouselItems.length; i++) {
            if (carouselItems[i].style.display !== "none")
                break;
        }
        if (i + 3 < carouselItems.length) {
            for (var j = 0; j < carouselItems.length; j++) {
                if (j === i + 1 || j === i + 2 || j === i + 3) {
                    carouselItems[j].style.display = "flex";
                }
                else
                    carouselItems[j].style.display = "none";
            }
        }
    }
    else if (dirc === "left") {
        for (var i = 0; i < carouselItems.length; i++) {
            if (carouselItems[i].style.display !== "none")
                break;
        }
        if (i !== 0) {
            for (var j = 0; j < carouselItems.length; j++) {
                if (j === i - 1 || j === i || j === i + 1) {
                    carouselItems[j].style.display = "flex";
                }
                else
                    carouselItems[j].style.display = "none";
            }
        }
    }
}

async function toComplete(str) {
    switch (str) {
        case "sun": return "sunday";
            break;
        case "mon": return "monday";
            break;
        case "tue": return "tuesday";
            break;
        case "wed": return "wednesday";
            break;
        case "thu": return "thursday";
            break;
        case "fri": return "friday";
            break;
        case "sat": return "saturday";
            break;
        default: return 0;
    }
}

const valueInMin = (dateVal) => {
    if (dateVal.split(" ")[1] === "AM") {
        if (dateVal.split(":")[0] == 12)
            return parseInt(dateVal.split(":")[1]);
        else
            return parseInt(dateVal.split(":")[0]) * 60 + parseInt(dateVal.split(":")[1]);
    }
    else
        if (dateVal.split(" ")[1] === "PM") {
            if (dateVal.split(":")[0] == 12)
                return 12 * 60 + parseInt(dateVal.split(":")[1]);
            else
                return (12 + parseInt(dateVal.split(":")[0])) * 60 + parseInt(dateVal.split(":")[1]);
        }
}

async function showDocSubSchedule(containerId, docId, day, hospitalName, item) {
    var dayName = item.firstElementChild.innerHTML;

    var currentDate = new Date();
    var hour = currentDate.getHours();;
    var mins = currentDate.getMinutes();
    var ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    mins = mins < 10 ? '0' + mins : mins;
    var compTime = hour + ":" + mins + " " + ampm;

    const total = item.parentElement.children.length;
    for (var i = 0; i < total; i++) {
        if (item.parentElement.children[i] === item)
            item.parentElement.children[i].style.borderBottom = "0.3rem solid #3B7ABD";
        else
            item.parentElement.children[i].style.borderBottom = "none";
    }
    const url = window.location.toString();
    if (day === "Today") {
        day = globalToday.toString().split(" ")[0];
        var date = globalToday.toDateString();
    }
    else if (day === "Tomorrow") {
        var x = new Date(globalToday);
        var dd = x.getDate() + 1;
        x.setDate(dd);
        var date = x.toDateString();
        day = x.toString().split(" ")[0];
    }
    else {
        var date = day.substring(3, day.length);
        day = day.split(" ")[0];
    }
    var fullDay = await toComplete(day.toLowerCase());
    day = date;
    var subSchedule = document.getElementById(containerId);
    subSchedule.innerHTML = "";
    subSchedule.style.display = "flex";
    const result = await fetch("/subSchedule/" + docId + "/" + fullDay + "/" + hospitalName, {
        method: "put",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const resultInArray = JSON.parse(await result.text());
    const d = resultInArray;
    const temp = [];

    for (var i = 1; i < d.length; i += 2) {
        temp.push(d[i - 1]);
        temp[i] = [];
        for (var j = 0; j < d[i].length; j++) {
            temp[i].push(d[i][j]._id, d[i][j].startTime, d[i][j].endTime)
        }
    }
    subSchedule.innerHTML = "";

    var container = document.getElementById(containerId);
    var hospitalDiv = container.nextElementSibling;
    hospitalDiv.innerHTML = "";
    for (var i = 0, j = 1; i < d.length; i += 2, j++) {
        var span = document.createElement("span");
        span.setAttribute("class", "hospital" + j);
        span.innerHTML = d[i];
        hospitalDiv.appendChild(span);
    }

    //morning subschedule

    var div = document.createElement("div");
    div.setAttribute("class", "subSchedule morningSubSchedule");

    var div2 = document.createElement("div");
    div2.setAttribute("class", "timeHeader col1");
    var icn = document.createElement("i");
    icn.setAttribute("class", "fas fa-sun");
    var span = document.createElement("span");
    span.innerHTML = "Morning";
    div2.appendChild(icn);
    div2.appendChild(span);

    div.appendChild(div2);

    var div3 = document.createElement("div");
    div3.setAttribute("class", "col2 items");
    for (var m = 1, j = 1; m < temp.length; m += 2, j++) {
        for (var i = 1; i < temp[m].length; i += 3) {
            if (temp[m][i].split(" ")[1] === "AM") {
                var form = document.createElement("form");
                var span2 = document.createElement("span");
                span2.innerHTML = temp[m][i];
                form.setAttribute("class", "item item" + j)

                if (dayName === "Today") {
                    if (valueInMin(span2.innerHTML) >= valueInMin(compTime)) {
                        if (url.indexOf("reschedule") !== -1)
                            form.setAttribute("action", "/rescheduleAppointment/" + temp[m][i - 1] + "/" + fullDay);
                        else
                            form.setAttribute("action", "/appointIt/" + temp[m][i - 1] + "/" + fullDay);

                        form.setAttribute("method", "post");
                        form.setAttribute("onclick", "this.submit()");
                        form.appendChild(span2);
                        div3.appendChild(form);
                    }
                }
                else {
                    if (url.indexOf("reschedule") !== -1)
                        form.setAttribute("action", "/rescheduleAppointment/" + temp[m][i - 1] + "/" + fullDay);
                    else
                        form.setAttribute("action", "/appointIt/" + temp[m][i - 1] + "/" + fullDay);

                    form.setAttribute("method", "post");
                    form.setAttribute("onclick", "this.submit()");
                    form.appendChild(span2);
                    div3.appendChild(form);

                }
            }
        }
    }
    div.appendChild(div3);
    subSchedule.appendChild(div);

    //afternoon subschedule
    var div = document.createElement("div");
    div.setAttribute("class", "subSchedule afternoonSubSchedule");

    var div2 = document.createElement("div");
    div2.setAttribute("class", "timeHeader col1");
    var icn = document.createElement("i");
    icn.setAttribute("class", "fas fa-sun");
    var span = document.createElement("span");
    span.innerHTML = "Afternoon";
    div2.appendChild(icn);
    div2.appendChild(span);

    div.appendChild(div2);

    var div3 = document.createElement("div");
    div3.setAttribute("class", "col2 items");

    for (var m = 1, j = 1; m < temp.length; m += 2, j++) {
        for (var i = 1; i < temp[m].length; i += 3) {
            if (temp[m][i].split(" ")[1] === "PM") {
                if ((parseInt(temp[m][i]) <= 03) || (parseInt(temp[m][i]) == 12)) {
                    var form = document.createElement("form");
                    var span2 = document.createElement("span");
                    span2.innerHTML = temp[m][i];
                    form.setAttribute("class", "item item" + j)

                    if (dayName === "Today") {
                        if (valueInMin(span2.innerHTML) >= valueInMin(compTime)) {
                            if (url.indexOf("reschedule") !== -1)
                                form.setAttribute("action", "/rescheduleAppointment/" + temp[m][i - 1] + "/" + fullDay);
                            else
                                form.setAttribute("action", "/appointIt/" + temp[m][i - 1] + "/" + fullDay);

                            form.setAttribute("method", "post");
                            form.setAttribute("onclick", "this.submit()");
                            form.appendChild(span2);
                            div3.appendChild(form);
                        }
                    }
                    else {
                        if (url.indexOf("reschedule") !== -1)
                            form.setAttribute("action", "/rescheduleAppointment/" + temp[m][i - 1] + "/" + fullDay);
                        else
                            form.setAttribute("action", "/appointIt/" + temp[m][i - 1] + "/" + fullDay);

                        form.setAttribute("method", "post");
                        form.setAttribute("onclick", "this.submit()");
                        form.appendChild(span2);
                        div3.appendChild(form);

                    }
                }
            }
        }
    }
    if (item.children[2].innerHTML.split(" ")[0] == 0) {
        var button = document.createElement("button");
        button.setAttribute("class", "plus");
        button.setAttribute("onclick", `goToNextAvailable(${item.id})`);
        button.innerHTML = "Go To Next Available Slot";
        div3.appendChild(button);
    }
    div.appendChild(div3);
    subSchedule.appendChild(div);

    //evening subschedule
    var div = document.createElement("div");
    div.setAttribute("class", "subSchedule eveningSubSchedule");

    var div2 = document.createElement("div");
    div2.setAttribute("class", "timeHeader col1");
    var icn = document.createElement("i");
    icn.setAttribute("class", "fas fa-sun");
    var span = document.createElement("span");
    span.innerHTML = "Evening";
    div2.appendChild(icn);
    div2.appendChild(span);

    div.appendChild(div2);

    var div3 = document.createElement("div");
    div3.setAttribute("class", "col2 items");

    for (var m = 1, j = 1; m < temp.length; m += 2, j++) {
        for (var i = 1; i < temp[m].length; i += 3) {
            if (temp[m][i].split(" ")[1] === "PM") {
                if ((parseInt(temp[m][i]) > 03) && (parseInt(temp[m][i]) != 12)) {
                    var form = document.createElement("form");
                    var span2 = document.createElement("span");
                    span2.innerHTML = temp[m][i];
                    form.setAttribute("class", "item item" + j)

                    if (dayName === "Today") {
                        if (valueInMin(span2.innerHTML) >= valueInMin(compTime)) {
                            if (url.indexOf("reschedule") !== -1)
                                form.setAttribute("action", "/rescheduleAppointment/" + temp[m][i - 1] + "/" + fullDay);
                            else
                                form.setAttribute("action", "/appointIt/" + temp[m][i - 1] + "/" + fullDay);

                            form.setAttribute("method", "post");
                            form.setAttribute("onclick", "this.submit()");
                            form.appendChild(span2);
                            div3.appendChild(form);
                        }
                    }
                    else {
                        if (url.indexOf("reschedule") !== -1)
                            form.setAttribute("action", "/rescheduleAppointment/" + temp[m][i - 1] + "/" + fullDay);
                        else
                            form.setAttribute("action", "/appointIt/" + temp[m][i - 1] + "/" + fullDay);

                        form.setAttribute("method", "post");
                        form.setAttribute("onclick", "this.submit()");
                        form.appendChild(span2);
                        div3.appendChild(form);

                    }
                }
            }
        }
    }
    div.appendChild(div3);
    subSchedule.appendChild(div);
}

async function goToNextAvailable(item) {
    const containerId = item.id;
    var found = 0;
    var initaislPos = 0;
    var slotsArray = document.getElementById(containerId).parentElement.children;
    for (var i = 0; i < slotsArray.length; i++) {
        if (slotsArray[i] == document.getElementById(containerId))
            initaislPos = i;
    }
    var nextPos = initaislPos + 1;
    while (nextPos < slotsArray.length && found !== 1) {
        if (slotsArray[nextPos].style.display == "none") {
            slotsArray[nextPos - 3].style.display = "none";
            slotsArray[nextPos].style.display = "flex";
        }
        else if (slotsArray[nextPos + 1].style.display == "none") {
            slotsArray[nextPos - 2].style.display = "none";
            slotsArray[nextPos + 1].style.display = "flex";
        }
        else if (slotsArray[nextPos + 2].style.display == "none") {
            slotsArray[nextPos - 1].style.display = "none";
            slotsArray[nextPos + 2].style.display = "flex";
        }
        if (slotsArray[nextPos].children[2].innerHTML.split(" ")[0] != 0) {
            found = 1;
            slotsArray[nextPos].click();
            return 0;
        }
        nextPos++;
    }
    if (found === 0)
        alert("No slot available");
}