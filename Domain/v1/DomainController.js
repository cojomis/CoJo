function DomainController(inpCallback) {
    this.MediaBrowser = new MediaController(this);
    this.StorageC = new SQLDatabaseController(this);
    
    this.callback = inpCallback;
    this.URI = "";
    this.story = "";
}

DomainController.prototype = {
    
    Create: function(inp) {
        this.StorageC.Create(inp);
    },
    
    Read: function(inp) {
        this.StorageC.Read(inp);
    },
    
    Update: function(inp) {
        this.StorageC.Update(inp);
    },
    
    Delete: function(inp) {
        this.StorageC.Delete(inp);
    },
    
    handleResponse: function(res) {
        this.callback.handleResponse(res);
    },
    
    captureImage: function(storyID) {
        this.story = storyID;
        this.MediaBrowser.captureImage();
    },
    
    captureAudio: function(storyID) {
        this.MediaBrowser.captureAudio();
    },
    
    captueVideo: function(storyID) {
        this.MediaBrowser.captureVideo();
    },
    
    retrievedImage: function(inpURI) {
        this.URI = inpURI;
        $.getJSON("json/addImage.json", this.addImageJSON.bind(this));
    },
    
    addImageJSON: function(obj) {
        alert("GOT JSON");
        obj.Story[0].ID = this.story;
        obj.Story[0].Image[0].URI = this.URI;
        
        this.Create(obj);
        
    }
}