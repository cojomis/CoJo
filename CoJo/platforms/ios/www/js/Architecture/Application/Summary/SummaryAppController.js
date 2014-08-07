function SummaryAppController() {
    //alert("In constructor");
    this.dController = new DomainController(this);
    //this.storiesTable = new Table("table", this);

    //alert(window.location);
    
    this.oldState = "";
    this.newState = "";
    
    //this.pageState = 0;
    this.next = "";
    
    
    this.prepare();
    
    //$.getJSON("json/Test/CreatePage.json", this.gotPageCreation.bind(this));
}

SummaryAppController.prototype = {
    
    gotPageCreation: function(json) {
        //alert("GOT PAGE");
        //alert(json.Page.Section[0].Name);
        json.Page.Section[0].Data.Data = this.newState.Story[0];
        json.Page.Section[1].Data.Data = this.newState.Story[0].Note;
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        //alert("Getting JSON");
        $.getJSON("json/Summary/prepare.json", this.gotJSON.bind(this));
    },
    
    gotJSON: function(json) {
        //alert(JSON.stringify(json));
        
        var loc = window.location.toString();
        //alert("LOCATION: " + loc);
        var storyID = loc.substr(loc.length-1, 1);
        json.Story[0].STORY_ID = storyID;
        
        this.dController.Read(json);
    },
    
    navigateToPage: function(page, storyID) {
        //alert("Go to page: " + page + " with ID " + storyID);
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));
        
        /*for(i = 0; i < res.Story.length; i++) {
            alert(res.Story[i].Headline);
            this.storiesTable.AddRow(res.Story[i].Headline, res.Story[i].STORY_ID);
        }*/
        
        $.getJSON("json/Test/CreateDetails.json", this.gotPageCreation.bind(this));
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        if (this.next.id == "associations" || this.next.id == "media" || this.next.id == "index") {
            this.navigateToPage(this.next.id + ".html", this.newState.Story[0].STORY_ID);
        }
    },
    
    RowSelected: function(data) {
        //this.UpdateState();
        
        //window.location = "media.html?id=" + this.newState.Story[0].STORY_ID;
    },
    
    tabItemSelected: function(data) {
        //alert(this.newState.Story[0].Note.length);
        this.next = data;
        this.UpdateState();
    }
    
}