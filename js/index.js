var videoSources = [];
var selectedVideoSourceIndex = null;
var context = null;
var video = null;
var cameraSetup = false;
var photos = [];
var entries = [];

// Camera
function sortOutSources() {
	MediaStreamTrack.getSources(function (sourceInfos) {
		for (var i = 0; i != sourceInfos.length; ++i) {
			var sourceInfo = sourceInfos[i];
			if (sourceInfo.kind === 'video') {
				videoSources.push(sourceInfo.id);
			}
		}
	});
}

sortOutSources();

function setupCamera() {
	// Grab elements, create settings, etc.
	video = document.getElementById("video");
	var videoObj = {
		video: { optional: [{ sourceId: videoSources[selectedVideoSourceIndex] }] }
	};

	var errBack = function (error) {
		console.log("Video capture error: ", error.code);
	};

	// Put video listeners into place
	if (navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function (stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function (stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	else if (navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function (stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
}

function cycleCameras() {
	selectedVideoSourceIndex++;
	if (selectedVideoSourceIndex === videoSources.length) {
		selectedVideoSourceIndex = 0;
	}
	setupCamera();
}

function takePhoto() {
	resetCameraButtons();

	var v = document.getElementById("video");
	var canvas = document.createElement('canvas');
	canvas.width = v.videoWidth;
	canvas.height = v.videoHeight;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
	var img = canvas.toDataURL("image/png");

	var fragment = "<div class=\"no-margin-or-padding photo-thumbnail\"><a><img class=\"thumbnail\" style=\"background-image: url('" + img + "');\"></a></div>";
	var div = document.getElementById("photos-content");
	div.innerHTML = div.innerHTML + fragment;

	photos.push(img.replace(/^data:image\/(png|jpg);base64,/, ""));
}

function openCamera() {
	if (!cameraSetup) {
		selectedVideoSourceIndex = videoSources.length - 1;
		setupCamera();
		cameraSetup = true;
	}
	$(document.getElementById("new")).hide();
	$(document.getElementById("video")).show();
	$(document.getElementById("snap")).show();
	if (videoSources.length > 1) {
		$(document.getElementById("switch")).show();
	}
}

// HTML
function resetCameraButtons() {
	$(document.getElementById("new")).show();
	$(document.getElementById("video")).hide();
	$(document.getElementById("snap")).hide();
	$(document.getElementById("switch")).hide();
}
