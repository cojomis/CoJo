function SummaryAppController() {
    this.dController = new DomainController(this);
    
    this.oldState = "";
    this.newState = "";
    
    // When the user navigates away from this page, UpdateState must be called as there is no edit->done flow, therefore, once the update is complete (UpdateComplete), we can navigate to the intended page, buffered in next
    this.next = "";
        
    this.prepare();
    
}

SummaryAppController.prototype = {
    
    gotPageCreation: function(json) {
        
        // Section 0 refers to the Story details (Headline, date, etc)
        json.Page.Section[0].Data.Data = this.newState.Story[0];
        // Section 1 refers to the note associated with the Story
        json.Page.Section[1].Data.Data = this.newState.Story[0].Note;
        
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        $.getJSON("json/Summary/prepare.json", this.gotJSON.bind(this));
    },
    
    gotJSON: function(json) {
        
        // Retrieve the Story ID from the request URI
        var loc = window.location.toString();
        var i = loc.length;
        while (loc[i] != '=') {
            i--;
        }
        
        var storyID = loc.substr(i+1, (loc.length-1)-i);
        
        json.Story[0].STORY_ID = storyID;
        
        this.dController.Read(json);
    },
    
    navigateToPage: function(page, storyID) {
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));

        $.getJSON("json/Summary/CreateDetails.json", this.gotPageCreation.bind(this));
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        if (this.next.id == "associations" || this.next.id == "media" || this.next.id == "index") {
            this.navigateToPage(this.next.id + ".html", this.newState.Story[0].STORY_ID);
        }
    },
    
    tabItemSelected: function(data) {
        this.next = data;
        this.UpdateState();
    }
    
}