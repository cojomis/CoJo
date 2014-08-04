function Section(inpData, inpCallback) {
    this.data = inpData;
    this.callback = inpCallback;
    this.widget = "";
    
    if (this.data.Type == "Table") {
        this.widget = new TableWidget(inpData.Data, this);
    } else if (this.data.Type == "Gallery") {
        this.widget = new GalleryWidget(inpData.Data, this, this.data.SubType);
    } else if (this.data.Type == "Map") {
        this.widget = new MapWidget(inpData.Data, this);
    }
    
    this.tabMode = "";
    this.tabBar = new ViewTabBar(this);
    
    
}

Section.prototype = {
    Render: function(appendDiv) {
        //alert("REND SECTION");

        var widgetContainer = document.createElement("div");
        widgetContainer.className = "widgetContainer";
        appendDiv.appendChild(widgetContainer);
        
        if (this.data.TabBar.Edit.canEdit == "True") {
            this.callback.renderCanEdit();
        }
        
        this.widget.appendDiv = widgetContainer;
        //alert("WIDGET");
        this.widget.Render();
        
        //alert("after");
        
        var tabBarContainer = document.createElement("div");
        tabBarContainer.className = "tabBarContainer";
        appendDiv.appendChild(tabBarContainer);
        
        if (this.data.TabBar.viewBar == "True") {
            this.tabBar.Render(tabBarContainer);
        }
        
    },
    
    RetrievedLocation: function(position) {
        alert("section location");
        this.callback.RetrievedLocation(position);
    },
    
    EnableEdit: function() {
        alert("enable edit");
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
    
    RowSelected: function(data) {
        this.callback.RowSelected(data);
    },
    
    tabItemSelected: function(data) {
        if (data.id == "delete") {
            this.widget.DeleteSelectedItems();
        } else if (data.id == "geolocate") {
            alert("get current position");
            this.widget.GetCurrentLocation();
        }
        
        else {
            this.callback.tabItemSelected(data);
        }
    }
}