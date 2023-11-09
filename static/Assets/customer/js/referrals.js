let requiredDataURL = `${apiURL}/admin/referrals?page=1&perPage=1000`;

window.onload = () => {
    getData();
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
    let tableBody = document.getElementById('referrals-table');
    try {
        // let resp = await requestAPI(requiredDataURL, null, headers, 'GET');
        // // console.log(resp);
        // resp.json().then(function(res) {
        //     console.log(res);
        // })
        let response = await requestAPI('/get-referrals-list/', JSON.stringify(data), {}, 'POST');
        response.json().then(function(res) {
            // console.log(res);
            if (res.success) {
                document.getElementById('table-loader').classList.add('hide');
                tableBody.innerHTML = res.referrals_data;
                tableBody.classList.remove('hide');
            }
        })
    }
    catch (err) {
        console.log(err);
    }
}