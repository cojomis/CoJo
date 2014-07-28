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
        alert("READ");
        this.StorageC.Read(inp);
        
        alert("Done");
    },
    
    UpdateComplete: function() {
        this.callback.UpdateComplete();  
    },
    
    // Called by the StorageController when the results from a read operation have been returned from the database (SQLResultSet)
    readCallback: function(res) {
        this.callback.readCallback(res);
        //alert(res.rows.item(0).URI);
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
        // PASS TO APPLICATION LAYER
    },
    
    retrievedVideo: function(inpURI) {
        alert("RETRIEVED VIDEO");
        // PASS TO APPLICATION LAYER
    },
    
    retrievedAudio: function(inpURI) {
        alert("RETRIEVED AUDIO");
        // PASS TO APPLICATION LAYER
    },
    
}