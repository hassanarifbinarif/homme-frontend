let salesChannelDropdown = document.getElementById('sales-channel-dropdown');
let salesChannelBtn = document.getElementById('sales-channel-btn');

let typeDropdown = document.getElementById('type-dropdown');
let typeBtn = document.getElementById('type-btn');

let dateSelectorBtn = document.getElementById('date-selector-btn');
let dateSelectorInputWrapper = document.getElementById('date-selector');

let netCashBtn = document.getElementById('net-cash-btn');
let netCashInputWrapper = document.getElementById('net-cash-selector');

let rewardsBtn = document.getElementById('rewards-btn');
let rewardsInputWrapper = document.getElementById('rewards-selector');


function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    // console.log(data);
    // requiredDataURL = setParams(requiredDataURL, 'search', `${data.search}`);
    // getData(requiredDataURL);
}


function toggleSalesChannelDropdown() {
    if (salesChannelDropdown.style.display == 'flex') {
        salesChannelDropdown.style.display = 'none';
    }
    else {
        salesChannelDropdown.style.display = 'flex';
    }
}

function filterSalesChannelOption(event) {
    let element = event.target;
    document.getElementById('selected-sales-channel').innerText = element.innerText;
}



function filterTypeOption(event) {
    let element = event.target;
    // document.getElementById('selected-type').innerText = element.innerText;
}

function toggleTypeDropdown() {
    if (typeDropdown.style.display == 'flex') {
        typeDropdown.style.display = 'none';
    }
    else {
        typeDropdown.style.display = 'flex';
    }
}


function toggleDateSelectorInputs(event) {
    if ((dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'none') {
        dateSelectorInputWrapper.style.display = 'flex';
    }
    else if ((dateSelectorBtn.querySelector('span').contains(event.target) || dateSelectorBtn.querySelector('svg').contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
    }
    else if ((dateSelectorBtn.querySelector('.date-selector').contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
    }
    else {
        dateSelectorInputWrapper.style.display = 'none';
    }
}

function dateRangeForm(event) {
    event.preventDefault();
    let form = event.target.closest('form');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
}


function toggleNetCashInputs(event) {
    if ((netCashBtn.contains(event.target)) && netCashInputWrapper.style.display == 'none') {
        netCashInputWrapper.style.display = 'flex';
    }
    else if ((netCashBtn.querySelector('span').contains(event.target) || netCashBtn.querySelector('svg').contains(event.target)) && netCashInputWrapper.style.display == 'flex') {
        netCashInputWrapper.style.display = 'none';
    }
    else if ((netCashBtn.querySelector('.net-cash-selector').contains(event.target)) && netCashInputWrapper.style.display == 'flex') {
    }
    else {
        netCashInputWrapper.style.display = 'none';
    }
}

function netCashForm(event) {
    event.preventDefault();
    let form = event.target.closest('form');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
}


function toggleRewardsInputs(event) {
    if ((rewardsBtn.contains(event.target)) && rewardsInputWrapper.style.display == 'none') {
        rewardsInputWrapper.style.display = 'flex';
    }
    else if ((rewardsBtn.querySelector('span').contains(event.target) || rewardsBtn.querySelector('svg').contains(event.target)) && rewardsInputWrapper.style.display == 'flex') {
        rewardsInputWrapper.style.display = 'none';
    }
    else if ((rewardsBtn.querySelector('.rewards-selector').contains(event.target)) && rewardsInputWrapper.style.display == 'flex') {
    }
    else {
        rewardsInputWrapper.style.display = 'none';
    }
}

function rewardForm(event) {
    event.preventDefault();
    let form = event.target.closest('form');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
}


function closeDropdowns(event) {
    if ((!salesChannelBtn.contains(event.target)) && salesChannelDropdown.style.display == 'flex') {
        salesChannelDropdown.style.display = "none";
    }
    else if((!typeBtn.contains(event.target)) && typeDropdown.style.display == 'flex') {
        typeDropdown.style.display = 'none';
    }
    else if ((!dateSelectorBtn.contains(event.target)) && dateSelectorInputWrapper.style.display == 'flex') {
        dateSelectorInputWrapper.style.display = 'none';
    }
    else if ((!netCashBtn.contains(event.target)) && netCashInputWrapper.style.display == 'flex') {
        netCashInputWrapper.style.display = 'none';
    }
    else if ((!rewardsBtn.contains(event.target)) && rewardsInputWrapper.style.display == 'flex') {
        rewardsInputWrapper.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function reverseTableRows() {
    const table = document.getElementById('activity-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


function sortByAlphabets(event, columnIndex) {
    let arrows = event.target.closest('th').querySelectorAll('path');
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("activity-table");
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


function extractNumber(value) {
    return parseFloat(value.match(/\d+/)[0]);
}

function sortByDigits(event, columnIndex) {
    let columnArrows = event.target.closest('th').querySelectorAll('path');
    var table = document.getElementById("activity-table");
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc"; // Set the default sorting direction to ascending

    while (switching) {
        switching = false;
        rows = table.rows;
    
        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;
    
            x = extractNumber(rows[i].getElementsByTagName("td")[columnIndex].textContent);
            y = extractNumber(rows[i + 1].getElementsByTagName("td")[columnIndex].textContent);
        
            if (dir === "asc") {
                columnArrows[0].setAttribute('opacity', '.2');
                columnArrows[1].setAttribute('opacity', '1');
                if (x > y) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                columnArrows[0].setAttribute('opacity', '1');
                columnArrows[1].setAttribute('opacity', '.2');
                if (x < y) {
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