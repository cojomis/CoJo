function DomainController(inpCallback) {

    this.MediaBrowser = new MediaController(this);
    this.StorageC = new SQLStorageController(this);
    this.fileIO = new FileIO(this);
    
    this.callback = inpCallback;
    this.URI = "";
    this.story = "";
    
    this.mediaType;
}

DomainController.prototype = {
    
    // Called whenever a the state of the view changes (Create, Update, Delete). The before and after states are compared and SQL statements are executed to bring the database into a state consistent with the new state
    UpdateState: function(newstate,oldstate) {
        this.StorageC.UpdateState(newstate,oldstate);
    },
    
    // Retrieves information from the database. It takes a Javascript object created from a JSON file, detailing what should be retrieved
    Read: function(inp) {
        this.StorageC.Read(inp);        
    },
    
    UpdateComplete: function() {
        this.callback.UpdateComplete();  
    },
    
    // Called by the StorageController when the results from a read operation have been returned from the database (SQLResultSet)
    readCallback: function(res) {
        this.callback.readCallback(res);
    },
    
    captureImage: function(storyID) {
        this.story = storyID;
        this.MediaBrowser.captureImage();
    },
    
    captureAudio: function(storyID) {
        this.story = storyID;
        this.MediaBrowser.captureAudio();
    },
    
    captureVideo: function(storyID) {
        this.story = storyID;
        this.MediaBrowser.captureVideo();
    },
    
    retrievedImage: function(inpURI) {
        this.URI = inpURI;
        this.mediaType = "Image";
        this.fileIO.ResolvePermURI(inpURI.fullPath);
    },
    
    retrievedVideo: function(inpURI) {
        this.URI = inpURI;
        this.mediaType = "Video";
        this.fileIO.ResolvePermURI(inpURI.fullPath);
    },
    
    retrievedAudio: function(inpURI) {
        this.URI = inpURI;
        this.mediaType = "Audio";
        this.fileIO.ResolvePermURI(inpURI.fullPath);
    },
    
    permSuccess: function(URI) {
        switch (this.mediaType) {
            case "Image": {
                this.callback.retrievedImage(URI);
                break;
            }
            
            case "Video": {
                this.callback.retrievedVideo(URI);
                break;
            }
            
            case "Audio": {
                //alert(URI);
                this.callback.retrievedAudio(URI);
                break
            }
        }
    }
    
}