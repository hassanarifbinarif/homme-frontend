let requiredDataURL = `${apiURL}/admin/marketings?page=1&perPage=1000&ordering=-created_at`;

window.onload = () => {
    getData();
    populateDropdowns();
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
    let tableBody = document.getElementById('marketing-table');
    try {
        // let resp = await requestAPI(requiredDataURL, null, headers, 'GET');
        // // console.log(resp);
        // resp.json().then(function(res) {
        //     console.log(res);
        // })
        let response = await requestAPI('/get-marketing-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.marketing_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}