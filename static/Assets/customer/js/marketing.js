let requiredDataURL = `/admin/marketings?page=1&perPage=1000&ordering=-created_at`;

window.onload = () => {
    getNotifications();
    getData();
    populateDropdowns();
}


async function getData(url=null) {
    let data;
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
    let tableBody = document.getElementById('marketing-table');
    tableBody.classList.add('hide');
    document.getElementById('table-loader').classList.remove('hide');
    try {
        let response = await requestAPI('/get-marketing-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.marketing_data;
                convertDateTime();
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


function sortByAlphabets(event, columnIndex) {
    let arrows = event.target.closest('th').querySelectorAll('path');
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("marketing-table");
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[columnIndex].textContent;
            y = rows[i + 1].getElementsByTagName("td")[columnIndex].textContent;

            if (dir === "asc") {
                arrows[0].setAttribute('opacity', '.2');
                arrows[1].setAttribute('opacity', '1');
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                arrows[0].setAttribute('opacity', '1');
                arrows[1].setAttribute('opacity', '.2');
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function convertToDateTime(dateTimeString) {
    return new Date(dateTimeString);
}

function sortByDate(event) {
    let arrows = event.target.closest('th').querySelectorAll('path');
    var table = document.getElementById("marketing-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = convertToDateTime(rows[i].getElementsByTagName("td")[2].getAttribute('dateTime'));
            y = convertToDateTime(rows[i + 1].getElementsByTagName("td")[2].getAttribute('dateTime'));

            if (dir === "asc") {
                if (x > y) {
                    shouldSwitch = true;
                    arrows[0].setAttribute('opacity', '.2');
                    arrows[1].setAttribute('opacity', '1');
                    break;
                }
            } else if (dir === "desc") {
                if (x < y) {
                    shouldSwitch = true;
                    arrows[0].setAttribute('opacity', '1');
                    arrows[1].setAttribute('opacity', '.2');
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function convertDateTime() {
    let times = document.querySelectorAll('.created-at-date');
    times.forEach((dateTime) => {
        const inputDate = new Date(dateTime.textContent);

        const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(inputDate);
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(inputDate);
        const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(inputDate);
        const result = `${day}-${month}-${year}`;

        dateTime.textContent = result;
    })
}