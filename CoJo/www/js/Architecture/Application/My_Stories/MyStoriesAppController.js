function Story(inpHeadline) {
    this.STORY_ID = "NEW";
    this.Headline = inpHeadline;
}

function MyStoriesAppController() {
    alert("In constructor");
    this.dController = new DomainController(this);
    this.storiesTable = new Table("table", this);

    alert(window.location);
    
    this.oldState = "";
    this.newState = "";
    
    this.pageState = 0;
    
    this.prepare();
}

MyStoriesAppController.prototype = {
    prepare: function() {
        alert("Getting JSON");
        $.getJSON("json/My_Stories/prepare.json", this.gotJSON.bind(this));
    },
    
    gotJSON: function(json) {
        alert(JSON.stringify(json));
        this.dController.Read(json);
    },
    
    readCallback: function(res) {
        this.oldState = JSON.parse(JSON.stringify(res));
        this.newState = JSON.parse(JSON.stringify(res));
        
        for(i = 0; i < res.Story.length; i++) {
            alert(res.Story[i].Headline);
            this.storiesTable.AddRow(res.Story[i].Headline, res.Story[i].STORY_ID);
        }
    },
    
    navigateToPage: function(page, storyID) {
        alert("Go to page: " + page + " with ID " + storyID);
    },
    
    UpdateState: function() {
        this.dController.UpdateState(this.newState, this.oldState);
    },
    
    UpdateComplete: function() {
        window.location.reload();
    },
    
    RowSelected: function(storyID) {
        for (i = 0; i < this.newState.Story.length; i++) {
            if (this.newState.Story[i].STORY_ID == storyID) {
                this.navigateToPage('summary.html', this.newState.Story[i].STORY_ID);
            }
        }
    },
    
    AddListener: function() {
        var newStory = new Story("NEW STORY");
        this.newState.Story.push(newStory);
        
        this.UpdateState();
    },
    
    togglePageState: function() {
        if (!this.pageState) {
            this.pageState = 1;
            
            var editOptions = document.getElementById("EditOptions");
            editOptions.style.display = "block";
            
            var editButton = document.getElementById("Edit");
            editButton.style.display = "none";
            
            var doneButton = document.getElementById("Done");
            doneButton.style.display = "block";
            
            this.storiesTable.SetState(1);
        } else {
            this.pageState = 0;
            
            var editOptions = document.getElementById("EditOptions");
            editOptions.style.display = "none";
            
            var editButton = document.getElementById("Edit");
            editButton.style.display = "block";
            
            var doneButton = document.getElementById("Done");
            doneButton.style.display = "none";
            
            this.storiesTable.SetState(0);
            
            this.UpdateState();
        }
        
        alert("Done");
        
    },
    
    deleteFromTable: function() {
        this.storiesTable.DeleteSelectedItems();
    },
    
    deleteFromState: function(inpID) {
        alert("DELETING: " + inpID);
        for (i = 0; i < this.newState.Story.length; i++) {
            if (this.newState.Story[i].STORY_ID == inpID) {
                this.newState.Story.splice(i,1);
            }
        }
        
        //this.UpdateState();
        
        //alert(JSON.stringify(this.newState));
    }
}