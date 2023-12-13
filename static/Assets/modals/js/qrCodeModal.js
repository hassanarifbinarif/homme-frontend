function openQRCodeModal(event, modalId, referralCode, qrCodeString) {
    event.stopPropagation();
    let modal = document.getElementById(`${modalId}`);
    modal.querySelector('#modal-referral-code').innerText = referralCode;
    modal.querySelector('#modal-qr-code').src = `data:image/png;base64,${qrCodeString}`;
    modal.addEventListener('hidden.bs.modal', event => {
        modal.querySelector('#modal-referral-code').innerText = '';
        modal.querySelector('#modal-qr-code').src = '';  
    })
    document.querySelector(`.${modalId}`).click();
}