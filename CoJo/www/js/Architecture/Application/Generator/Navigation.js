function Navigation(inpData, inpCallback, appendDiv) {
    this.data = inpData;
    this.callback = inpCallback;

    
    this.content = new Content(this.data.Page.Section, this);
}

Navigation.prototype = {
    Render: function(appendDiv) {
        appendDiv.innerHTML = "";

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
                
        this.content.Render();
    },
    
    renderCanEdit: function() {
        var remEdit = document.getElementsByClassName("rightNavBarItem");
        if (remEdit.length > 0) {
            remEdit[0].parentNode.removeChild(remEdit[0]);
        }
        
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
        this.callback.RetrievedLocation(position);
    },
    
    EventHandler: function(event) {
        this.callback.EventHandler(event);
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
    
    tabItemSelected: function(data) {
        this.callback.tabItemSelected(data);
    }
}