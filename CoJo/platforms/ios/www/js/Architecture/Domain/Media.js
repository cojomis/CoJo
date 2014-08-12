function MediaController(inpCallback) {
    this.callback = inpCallback
}

MediaController.prototype = {
    
    captureImage: function() {
        navigator.device.capture.captureImage(this.captureImageSuccess.bind(this), this.captureFailure);
    },
    
    captureAudio: function() {
        navigator.device.capture.captureAudio(this.captureAudioSuccess.bind(this), this.captureFailure);  
    },
    
    captureVideo: function() {
        navigator.device.capture.captureVideo(this.captureVideoSuccess.bind(this), this.captureFailure);
    },
    
    captureImageSuccess: function(mediaFiles) {
        this.callback.retrievedImage(mediaFiles[0].fullPath);
    },
    
    captureVideoSuccess: function(mediaFiles) {
        this.callback.retrievedVideo(mediaFiles[0].fullPath);
    },
    
    captureAudioSuccess: function(mediaFiles) {
        this.callback.retrievedAudio(mediaFiles[0].fullPath);
    },
    
    captureFailure: function(error) {
        alert("CAPTURE FAILURE");
    }
}
