function AssociationsAppController() {
    //alert("In constructor");
    this.dController = new DomainController(this);

    
    this.oldState = "";
    this.newState = "";
        
    this.prepare();
    
}

AssociationsAppController.prototype = {
    
    gotPageCreation: function(json) {
        //alert("GOT PAGE");
        //alert(json.Page.Section[0].Name);
        json.Page.Section[0].Data.Data = this.newState.Story[0];
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        //alert("Getting JSON");
        $.getJSON("json/Associations/prepare.json", this.gotJSON.bind(this));
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
        
        $.getJSON("json/Test/CreateAssociations.json", this.gotPageCreation.bind(this));
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        window.location.reload();
    },
    
    RetrievedLocation: function(position) {
        //alert("updating loc");
        //alert(position.coords.latitude);
        this.newState.Story[0].Latitude = position.coords.latitude;
        this.newState.Story[0].Longitude = position.coords.longitude;

    },
    
    navigateToPage: function(page, storyID) {
        //alert("Go to page: " + page + " with ID " + storyID);
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    tabItemSelected: function(data) {
        if (data.id == "summary" || data.id == "media" || data.id == "index") {
            this.navigateToPage(data.id + ".html", this.newState.Story[0].STORY_ID);
        }
    }
}