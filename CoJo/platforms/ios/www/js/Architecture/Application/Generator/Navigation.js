function Navigation(inpData, inpCallback, appendDiv) {
    this.data = inpData;
    this.callback = inpCallback;

    
    this.content = new Content(this.data.Page.Section, this);
}

Navigation.prototype = {
    Render: function(appendDiv) {
        
        //alert("render nav");
        var navigationBar = document.createElement("div");
        navigationBar.className = "topNavigationBar";
        navigationBar.id = "topNavigationBar";
        appendDiv.appendChild(navigationBar);
        
        var navigationTitle = document.createElement("div");
        navigationTitle.className = "navBarTitle";
        
        var navTitle = document.createElement("p");
        navTitle.className = "navTitle";
        navTitle.innerHTML = this.data.Page.Name;
        navigationTitle.appendChild(navTitle);
        navigationBar.appendChild(navigationTitle);
        
        var contentBox = document.createElement("div");
        contentBox.className = "contentBox";
        appendDiv.appendChild(contentBox);
        
        this.content.appendDiv = contentBox;
        
        //alert("after appending");
        
        this.content.Render();
    },
    
    renderCanEdit: function() {
        var navigationBar = document.getElementById("topNavigationBar");
        var editButton = document.createElement("div");
        editButton.className = "rightNavBarItem";
        
        var text = document.createElement("p");
        text.className = "navBarItem";
        text.innerHTML = "Edit";
        
        editButton.appendChild(text);
        
        editButton.addEventListener('click', this.editHandler.bind(this), false);
        
        navigationBar.appendChild(editButton);
    },
    
    editHandler: function(element) {
        if (element.target.innerHTML == "Edit") {
            element.target.innerHTML = "Done";
            this.content.EnableEdit();
        } else {
            element.target.innerHTML = "Edit";
            this.callback.UpdateState();
            this.content.DoneEdit();
        }
    },
    
    RetrievedLocation: function(position) {
        alert("navigation location");
        this.callback.RetrievedLocation(position);
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
        //alert("NAVIGATION TAB ITEM SELECTED");
        this.callback.tabItemSelected(data);
    }
}