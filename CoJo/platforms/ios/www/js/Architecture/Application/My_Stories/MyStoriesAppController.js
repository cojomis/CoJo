function Story(inpHeadline) {
    var d = new Date();
    
    this.STORY_ID = "NEW";
    this.Headline = inpHeadline;
    this.Story_Date = d.toDateString();
    this.Story_time = d.toTimeString();
}


function MyStoriesAppController() {
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

MyStoriesAppController.prototype = {
    
    gotPageCreation: function(json) {
        //alert("GOT PAGE");
        //alert(json.Page.Section[0].Name);
        json.Page.Section[0].Data.Data = this.newState.Story;
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    prepare: function() {
        //alert("Getting JSON");
        $.getJSON("json/My_Stories/prepare.json", this.gotJSON.bind(this));
    },
    
    gotJSON: function(json) {
        //alert(JSON.stringify(json));
        this.dController.Read(json);
    },
    
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));
        
        $.getJSON("json/Test/CreatePage.json", this.gotPageCreation.bind(this));
    },
    
    navigateToPage: function(page, storyID) {
        //alert("Go to page: " + page + " with ID " + storyID);
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        window.location.reload();
    },
    
    RowSelected: function(data) {
        //alert("ROW SELECTED WITH STORY ID: " + data.STORY_ID);
        var url = "summary.html?id=" + data.STORY_ID;
        window.location = url;
    },
    
    
    AddItem: function() {
        var newStory = new Story("NEW STORY");
        
        this.newState.Story.push(newStory);
               
        this.UpdateState();
    }

}