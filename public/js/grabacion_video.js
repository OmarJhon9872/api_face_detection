var recorder; // globally accessible

function captureCamera(callback) {
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function (camera) {
            callback(camera);
        })
        .catch(function (error) {
            alert(
                "Unable to capture your camera. Please check console logs."
            );
            console.error(error);
        });
}

// XHR2/FormData
function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
            
    request.open('POST', url);

    var formData = new FormData();
    formData.append('file', data);
    request.send(formData);
}

// this function submits recorded blob to nodejs server
function enviarGrabacion() {
    var blob = recorder.getBlob();
    // getting unique identifier for the file name
    var fileName = "Grabacion.webm";
    var file = new File([blob], fileName, {
        type: "video/webm",
    });
    xhr("/uploadFile", file, function (responseText) {
        var fileURL = JSON.parse(responseText).fileURL;                    
        document.querySelector("#footer-h2").innerHTML = '<a href="'+fileURL+'">'+fileURL+"</a>";
    }); 
}

async function stopRecordingCallback() {
    var enlace = URL.createObjectURL(recorder.getBlob());
    recorder.camera.stop();
    /* Guardar y enviar por post el video */
    await enviarGrabacion();
}



// document.getElementById("btn-start-recording").onclick = function () {
//     this.disabled = true;
//     captureCamera(function (camera) {
//         recorder = RecordRTC(camera, {
//             type: "video",
//         });
//         recorder.startRecording();
//         recorder.camera = camera;
//         document.getElementById("btn-stop-recording").disabled = false;
//     });
// };
// document.getElementById("btn-stop-recording").onclick = function () {
//     this.disabled = true;
//     recorder.stopRecording(stopRecordingCallback);
// };