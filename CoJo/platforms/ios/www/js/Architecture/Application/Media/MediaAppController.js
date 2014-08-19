function NewImage(inpURI) {
    this.ID = "NEW";
    this.URI = inpURI;
}

function NewVideo(inpURI) {
    this.ID = "NEW";
    this.URI = inpURI;
}

function NewAudio(inpURI) {
    this.ID = "NEW";
    this.URI = inpURI;
}

function MediaAppController() {
    this.dController = new DomainController(this);
    
    this.oldState = "";
    this.newState = "";
        
    this.prepare();
    
}

MediaAppController.prototype = {
    
    gotPageCreation: function(json) {

        json.Page.Section[0].Data.Data = this.newState.Story[0].Image;
        json.Page.Section[1].Data.Data = this.newState.Story[0].Video;
        json.Page.Section[2].Data.Data = this.newState.Story[0].Audio;
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        $.getJSON("json/Media/prepare.json", this.gotJSON.bind(this));
    },
    
    gotJSON: function(json) {
        
        var loc = window.location.toString();
        var i = loc.length;
        while (loc[i] != '=') {
            i--;
        }
        
        var storyID = loc.substr(i+1, (loc.length-1)-i);
        
        json.Story[0].STORY_ID = storyID;
        
        this.dController.Read(json);
    },
    
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));
        
        $.getJSON("json/Media/CreateMedia.json", this.gotPageCreation.bind(this));
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        window.location.reload();
    },
    
    EventHandler: function(event) {
        switch (event.name) {
            case "addmedia": {
                alert("add media");
                if (event.data == "Image") {
                    this.dController.captureImage(this.newState.Story[0].STORY_ID);
                } else if (event.data == "Video") {
                    this.dController.captureVideo(this.newState.Story[0].STORY_ID);
                } else if (event.data == "Audio") {
                    this.dController.captureAudio(this.newState.Story[0].STORY_ID);
                }
            }
        }
    },
    
    retrievedImage: function(URI) {
        alert("URI: " + URI);
        var nImg = new NewImage(URI);
        this.newState.Story[0].Image.push(nImg);
        
        this.UpdateState();
    },
    
    retrievedVideo: function(URI) {
        var nImg = new NewVideo(URI);
        this.newState.Story[0].Video.push(nImg);
        
        this.UpdateState();
    },
    
    retrievedAudio: function(URI) {
        var nAud = new NewAudio(URI);
        this.newState.Story[0].Audio.push(nAud);
        
        this.UpdateState();
    },
    
    navigateToPage: function(page, storyID) {
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    tabItemSelected: function(data) {
        if (data.id == "summary" || data.id == "associations" || data.id == "index") {
            this.navigateToPage(data.id + ".html", this.newState.Story[0].STORY_ID);
        }
    }

}