function DomainController(inpCallback) {
    //this.MediaBrowser = new MediaController(this);
    alert("iN DOMAIN CONS");
    this.StorageC = new StorageController(this);
    
    //this.callback = inpCallback;
    this.URI = "";
    this.story = "";
}

DomainController.prototype = {
    
    UpdateState: function(newstate,oldstate) {
        this.StorageC.UpdateState(newstate,oldstate);
    },
    
    Read: function(inp) {
        this.StorageC.Read(inp);
    },
    
    handleResponse: function(res) {
        //this.callback.handleResponse(res);
        alert(res.rows.item(15).URI);
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
        alert("domain controller");
        this.story = storyID;
        this.MediaBrowser.captureVideo();
    },
    
    retrievedImage: function(inpURI) {
        this.URI = inpURI;
        $.getJSON("json/addImage.json", this.addImageJSON.bind(this));
    },
    
    retrievedVideo: function(inpURI) {
        alert("RETRIEVED VIDEO");
        this.URI = inpURI;
        $.getJSON("json/addVideo.json", this.addVideoJSON.bind(this));
    },
    
    retrievedAudio: function(inpURI) {
        alert("RETRIEVED AUDIO");
        this.URI = inpURI;
        $.getJSON("json/addAudio.json", this.addAudioJSON.bind(this));
    },
    
    addImageJSON: function(obj) {
        alert("GOT JSON");
        obj.Story[0].ID = this.story;
        obj.Story[0].Image[0].URI = this.URI;
        
        this.Create(obj);
        
    },
    
    addVideoJSON: function(obj) {
        obj.Story[0].ID = this.story;
        obj.Story[0].Video[0].URI = this.URI;
        
        this.Create(obj);
    },
    
    addAudioJSON: function(obj) {
        obj.Story[0].ID = this.story;
        obj.Story[0].Audio[0].URI = this.URI;
        
        this.Create(obj);
    }
}