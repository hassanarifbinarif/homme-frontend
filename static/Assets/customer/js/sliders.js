const role = 'user';
let requiredDataURL = `/admin/content/sliders?page=1&perPage=1000&ordering=-sort_order&search=&target_role=user`;
let supportedImageWidth = 1000;
let supportedImageHeight = 1000;
let selectedLevel = null;
let levelList = [];
let selectedLevelList = [];
let is_serviced_region = true;
let targetScreenData = [];
let selectedTargetScreen = null;

let userLevelDropdown = document.getElementById('user-level-dropdown');
let userLevelDropdownBtn = document.getElementById('user-level');

let targetScreenDropdown = document.getElementById('target-screen-dropdown');
let targetScreenDropdownBtn = document.getElementById('target-screen');


window.onload = () => {
    // getNotifications();
    getData();
}

window.addEventListener('load', populateMembershipLevels);


async function populateMembershipLevels() {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    };

    try {
        let response = await requestAPI(`${apiURL}/admin/membership-levels?search=&page=1&perPage=100&ordering=-id`, null, headers, 'GET');
        response.json().then(function(res) {
            levelList = [...res.data];
            let newUserfilteredList = levelList.filter(item => item.name.includes("new"));
            let newUserfilteredListIds = new Set(newUserfilteredList.map(item => item.id));

            userLevelDropdown.innerHTML += `<div class="radio-btn">
                                                <input id="user-membership-${newUserfilteredList.map(item => item.id)}" onchange="selectUserLevel(event);" type="radio" value="${newUserfilteredList.map(item => item.id)}" name="user_level_radio" />
                                                <label for="user-membership-${newUserfilteredList.map(item => item.id)}" class="radio-label">New Users</label>
                                            </div>`

            levelList.forEach((membership_level) => {
                if (!newUserfilteredListIds.has(membership_level.id)) {
                    userLevelDropdown.innerHTML += `<div class="radio-btn">
                                                        <input id="user-membership-${membership_level.id}" onchange="selectUserLevel(event);" type="radio" value="${membership_level.id}" name="user_level_radio" />
                                                        <label for="user-membership-${membership_level.id}" class="radio-label">${captalizeFirstLetter(membership_level.level_name)} Users</label>
                                                    </div>`
                }
            })
            userLevelDropdown.innerHTML += `<div class="radio-btn">
                                                <input id="user-membership-no-region" onchange="selectUserLevel(event);" type="radio" value="is_not_serviced_region" name="user_level_radio" />
                                                <label for="user-membership-no-region" class="radio-label">Users Outside The Service Region</label>
                                            </div>`
        })
    }
    catch (err) {
        console.log(err);
    }
}


async function getTargetScreen() {
    let token = getCookie('admin_access');
    let headers = { "Authorization": `Bearer ${token}` };
    try {
        let response = await requestAPI(`${apiURL}/admin/content/target-screens?perPage=1000&role=${role}`, null, headers, 'GET');
        response.json().then(function(res) {
            targetScreenData = [...res.data];
            targetScreenData.forEach((targetScreen) => {
                targetScreenDropdown.innerHTML += `<div class="radio-btn">
                                                        <input id="target-screen-${targetScreen.id}" onchange="selectTargetScreen(this);" type="radio" value="${targetScreen.id}" name="target_screen_radio" />
                                                        <label for="target-screen-${targetScreen.id}" class="radio-label">${captalizeFirstLetter(targetScreen.name)}</label>
                                                    </div>`
            })
        })
    }
    catch (err) {
        console.log(err);
    }
}

window.addEventListener('load', getTargetScreen);


function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    getData(urlParams);
}


async function getData(url=null) {
    let data;
    let tableBody = document.getElementById('slider-table');
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url;
    }
    document.getElementById('table-loader').classList.remove('hide');
    tableBody.classList.add('hide');
    try {
        let response = await requestAPI('/get-sliders-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.sliders_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}


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

userLevelDropdownBtn.addEventListener('click', toggleDropdown);
targetScreenDropdownBtn.addEventListener('click', toggleDropdown);


function reverseTableRows() {
    const table = document.getElementById('slider-table');
    const tableBody = table.querySelector('tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.reverse();
    tableBody.innerHTML = '';

    for (const row of rows) {
        tableBody.appendChild(row);
    }
}


const sortOrders = {};

function sortByAlphabets(event, columnIndex) {
    const arrows = event.target.closest('th').querySelectorAll('path');
    const table = document.getElementById("slider-table");
    const currentOrder = sortOrders[columnIndex] || 'asc';

    const rows = Array.from(table.rows).slice(1);

    rows.sort((rowA, rowB) => {
        const valueA = rowA.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();
        const valueB = rowB.getElementsByTagName("td")[columnIndex].textContent.toLowerCase();

        return currentOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    const tbody = table.querySelector('tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (let i = 0; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
    }

    arrows[0].setAttribute('opacity', currentOrder === 'asc' ? '0.2' : '1');
    arrows[1].setAttribute('opacity', currentOrder === 'asc' ? '1' : '0.2');
    
    sortOrders[columnIndex] = currentOrder === 'asc' ? 'desc' : 'asc';
}


function openCreateSliderModal(modalID) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector("form");
    form.setAttribute("onsubmit", `createSliderForm(event)`);
    modal.querySelector('#user-level-dropdown-container').classList.remove('hide');
    modal.querySelector('#salon-level-dropdown-container').classList.add('hide');
    modal.addEventListener('hidden.bs.modal', event => {
        selectedLevel = null;
        selectedTargetScreen = null;
        is_serviced_region = true;
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#user-level-dropdown-container').classList.add('hide');
        document.getElementById('selected-user-level').innerText = 'Select User Type';
        document.getElementById('selected-user-level').style.color = 'rgba(3, 7, 6, 0.60)';
        document.getElementById('selected-target-screen').innerText = 'Select Target Screen';
        document.getElementById('selected-target-screen').style.color = 'rgba(3, 7, 6, 0.60)';
        let label = modal.querySelector('#image-input-label');
        label.querySelector('.event-img').src = '';
        label.querySelector('.event-img').classList.add('hide');
        label.querySelector('svg').style.display = 'block';
        label.querySelectorAll('span').forEach((span) => {
            span.style.display = 'block';
        })
        modal.querySelector('.btn-text').innerText = 'SAVE';
        document.querySelector('.error-div').classList.add('hide');
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalID}`).click();
}


function selectUserLevel(event) {
    let inputElement = event.target;
    if(inputElement.checked) {
        if (inputElement.value == 'is_not_serviced_region') {
            is_serviced_region = false;
            selectedLevel = [];
        }
        else if (inputElement.value == 'all') {
            is_serviced_region = null;
            selectedLevel = [];
        }
        else {
            is_serviced_region = true;
            selectedLevel = inputElement.value ? inputElement.value.split(',') : [];
        }
        document.getElementById('selected-user-level').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-user-level').style.color = '#000';
    }
}


function selectTargetScreen(inputElement) {
    if(inputElement.checked) {
        document.getElementById('selected-target-screen').innerText = inputElement.nextElementSibling.innerText;
        document.getElementById('selected-target-screen').style.color = '#000';
        selectedTargetScreen = inputElement.value;
    }
}


function closeSliderModalDropdowns(event) {
    if((!userLevelDropdownBtn.contains(event.target)) && userLevelDropdown.style.display == 'flex') {
        userLevelDropdown.style.display = 'none';
    }
    if((!targetScreenDropdownBtn.contains(event.target)) && targetScreenDropdown.style.display == 'flex') {
        targetScreenDropdown.style.display = 'none';
    }
}

document.body.addEventListener('click', closeSliderModalDropdowns);


async function createSliderForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let imageInput = form.querySelector('input[name="image"]');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorDiv = form.querySelector('.error-div');
    let errorMsg = form.querySelector('.create-error-msg');

    if (data.name.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.text.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid description';
        errorMsg.classList.add('active');
        return false;
    }
    else if (selectedLevel == null) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Select type of users';
        errorMsg.classList.add('active');
        return false;
    }
    else if (imageInput.files.length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Image with supported dimensions is required';
        errorMsg.classList.add('active');
        return false;
    }
    try {
        errorDiv.classList.add('hide');
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');
        if (Array.isArray(selectedLevel) && selectedLevel.length > 0) {
            selectedLevel.forEach((level) => {
                formData.append("target_membership_levels", parseInt(level));
            })
            formData.append('is_serviced_region', true);
        }
        else
            formData.append('is_serviced_region', is_serviced_region);
        
        if (selectedTargetScreen != null)
            formData.append('target_screen', selectedTargetScreen);
        
        formData.append("is_visible", true);

        let token = getCookie('admin_access');
        let headers = { "Authorization": `Bearer ${token}` };

        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/content/sliders`, formData, headers, 'POST');
        response.json().then(function(res) {
            if (response.status == 201) {
                form.removeAttribute("onsubmit");
                afterLoad(button, 'CREATED');
                getData();
                setTimeout(() => {
                    afterLoad(button, 'SAVE');
                    document.querySelector('.createSlider').click();
                }, 1000)
            }
            else if (response.status == 400) {
                afterLoad(button, buttonText);
                errorDiv.classList.remove('hide');
                let keys = Object.keys(res.messages);
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                })
                errorMsg.classList.add('active');
            }
            else {
                afterLoad(button, 'ERROR');
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, 'ERROR');
    }
}


function arraysAreEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
  
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}


function openUpdateSliderModal(modalID, id, name, description, imageUrl, target_membership_level, service_region, target_screen) {
    let modal = document.querySelector(`#${modalID}`);
    modal.querySelector('#slider-modal-header').innerText = 'Edit Slider';
    let form = modal.querySelector("form");
    is_serviced_region = service_region == 'False' ? false : service_region == 'None' ? null : true;
    form.setAttribute("onsubmit", `updateSliderForm(event, ${id})`);
    form.querySelector('input[name="name"]').value = name;
    form.querySelector('input[name="text"]').value = description;
    form.querySelector('.event-img').src = imageUrl;
    form.querySelector('.event-img').classList.remove('hide');
    let label = modal.querySelector('#image-input-label');
    label.querySelector('svg').style.display = 'none';
    label.querySelectorAll('span').forEach((span) => {
        span.style.display = 'none';
    })
    modal.querySelector('#user-level-dropdown-container').classList.remove('hide');
    let membership_level_list = JSON.parse(target_membership_level);
    if (Array.isArray(membership_level_list)) {
        if (arraysAreEqual(membership_level_list, [])) {
            if (is_serviced_region == false) {
                document.getElementById('selected-user-level').innerText = 'Users Outside The Service Region';
            }
            else {
                document.getElementById('selected-user-level').innerText = 'All Users';
            }
            document.getElementById('selected-user-level').style.color = '#000';
            selectedLevel = [];
        }
        else if (arraysAreEqual(membership_level_list, [6, 7]) || arraysAreEqual(membership_level_list, [7, 6])) {
            let checkedInput = modal.querySelector(`input[name="user_level_radio"][value="7,6"]`);
            checkedInput.click();
        }
        else {
            let checkedInput = modal.querySelector(`input[name="user_level_radio"][value="${membership_level_list[0]}"]`);
            checkedInput.click();
        }
    }
    if (target_screen != 'None') {
        let sliderTargetScreen = targetScreenData.find(record => record.id == target_screen);
        let targetScreenCheckedInput = modal.querySelector(`input[name="target_screen_radio"][value="${sliderTargetScreen.id}"]`);
        if (targetScreenCheckedInput) {
            targetScreenCheckedInput.click();
        }
    }
    // if (target_membership_level != '') {
    //     selectedLevel = target_membership_level;
    //     let checkedInput = modal.querySelector(`input[name="user_level_radio"][value="${target_membership_level}"]`);
    //     document.getElementById('selected-user-level').innerText = checkedInput.nextElementSibling.innerText;
    //     document.getElementById('selected-user-level').style.color = '#000';
    // }
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        selectedLevel = null;
        selectedTargetScreen = null;
        is_serviced_region = true;
        modal.querySelector('#slider-modal-header').innerText = 'Create Slider';
        modal.querySelector('#user-level-dropdown-container').classList.add('hide');
        document.getElementById('selected-user-level').innerText = 'Select User Type';
        document.getElementById('selected-user-level').style.color = 'rgba(3, 7, 6, 0.60)';
        document.getElementById('selected-target-screen').innerText = 'Select Target Screen';
        document.getElementById('selected-target-screen').style.color = 'rgba(3, 7, 6, 0.60)';
        form.removeAttribute("onsubmit");
        label.querySelector('.event-img').src = '';
        label.querySelector('.event-img').classList.add('hide');
        label.querySelector('svg').style.display = 'block';
        label.querySelectorAll('span').forEach((span) => {
            span.style.display = 'block';
        })
        modal.querySelector('.btn-text').innerText = 'SAVE';
        document.querySelector('.error-div').classList.add('hide');
        document.querySelector('.create-error-msg').classList.remove('active');
        document.querySelector('.create-error-msg').innerText = "";
    })
    document.querySelector(`.${modalID}`).click();
}


async function updateSliderForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let imageInput = form.querySelector('input[name="image"]');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let errorDiv = form.querySelector('.error-div');
    let errorMsg = form.querySelector('.create-error-msg');

    if (data.name.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid name';
        errorMsg.classList.add('active');
        return false;
    }
    else if (data.text.trim().length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Enter valid description';
        errorMsg.classList.add('active');
        return false;
    }
    try {
        let token = getCookie('admin_access');
        if (imageInput.files.length == 0) {
            formData.delete("image");
        }
        if (selectedLevel != null) {
            if (Array.isArray(selectedLevel) && selectedLevel.length > 0) {
                selectedLevel.forEach((level) => {
                    formData.append("target_membership_levels", parseInt(level));
                })
            }
            else {
                let headers = {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                };
                beforeLoad(button);
                let response = await requestAPI(`${apiURL}/admin/content/sliders/${id}`, JSON.stringify({"target_membership_levels": []}), headers, 'PATCH');
            }
        }
        formData.append('is_serviced_region', is_serviced_region);
        if (selectedTargetScreen != null)
            formData.append('target_screen', selectedTargetScreen);
        
        errorDiv.classList.add('hide');
        errorMsg.innerText = '';
        errorMsg.classList.remove('active');            

        let headers = { "Authorization": `Bearer ${token}` };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/content/sliders/${id}`, formData, headers, 'PATCH');
        response.json().then(function(res) {
            if (response.status == 200) {
                form.removeAttribute("onsubmit");
                afterLoad(button, 'SAVED');
                getData();
                setTimeout(() => {
                    afterLoad(button, 'SAVE');
                    document.querySelector('.createSlider').click();
                }, 1000)
            }
            else if (response.status == 400) {
                afterLoad(button, buttonText);
                errorDiv.classList.remove('hide');
                let keys = Object.keys(res.messages);
                keys.forEach((key) => {
                    errorMsg.innerHTML += `${key}: ${res.messages[key]} <br />`;
                })
                errorMsg.classList.add('active');
            }
            else {
                afterLoad(button, 'ERROR');
            }
        })
    }
    catch (err) {
        console.log(err);
        afterLoad(button, 'ERROR');
    }
}



function verifyEventImage(input) {
    if (input.files.length > 0) {
        let label = input.closest('label');
        const img = document.createElement('img');
        const selectedImage = input.files[0];
        const objectURL = URL.createObjectURL(selectedImage);
        let imageTag = label.querySelector('.event-img');
        img.onload = function handleLoad() {
            // console.log(`Width: ${img.width}, Height: ${img.height}`);
    
            if (img.width == supportedImageWidth && img.height == supportedImageHeight) {
                imageTag.src = objectURL;
                imageTag.classList.remove('hide');
                label.querySelector('svg').style.display = 'none';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'none';
                })
                document.querySelector('.error-div').classList.add('hide');
                document.querySelector('.create-error-msg').classList.remove('active');
                document.querySelector('.create-error-msg').innerText = "";
            }
            else {
                URL.revokeObjectURL(objectURL);
                imageTag.classList.add('hide');
                label.querySelector('svg').style.display = 'block';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'block';
                })
                document.querySelector('.error-div').classList.remove('hide');
                document.querySelector('.create-error-msg').classList.add('active');
                document.querySelector('.create-error-msg').innerText = `Image does not match supported dimensions: ${supportedImageWidth}x${supportedImageHeight} px`;
                input.value = null;
            }
        };
  
        img.src = objectURL;
    }
}


async function toggleVisibility(event, id, isVisible) {
    let element = event.target.closest('.visibility');
    let data = {
        is_visible: isVisible == 'True' ? false : true
    };
    let token = getCookie('admin_access');
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    try {
        element.style.pointerEvents = "none";
        let response = await requestAPI(`${apiURL}/admin/content/sliders/${id}`, JSON.stringify(data), headers, 'PATCH');
        response.json().then(function(res) {
            element.style.pointerEvents = "auto";
            // console.log(res);
            if (response.status == 200) {
                element.removeAttribute("onclick");
                element.classList.add('hide');
                if (res.data.is_visible) {
                    element.closest('.actions-div').querySelector('.is_visible').classList.remove('hide');
                    element.closest('.actions-div').querySelector('.is_visible').setAttribute("onclick", `toggleVisibility(event, '${res.data.id}', 'True')`);
                }
                else {
                    element.closest('.actions-div').querySelector('.is_not_visible').classList.remove('hide');
                    element.closest('.actions-div').querySelector('.is_not_visible').setAttribute("onclick", `toggleVisibility(event, '${res.data.id}', 'False')`);
                }
            }
        })
    }
    catch (err) {
        element.style.pointerEvents = "auto";
        console.log(err);
    }
}


function openDelSliderModal(modalID, id) {
    let modal = document.querySelector(`#${modalID}`);
    let form = modal.querySelector('form');
    form.setAttribute("onsubmit", `delSliderForm(event, ${id})`);
    modal.querySelector('#modal-header-text').innerText = 'Delete Slider';
    modal.querySelector('#warning-statement').innerText = 'Are you sure you want to delete this slider?';
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
        modal.querySelector('#modal-header-text').innerText = '';
        modal.querySelector('#warning-statement').innerText = '';
        modal.querySelector('.btn-text').innerText = 'DELETE';
    })
    document.querySelector(`.${modalID}`).click();
}

async function delSliderForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    try {
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/content/sliders/${id}`, null, headers, 'DELETE');
        // console.log(response);
        if (response.status == 204) {
            form.reset();
            form.removeAttribute("onsubmit");
            afterLoad(button, 'DELETED');
            getData();
            setTimeout(() => {
                document.querySelector('.delModal').click();
            }, 1000)
        }
        else {
            afterLoad(button, 'Error');
        }
    }
    catch (err) {
        afterLoad(button, 'Error');
        console.log(res);
    }
}


// Handling Draggable Table Rows

let dragSrcEl;

function handleDragStart(e) {
    row = e.target.closest('tr');
    row.style.opacity = '0.4';
    dragSrcEl = row;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', row.innerHTML);
}

function handleDragEnd(e) {
    row = e.target.closest('tr');
    row.style.opacity = '1';
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

async function handleDrop(e) {
    e.stopPropagation();
    let row = e.target.closest('tr');
    
    if (dragSrcEl != row) {
        dragSrcEl.innerHTML = row.innerHTML;
        row.innerHTML = e.dataTransfer.getData('text/html');
        let draggedUponRowId = row.getAttribute("data-id");
        let draggedRowId = dragSrcEl.getAttribute("data-id");
        let draggedUponRowOrder = row.getAttribute("data-sort-order") == "0" ? row.getAttribute("data-id") : row.getAttribute("data-sort-order");
        let draggedRowOrder = dragSrcEl.getAttribute("data-sort-order") == "0" ? dragSrcEl.getAttribute("data-id") : dragSrcEl.getAttribute("data-sort-order");
        
        if (draggedRowOrder == draggedUponRowOrder) {
            draggedRowOrder = draggedRowId;
            draggedUponRowOrder = draggedUponRowId;
        }
        
        let updateTargetRowOrder = await updateSortOrder(parseInt(draggedUponRowId), parseInt(draggedRowOrder));
        if (updateTargetRowOrder.status == 200) {
            row.setAttribute('data-sort-order', draggedUponRowOrder);
            row.setAttribute('data-id', draggedRowId);
        }
        
        let updateDraggedRowOrder = await updateSortOrder(parseInt(draggedRowId), parseInt(draggedUponRowOrder));
        if (updateDraggedRowOrder.status == 200) {
            dragSrcEl.setAttribute('data-sort-order', draggedRowOrder);
            dragSrcEl.setAttribute('data-id', draggedUponRowId);
        }
    }
}


async function updateSortOrder(id, order) {
    try {
        let token = getCookie('admin_access');
        let headers = { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
        let response = await requestAPI(`${apiURL}/admin/content/sliders/${id}`, JSON.stringify({ "sort_order": order}), headers, 'PATCH');
        return response;
    }
    catch (err) {
        console.log(err);
    }
}