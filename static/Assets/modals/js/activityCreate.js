let activityTypeDropdown = document.getElementById('activity-type-dropdown');
let activityTypeDropdownBtn = document.getElementById('activity-type');
let skinTypeOptions = document.querySelectorAll('input[name="activity_type_radio"]');


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


function closeDropdowns(event) {
    if((!activityTypeDropdownBtn.contains(event.target)) && activityTypeDropdown.style.display == 'flex') {
        activityTypeDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);


function selectActivityType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        if (inputElement.value == 'product_purchase') {
            document.getElementById('product-search-wrapper').classList.remove('hide');
            document.getElementById('selected-product-wrapper').classList.remove('hide');
            document.getElementById('product-totals').classList.remove('hide');
            document.getElementById('product-shipping-details').classList.remove('hide');
            document.getElementById('credits-input-wrapper').classList.add('hide');
        }
        else if (inputElement.value == 'reward_activity') {
            document.getElementById('product-search-wrapper').classList.add('hide');
            document.getElementById('selected-product-wrapper').classList.add('hide');
            document.getElementById('product-totals').classList.add('hide');
            document.getElementById('product-shipping-details').classList.add('hide');
            document.getElementById('credits-input-wrapper').classList.remove('hide');
        }
        document.getElementById('selected-activity-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-activity-type').style.color = '#000';
    }
}