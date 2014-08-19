// When a new Story is created, an object that relates to the Story JSON sturcture must be created and appended to the state array
function Story(inpHeadline) {
    var d = new Date();
    
    this.STORY_ID = "NEW";
    this.Headline = inpHeadline;
    this.Story_Date = d.toDateString();
    this.Story_time = d.toTimeString();
}


function MyStoriesAppController() {

    this.dController = new DomainController(this);
    
    this.oldState = "";
    this.newState = "";
        
    this.prepare();
}

MyStoriesAppController.prototype = {
    
    gotPageCreation: function(json) {
        json.Page.Section[0].Data.Data = this.newState.Story;
        this.navigation = new Navigation(json, this);
        this.navigation.Render(document.getElementById("appContainer"));
    },
    
    // Downloads the JSON request document which contains details on what data needs to be retrieved to populate the page
    prepare: function() {
        $.getJSON("json/My_Stories/prepare.json", this.gotJSON.bind(this));
    },
        
    gotJSON: function(json) {
        this.dController.Read(json);
    },
        
    // The Domain Controller callback when it has read some data from the database (in this case, the results of the prepare message)
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));
        
        //JSON file containing data to structure the page (see the Page Creation documentation)
        $.getJSON("json/My_Stories/CreatePage.json", this.gotPageCreation.bind(this));
    },
    
    navigateToPage: function(page, storyID) {
        var url = page + "?id=" + storyID;
        window.location = url;
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    // The Domain Controller callback when the new and old states have been compared and the storage system updated accordingly
    UpdateComplete: function() {
        window.location.reload();
    },
    
    RowSelected: function(data) {
        this.navigateToPage("summary.html", data.STORY_ID);
    },
    
    EventHandler: function(event) {
        switch (event.name) {
            case "additem": {
                this.CreateStory();
            }
            
            case "rowselected": {
                this.RowSelected(event.data);
            }
        }
    },
    
    // The Table Widget callback when the 'Add' row is selected. Adds a new Story to the this.newState
    CreateStory: function() {
        var newStory = new Story("NEW STORY");
        
        this.newState.Story.push(newStory);
               
        this.UpdateState();
    }

}