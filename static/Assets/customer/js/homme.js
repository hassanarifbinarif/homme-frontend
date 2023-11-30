let orderChannelBtn = document.getElementById('select-order-channel-btn');
let selectedOrderChannel = document.getElementById('selected-order-channel-opt');
let orderChannelDropdown = document.getElementById('order-channel-dropdown');

let chartTypeBtn = document.getElementById('chart-type-btn');
let chartTypeDropdown = document.getElementById('chart-type-dropdown');

window.onload = () => {
    getNotifications();
}

orderChannelBtn.addEventListener('click', function() {
    if (orderChannelDropdown.classList.contains('hide')) {
        orderChannelDropdown.classList.remove('hide');
    }
    else {
        orderChannelDropdown.classList.add('hide');
    }
})

function selectOrderChannel(event) {
    let element = event.target;
    // selectedOrderChannel.innerText = element.innerText;
    orderChannelDropdown.classList.add('hide');
    orderChannelBtn.click();
}


chartTypeBtn.addEventListener('click', function() {
    if (chartTypeDropdown.classList.contains('hide')) {
        chartTypeDropdown.classList.remove('hide');
    }
    else {
        chartTypeDropdown.classList.add('hide');
    }
})

function selectChartType(event) {
    let element = event.target;
    if (element.getAttribute('data-value') == 'sales') {
        document.getElementById('pick-ship-chart').classList.add('hide');
        document.getElementById('channel-chart').classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = 'Sales Per Channel';
    }
    else if (element.getAttribute('data-value') == 'pick_ship') {
        document.getElementById('channel-chart').classList.add('hide');
        document.getElementById('pick-ship-chart').classList.remove('hide');
        document.getElementById('selected-chart-type').innerText = 'Picked-up VS Shipped';
    }
}


function closeDropdowns(event) {
    if (!(orderChannelBtn.contains(event.target)) && !(orderChannelDropdown.contains(event.target))) {
        orderChannelDropdown.classList.add('hide');
    }
}

document.body.addEventListener("click", closeDropdowns);