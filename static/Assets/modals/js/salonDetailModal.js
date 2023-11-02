let statusTypeDropdown = document.getElementById('status-type-dropdown');
let statusTypeDropdownBtn = document.getElementById('status-type');
let statusTypeOptions = document.querySelectorAll('input[name="status_type_radio"]');

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


function closeDropdowns(event) {
    if((!statusTypeDropdownBtn.contains(event.target)) && statusTypeDropdown.style.display == 'flex') {
        statusTypeDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeDropdowns);
statusTypeDropdownBtn.addEventListener('click', toggleDropdown);


function selectStatusType(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        document.getElementById('selected-status-type').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-status-type').style.color = '#000';
    }
}