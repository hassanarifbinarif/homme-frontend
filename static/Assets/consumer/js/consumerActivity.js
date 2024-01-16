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

let requiredDataURL = `${apiURL}/admin/activities?page=1&perPage=1000&ordering=-created_at`;


// window.onload = () => {
//     getNotifications();
// }


function toggleSalesChannelDropdown(event) {
    if (salesChannelDropdown.style.display == 'flex' && (!salesChannelBtn.querySelector('.search-div').contains(event.target))) {
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
    requiredDataURL = setParams(requiredDataURL, 'type', element.getAttribute('data-value'));
    getData(requiredDataURL);
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


function toggleDateSelectorDropdown(event) {
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

function toggleDateInputs(event) {
    if (event.target.nextElementSibling.classList.contains('hide')) {
        event.target.nextElementSibling.classList.remove('hide');
        event.target.style.background = '#FFF';
        event.target.style.color = '#000093';
    }
    else {
        event.target.nextElementSibling.classList.add('hide');
        event.target.style.color = '#FFF';
        event.target.style.background = '#000093';
    }
}

function dateRangeForm(event) {
    event.preventDefault();
    let form = event.target.closest('form');
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    if (data.start_date == '' || data.end_date == '') {
        return false;
    }
    else if (isNaN(new Date(data.start_date)) || isNaN(new Date(data.end_date))) {
        return false;
    }
    else if (new Date(data.end_date) - new Date(data.start_date) <= 0) {
        return false;
    }
    else {
        requiredDataURL = setParams(requiredDataURL, 'created_at__gte', data.start_date);
        requiredDataURL = setParams(requiredDataURL, 'created_at__lte', data.end_date);
        getData(requiredDataURL);
    }
}


function toggleNetCashDropdown(event) {
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

function toggleNetCashInputs(event) {
    if (event.target.nextElementSibling.classList.contains('hide')) {
        event.target.nextElementSibling.classList.remove('hide');
        event.target.style.background = '#FFF';
        event.target.style.color = '#000093';
    }
    else {
        event.target.nextElementSibling.classList.add('hide');
        event.target.style.color = '#FFF';
        event.target.style.background = '#000093';
    }
}


function netCashForm(event) {
    if (event.key == 'Enter') {
        let form = event.target.closest('form');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        if (data.min_cash == '' || data.max_cash == '') {
            return false;
        }
        else if (!(/^-?\d*\.?\d+$/.test(data.min_cash)) || !(/^-?\d*\.?\d+$/.test(data.max_cash))) {
            return false;
        }
        else if (parseFloat(data.min_cash) >= parseFloat(data.max_cash)) {
            return false;
        }
        else {
            requiredDataURL = setParams(requiredDataURL, 'net_cash__gte', data.min_cash);
            requiredDataURL = setParams(requiredDataURL, 'net_cash__lte', data.max_cash);
            getData(requiredDataURL);
        }
    }
}


function toggleRewardsDropdown(event) {
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

function toggleRewardsInputs(event) {
    if (event.target.nextElementSibling.classList.contains('hide')) {
        event.target.nextElementSibling.classList.remove('hide');
        event.target.style.background = '#FFF';
        event.target.style.color = '#000093';
    }
    else {
        event.target.nextElementSibling.classList.add('hide');
        event.target.style.color = '#FFF';
        event.target.style.background = '#000093';
    }
}

function rewardForm(event) {
    if (event.key == 'Enter') {
        let form = event.target.closest('form');
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        if (data.min_rewards == '' || data.max_rewards == '') {
            return false;
        }
        else if (!(/^-?\d*\.?\d+$/.test(data.min_rewards)) || !(/^-?\d*\.?\d+$/.test(data.max_rewards))) {
            return false;
        }
        else if (parseInt(data.min_rewards) >= parseInt(data.max_rewards)) {
            return false;
        }
        else {
            requiredDataURL = setParams(requiredDataURL, 'rewards__gte', data.min_rewards);
            requiredDataURL = setParams(requiredDataURL, 'rewards__lte', data.max_rewards);
            getData(requiredDataURL);
        }
    }
}


function closeDropdowns(event) {
    if ((!salesChannelBtn.contains(event.target)) && (!salesChannelBtn.querySelector('.search-div').contains(event.target)) && salesChannelDropdown.style.display == 'flex') {
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