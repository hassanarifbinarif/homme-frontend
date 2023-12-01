function verifyEventImage(input) {
    if (input.files.length > 0) {
        let label = input.closest('label');
        let width = 330;
        let height = 330;
        const img = document.createElement('img');
        const selectedImage = input.files[0];
        const objectURL = URL.createObjectURL(selectedImage);
        let imageTag = label.querySelector('.event-img');
        img.onload = function handleLoad() {
            // console.log(`Width: ${img.width}, Height: ${img.height}`);
    
            if (img.width == width && img.height == height) {
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
                console.log('Image dimensions donot match');
                imageTag.classList.add('hide');
                label.querySelector('svg').style.display = 'block';
                label.querySelectorAll('span').forEach((span) => {
                    span.style.display = 'block';
                })
                input.value = null;
            }
        };
  
        img.src = objectURL;
    }
}


function previewImage(event) {
    let imageInput = event.currentTarget;
    let image = imageInput.files;
    let imageTag = imageInput.closest('label').querySelector('.event-img');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.classList.remove('hide');
    imageInput.closest('label').querySelector('svg').style.display = 'none';
    imageInput.closest('label').querySelectorAll('span').forEach((span) => {
        span.style.display = 'none';
    })
}


async function createEventForm(event) {
    event.preventDefault();
    console.log(event);
}