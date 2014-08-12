function AssociationsAppController() {
    this.dController = new DomainController(this);
    
    this.oldState = "";
    this.newState = "";
        
    this.prepare();
    
}

AssociationsAppController.prototype = {
    
    gotPageCreation: function(json) {
        json.Page.Section[0].Data.Data = this.newState.Story[0];
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        $.getJSON("json/Associations/prepare.json", this.gotJSON.bind(this));
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
        
        $.getJSON("json/Associations/CreateAssociations.json", this.gotPageCreation.bind(this));
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        window.location.reload();
    },
    
    RetrievedLocation: function(position) {
        this.newState.Story[0].Latitude = position.coords.latitude;
        this.newState.Story[0].Longitude = position.coords.longitude;
    },
    
    navigateToPage: function(page, storyID) {
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    tabItemSelected: function(data) {
        if (data.id == "summary" || data.id == "media" || data.id == "index") {
            this.navigateToPage(data.id + ".html", this.newState.Story[0].STORY_ID);
        }
    }
}