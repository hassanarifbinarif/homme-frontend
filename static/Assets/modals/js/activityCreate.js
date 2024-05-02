let activityTypeDropdown = document.getElementById('activity-type-dropdown');
let activityTypeDropdownBtn = document.getElementById('activity-type');

let rewardCustomerField = document.getElementById('reward-customer-field');
let selectedRewardCustomer = null;

let refundCustomerField = document.getElementById('refund-customer-field');
let selectedRefundCustomer = null;

let rewardData = {};
let refundData = {"amount": 0, "note": ''};

let submitBtn = document.getElementById('submit-btn');
let refundSubmitBtn = document.getElementById('refund-submit-btn');
let orderSubmitBtn = document.getElementById('order-submit-btn');


function toggleDropdown(event) {
    let elementBtn = event.target;
    if(!elementBtn.classList.contains('filter-btn')) {
        elementBtn = elementBtn.closest('.filter-btn');
    }
    let elementDropdown = elementBtn.nextElementSibling;
    if(elementDropdown.style.display == 'flex') {
        elementDropdown.style.display = 'none';
    }
    else {
        elementDropdown.style.display = 'flex';
    }
}

activityTypeDropdownBtn.addEventListener('click', toggleDropdown);


function closeActivityModalDropdowns(event) {
    if((!activityTypeDropdownBtn.contains(event.target)) && activityTypeDropdown.style.display == 'flex') {
        activityTypeDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeActivityModalDropdowns);


function selectActivityType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        if (inputElement.value == 'product_purchase') {
            document.getElementById('reward-section').classList.add('hide');
            document.getElementById('refund-section').classList.add('hide');
            document.getElementById('order-section').classList.remove('hide');
            submitBtn.classList.add('hide');
            refundSubmitBtn.classList.add('hide');
            orderSubmitBtn.classList.remove('hide');
        }
        else if (inputElement.value == 'reward_activity') {
            document.getElementById('order-section').classList.add('hide');
            document.getElementById('refund-section').classList.add('hide');
            document.getElementById('reward-section').classList.remove('hide');
            refundSubmitBtn.classList.add('hide');
            orderSubmitBtn.classList.add('hide');
            submitBtn.classList.remove('hide');
        }
        else if (inputElement.value == 'refund_activity') {
            document.getElementById('order-section').classList.add('hide');
            document.getElementById('reward-section').classList.add('hide');
            document.getElementById('refund-section').classList.remove('hide');
            submitBtn.classList.add('hide');
            orderSubmitBtn.classList.add('hide');
            refundSubmitBtn.classList.remove('hide');
        }
        
        document.querySelector('.create-error-msg').innerHTML = '';
        document.querySelector('.create-error-msg').classList.remove('active');
        document.getElementById('selected-activity-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-activity-type').style.color = '#000';
    }
}


function selectRewardCustomer(inputField) {
    if (inputField.checked) {
        rewardCustomerField.value = inputField.nextElementSibling.innerText;
        selectedRewardCustomer = inputField.value;
    }
}


function selectRefundCustomer(inputField) {
    if (inputField.checked) {
        refundCustomerField.value = inputField.nextElementSibling.innerText;
        selectedRefundCustomer = inputField.value;
    }
}


rewardCustomerField.addEventListener('focus', function() {
    rewardCustomerDropdown.style.display = 'flex';
})

rewardCustomerField.addEventListener('blur', function(event) {
    setTimeout(() => {
        rewardCustomerDropdown.style.display = 'none';
    }, 200);
})

rewardCustomerField.addEventListener('input', function() {
    let filteredCustomer = [];
    filteredCustomer = customerData.filter(customer => customer.full_name.toLowerCase().includes(this.value.toLowerCase())).map((customer => customer.user.id));
    if (filteredCustomer.length == 0) {
        document.getElementById('no-reward-customer-text').classList.remove('hide');
        document.querySelectorAll('.reward-customer-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-reward-customer-text').classList.add('hide');
        document.querySelectorAll('.reward-customer-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredCustomer.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


refundCustomerField.addEventListener('focus', function() {
    refundCustomerDropdown.style.display = 'flex';
})

refundCustomerField.addEventListener('blur', function(event) {
    setTimeout(() => {
        refundCustomerDropdown.style.display = 'none';
    }, 200);
})

refundCustomerField.addEventListener('input', function() {
    let filteredCustomer = [];
    filteredCustomer = customerData.filter(customer => customer.full_name.toLowerCase().includes(this.value.toLowerCase())).map((customer => customer.user.id));
    if (filteredCustomer.length == 0) {
        document.getElementById('no-refund-customer-text').classList.remove('hide');
        document.querySelectorAll('.refund-customer-item-list').forEach((item) => item.classList.add('hide'));
    }
    else {
        document.getElementById('no-refund-customer-text').classList.add('hide');
        document.querySelectorAll('.refund-customer-item-list').forEach((item) => {
            let itemID = item.getAttribute('data-id');
            if (filteredCustomer.includes(parseInt(itemID, 10))) {
                item.classList.remove('hide');
            }
            else {
                item.classList.add('hide');
            }
        })
    }
})


function getRewardDetails() {
    rewardData.points = parseFloat(document.querySelector('input[name="points"]').value);
    rewardData.notes = document.querySelector('textarea[name="reward_notes"]').value;
}


function getRefundDetails() {
    refundData.amount = parseFloat(document.querySelector('input[name="refund_points"]').value);
    refundData.note = document.querySelector('textarea[name="refund_notes"]').value;
}


function openCreateActivityModal() {
    let modal = document.getElementById('activityCreate');
    let form = modal.querySelector('form');
    let generateDiv = modal.querySelector('#generate-div');
    let labelDiv = modal.querySelector('#label-div');
    let orderBtn = document.getElementById('order-submit-btn');

    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        selectedState = null;
        selectedCountry = null;
        selectedCustomer = {};
        orderBtn.style.pointerEvents = 'auto';
        orderBtn.classList.remove('opacity-point-6');
        orderBtn.querySelector('.btn-text').innerText = 'CREATE';
        document.getElementById('selected-state-text').innerText = 'State';
        document.getElementById('selected-state-text').style.color = '#A9A9A9';
        document.getElementById('selected-country-text').innerText = 'Country';
        document.getElementById('selected-country-text').style.color = '#A9A9A9';
        document.getElementById('submit-btn').querySelector('.btn-text').innerText = 'CREATE';
        form.querySelector('.create-error-msg').innerHTML = '';
        form.querySelector('.create-error-msg').classList.remove('active');
        selectedState = null;
        generateDiv.classList.remove('hide');
        generateLabelBtn.classList.add('opacity-point-3-5');
        generateLabelBtn.removeAttribute('onclick');
        generateLabelBtn.removeAttribute('title');
        labelDiv.removeAttribute('onclick');
        labelDiv.classList.add('hide');
        addedProductsWrapper.innerHTML = '';
        addedProductsWrapper.classList.add('hide');
        productTotalWrapper.classList.add('hide');
        subTotal.innerText = '$0';
        percentDiscount.innerText = '0%';
        shippingCost.value = 0;
        totalTax.innerText = 'Not Calculated';
        grandTotal.innerText = '$0';
        orderData = {
            products: [],
            shipping_address: { first_name: "", last_name: "", address: "", phone: "", city: "", country: "", zip_code: "", state: "" },
            billing_address: { first_name: "", last_name: "", address: "", phone: "", city: "", country: "", zip_code: "", state: "" },
            pickup_type: "ship",
            is_preview: true,
            user: null,
        };
        rewardData = {};
        refundData = {"amount": 0, "note": ''};
        selectedRefundCustomer = null;
    })

    document.querySelector('.activityCreate').click();
}


async function rewardCreate(event) {
    let errorMsg = document.querySelector('.create-error-msg');
    let button = document.querySelector('#submit-btn');
    let data = JSON.parse(JSON.stringify(rewardData));

    if (event.target.id == 'submit-btn') {
        if (selectedRewardCustomer == null) {
            errorMsg.innerHTML = 'Select a customer';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.points <= 0) {
            errorMsg.innerHTML = 'Enter credits';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.notes.trim().length == 0) {
            errorMsg.innerHTML = 'Enter notes';
            errorMsg.classList.add('active');
            return false;
        }
        try {
            errorMsg.innerHTML = '';
            errorMsg.classList.remove('active');

            let token = getCookie('admin_access');
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            data.user = selectedRewardCustomer;
            data.source = 'adjustment';
            data.source_id = 0;
            data.status = 'earned';

            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/rewards`, JSON.stringify(data), headers, 'POST');
            response.json().then(function(res) {
                // console.log(res);
                if (response.status == 201) {
                    getData();
                    afterLoad(button, 'CREATED');
                    setTimeout(()=> {
                        afterLoad(button, 'CREATE');
                        document.querySelector('.activityCreate').click();
                    }, 1200)
                }
                else {
                    afterLoad(button, 'ERROR');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                    })
                    errorMsg.classList.add('active');
                }
            })
        }
        catch (err) {
            afterLoad(button, 'ERROR');
            console.log(err);
        }
    }
}


async function refundCreate(event) {
    let errorMsg = document.querySelector('.create-error-msg');
    let button = document.querySelector('#refund-submit-btn');
    let data = JSON.parse(JSON.stringify(refundData));

    if (event.target.id == 'refund-submit-btn') {
        if (selectedRefundCustomer == null) {
            errorMsg.innerHTML = 'Select a customer';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.amount <= 0) {
            errorMsg.innerHTML = 'Enter refund amount';
            errorMsg.classList.add('active');
            return false;
        }
        else if (data.note.trim().length == 0) {
            errorMsg.innerHTML = 'Enter notes';
            errorMsg.classList.add('active');
            return false;
        }
        try {
            errorMsg.innerHTML = '';
            errorMsg.classList.remove('active');

            let token = getCookie('admin_access');
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            };

            data.user = selectedRefundCustomer;
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/refunds`, JSON.stringify(data), headers, 'POST');
            response.json().then(function(res) {
                if (response.status == 201) {
                    getData();
                    afterLoad(button, 'CREATED');
                    setTimeout(()=> {
                        afterLoad(button, 'CREATE');
                        document.querySelector('.activityCreate').click();
                    }, 1200)
                }
                else {
                    afterLoad(button, 'ERROR');
                    let keys = Object.keys(res.messages);
                    keys.forEach((key) => {
                        errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                    })
                    errorMsg.classList.add('active');
                }
            })
        }
        catch (err) {
            afterLoad(button, 'ERROR');
            console.log(err);
        }
    }
}