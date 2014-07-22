function MediaController(inpCallback) {
    this.callback = inpCallback
}

MediaController.prototype = {
    
    captureImage: function() {
        alert("Capturing");
        navigator.device.capture.captureImage(this.captureSuccess.bind(this), this.captureFailure);
    },
    
    captureAudio: function() {
        navigator.device.capture.captureAudio(this.captureSuccess.bind(this), this.captureFailure);  
    },
    
    captureVideo: function() {
        navigator.device.capture.captureVideo(this.captureSuccess.bind(this), this.captureFailure);
    },
    
    captureSuccess: function(mediaFiles) {
        alert("Success");
        this.callback.retrievedImage(mediaFiles[0].fullPath);
    },
    
    captureFailure: function(error) {
        
    }
}