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
    //alert("In constructor");
    this.dController = new DomainController(this);
    //this.storiesTable = new Table("table", this);

    //alert(window.location);
    
    this.oldState = "";
    this.newState = "";
    
    //this.pageState = 0;
    
    this.prepare();
    
    //$.getJSON("json/Test/CreatePage.json", this.gotPageCreation.bind(this));
}

MediaAppController.prototype = {
    
    gotPageCreation: function(json) {
        //alert("GOT PAGE");
        //alert(json.Page.Section[0].Name);
        json.Page.Section[0].Data.Data = this.newState.Story[0].Image;
        json.Page.Section[1].Data.Data = this.newState.Story[0].Video;
        json.Page.Section[2].Data.Data = this.newState.Story[0].Audio;
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        //alert("Getting JSON");
        $.getJSON("json/Media/prepare.json", this.gotJSON.bind(this));
    },
    
    gotJSON: function(json) {
        //alert(JSON.stringify(json));
        
        var loc = window.location.toString();
        //alert("LOCATION: " + loc);
        var storyID = loc.substr(loc.length-1, 1);
        json.Story[0].STORY_ID = storyID;
        
        this.dController.Read(json);
    },
    
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));
        
        /*for(i = 0; i < res.Story.length; i++) {
            alert(res.Story[i].Headline);
            this.storiesTable.AddRow(res.Story[i].Headline, res.Story[i].STORY_ID);
        }*/
        
        $.getJSON("json/Test/CreateMedia.json", this.gotPageCreation.bind(this));
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        window.location.reload();
    },
    
    RowSelected: function(data) {
        this.UpdateState();
    },
    
    AddPicture: function() {
        this.dController.captureImage(this.newState.Story[0].STORY_ID);
    },
    
    AddVideo: function() {
        this.dController.captureVideo(this.newState.Story[0].STORY_ID);
    },
    
    AddAudio: function() {
        this.dController.captureAudio(this.newState.Story[0].STORY_ID);
    },
    
    retrievedImage: function(URI) {
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
        //alert("Go to page: " + page + " with ID " + storyID);
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    tabItemSelected: function(data) {
        if (data.id == "summary" || data.id == "associations" || data.id == "index") {
            this.navigateToPage(data.id + ".html", this.newState.Story[0].STORY_ID);
        }
    }

}