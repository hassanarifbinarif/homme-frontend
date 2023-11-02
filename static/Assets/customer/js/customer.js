let requiredDataURL = `${apiURL}/admin/user-profiles?user__is_blocked=false&perPage=1000`;

window.onload = () => {
    getData();
}

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    urlParams = setParams(requiredDataURL, 'search', `${data.search}`);
    // getData(urlParams);
}


async function getData(url=null) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`
    }
    let data;
    if (url == null) {
        data = requiredDataURL;
    }
    else {
        data = url
    }
}