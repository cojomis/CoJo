function Section(inpData, inpCallback) {
    this.data = inpData;
    this.callback = inpCallback;
    this.widget = "";
    
    // Reads the type from the configuration JSON file to determine what widget should be used to display the data for the specific section
    if (this.data.Type == "Table") {
        this.widget = new TableWidget(inpData.Data, this, this.data.SubType);
    } else if (this.data.Type == "Gallery") {
        this.widget = new GalleryWidget(inpData.Data, this, this.data.SubType);
    } else if (this.data.Type == "Map") {
        this.widget = new MapWidget(inpData.Data, this);
    } else if (this.data.Type == "Note") {
        this.widget = new NoteWidget(inpData.Data, this);
    }
    
    this.tabMode = "";
    this.tabBar = new ViewTabBar(this); 
}

Section.prototype = {
    Render: function(appendDiv) {

        var widgetContainer = document.createElement("div");
        widgetContainer.className = "widgetContainer";
        appendDiv.appendChild(widgetContainer);
        
        // If the JSON configuration file states that this section has 'edit' functionality, the content section and subsequent navigation bar needs to be informed (to display an edit button)
        if (this.data.TabBar.Edit.canEdit == "True") {
            this.callback.renderCanEdit();
        }
        
        this.widget.appendDiv = widgetContainer;

        this.widget.Render();
                
        var tabBarContainer = document.createElement("div");
        tabBarContainer.className = "tabBarContainer";
        appendDiv.appendChild(tabBarContainer);
        
        // If the JSON configuration file states that the basic tab bar should be present, render it onto the screen
        if (this.data.TabBar.viewBar == "True") {
            this.tabBar.Render(tabBarContainer);
        }
        
    },
    
    RetrievedLocation: function(position) {
        this.callback.RetrievedLocation(position);
    },
    
    EnableEdit: function() {
        var tabBarCont = document.getElementsByClassName("tabBarContainer");
        
        if (this.data.TabBar.Edit.Type == "Basic") {
            this.tabBar = new BasicEditTabBar(this);
        } else if (this.data.TabBar.Edit.Type == "Map") {
            this.tabBar = new MapEditTabBar(this);
        }
        
        this.tabBar.Render(tabBarCont[0]);
        this.widget.EnableEdit();
    },
    
    DoneEdit: function() {
        // IS THIS NEEDED WITH PAGE RELOAD?
    },
    
    AddItem: function() {
        this.callback.AddItem();
    },
    
    AddPicture: function() {
        this.callback.AddPicture();
    },
    
    AddVideo: function() {
        this.callback.AddVideo();
    },
    
    AddAudio: function() {
        this.callback.AddAudio();
    },
    
    RowSelected: function(data) {
        this.callback.RowSelected(data);
    },
    
    tabItemSelected: function(data) {
        if (data.id == "delete") {
            this.widget.DeleteSelectedItems();
        } else if (data.id == "geolocate") {
            //alert("get current position");
            this.widget.GetCurrentLocation();
        }
        
        else {
            this.callback.tabItemSelected(data);
        }
    }
}