function DomainController(inpCallback) {

    this.MediaBrowser = new MediaController(this);
    this.StorageC = new SQLStorageController(this);
    
    this.callback = inpCallback;
    this.URI = "";
    this.story = "";
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
        this.callback.retrievedImage(inpURI);
    },
    
    retrievedVideo: function(inpURI) {
        this.URI = inpURI;
        this.callback.retrievedVideo(inpURI);
    },
    
    retrievedAudio: function(inpURI) {
        this.URI = inpURI;
        this.callback.retrievedAudio(inpURI);
    }
    
}