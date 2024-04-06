const role = 'salon';
let requiredDataURL = `/admin/content/sliders?page=1&perPage=1000&ordering=-created_at&search=&target_role=salon`;
let supportedImageWidth = 1000;
let supportedImageHeight = 1000;


window.onload = () => {
    getData();
    // getNotifications();
}

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
    modal.querySelector('#user-level-dropdown-container').classList.add('hide');
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        form.removeAttribute("onsubmit");
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
    else if (imageInput.files.length == 0) {
        errorDiv.classList.remove('hide');
        errorMsg.innerText = 'Image with supported dimensions is required';
        errorMsg.classList.add('active');
        return false;
    }
    else {
        try {
            errorDiv.classList.add('hide');
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`
            };
            beforeLoad(button);
            formData.append("is_visible", true);
            formData.append("target_role", 'salon');
            let response = await requestAPI(`${apiURL}/admin/content/sliders`, formData, headers, 'POST');
            // console.log(response);
            response.json().then(function(res) {
                // console.log(res);
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
}


function openUpdateSliderModal(modalID, id, name, description, imageUrl, target_membership_level) {
    let modal = document.querySelector(`#${modalID}`);
    modal.querySelector('#slider-modal-header').innerText = 'Edit Slider';
    let form = modal.querySelector("form");
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
    modal.addEventListener('hidden.bs.modal', event => {
        form.reset();
        modal.querySelector('#slider-modal-header').innerText = 'Create Slider';
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
    // console.log(data);
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
    else {
        try {
            if (imageInput.files.length == 0) {
                formData.delete("image");
            }
            errorDiv.classList.add('hide');
            errorMsg.innerText = '';
            errorMsg.classList.remove('active');
            let token = getCookie('admin_access');
            let headers = {
                "Authorization": `Bearer ${token}`
            };
            beforeLoad(button);
            let response = await requestAPI(`${apiURL}/admin/content/sliders/${id}`, formData, headers, 'PATCH');
            // console.log(response);
            response.json().then(function(res) {
                // console.log(res);
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
    row = e.target.closest('tr');
    if (dragSrcEl !== row) {
        let droppedUponRowOrder = row.getAttribute('data-id');
        let draggedRowOrder = dragSrcEl.getAttribute('data-id');
        // console.log(droppedUponRowOrder, draggedRowOrder);
        dragSrcEl.innerHTML = row.innerHTML;
        row.innerHTML = e.dataTransfer.getData('text/html');

        // let request1 = await requestAPI(`${apiURL}/admin/content/sliders/${draggedRowOrder}`, )
    }
}