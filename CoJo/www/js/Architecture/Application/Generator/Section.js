function Section(inpData, inpCallback) {
    this.data = inpData;
    this.callback = inpCallback;
    this.widget = "";
    
    if (this.data.Type == "Table") {
        this.widget = new TableWidget(inpData.Data, this);
    } else if (this.data.Type == "Gallery") {
        this.widget = new GalleryWidget(inpData.Data, this, this.data.SubType);
    }
    
    this.tabBar = new ViewTabBar(this);
    
    
}

Section.prototype = {
    Render: function(appendDiv) {
        alert("REND SECTION");

        var widgetContainer = document.createElement("div");
        widgetContainer.className = "widgetContainer";
        appendDiv.appendChild(widgetContainer);
        
        if (this.data.canEdit == "True") {
            this.callback.renderCanEdit();
        }
        
        this.widget.appendDiv = widgetContainer;
        alert("WIDGET");
        this.widget.Render();
        
        alert("after");
        
        var tabBarContainer = document.createElement("div");
        tabBarContainer.className = "tabBarContainer";
        appendDiv.appendChild(tabBarContainer);
        this.tabBar.Render(tabBarContainer);
        
    },
    
    EnableEdit: function() {
        alert("SECITON EDIT");
        this.widget.EnableEdit();
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
        alert('SECTION TAB ITEM SELECTED');
        this.callback.tabItemSelected(data);
    }
}