let commentsWrapper = document.getElementById('comments-wrapper');
let showCommentsCheckbox = document.getElementById('comment-checkbox');

showCommentsCheckbox.addEventListener('change', function() {
    if (this.checked) {
        commentsWrapper.classList.remove('hide');
    }
    else {
        commentsWrapper.classList.add('hide');
    }
})


function getRelativeTime(dateTime) {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const date = new Date();
    const oldDate = new Date(`${dateTime}`);
    const timestamp = date.getTime() - timezoneOffset;
    const oldTimestamp = oldDate.getTime() - timezoneOffset;
    const seconds = Math.floor(timestamp / 1000);
    const oldSeconds = Math.floor(oldTimestamp / 1000);
    const difference = seconds - oldSeconds;
    let output = ``;
    if (difference < 60) {
        // Less than a minute has passed:
        output = `Customer for ${difference} seconds`;
    } else if (difference < 3600) {
        // Less than an hour has passed:
        output = `Customer for ${Math.floor(difference / 60)} minutes`;
    } else if (difference < 86400) {
        // Less than a day has passed:
        output = `Customer for ${Math.floor(difference / 3600)} hours`;
    } else if (difference < 2620800) {
        // Less than a month has passed:
        output = `Customer for ${Math.floor(difference / 86400)} days`;
    } else if (difference < 31449600) {
        // Less than a year has passed:
        output = `Customer for ${Math.floor(difference / 2620800)} months`;
    } else {
        // More than a year has passed:
        output = `Customer for ${Math.floor(difference / 31449600)} years`;
    }
    // console.log(output);
    document.getElementById('customer-joining-time').innerText = output;
}

window.onload = () => {
    getNotifications();
    getRelativeTime(document.getElementById('customer-joining-time').getAttribute('data-value'));
}


function seeOrders(id) {
    // console.log(id);
    location.pathname = `/orders/${id}/`;
}