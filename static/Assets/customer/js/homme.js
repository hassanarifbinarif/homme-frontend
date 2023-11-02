let orderChannelBtn = document.getElementById('select-order-channel-btn');
let selectedOrderChannel = document.getElementById('selected-order-channel-opt');
let orderChannelDropdown = document.getElementById('order-channel-dropdown');

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