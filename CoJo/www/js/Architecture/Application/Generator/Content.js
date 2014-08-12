function Content(inpData, inpCallback) {
    this.data = inpData;
    this.callback = inpCallback;
    this.sections = new Array();
    this.appendDiv;
    
    for(var i = 0; i < this.data.length; i++) {
        var newSection = new Section(this.data[i], this);
        this.sections.push(newSection);
    }
    
    this.currentSection = 0;
    
}

Content.prototype = {
    Render: function() {
            this.appendDiv.innerHTML = "";
            
            if (this.sections.length > 1) {
                var pageBarContainer = document.createElement("div");
                pageBarContainer.className = "pageBar";
                this.appendDiv.appendChild(pageBarContainer);
                
                for(i = 0; i < this.data.length; i++) {
                    var newSection = document.createElement("div");
                    if (i == this.currentSection) {
                        newSection.className = "pageBarItemSelected";
                    } else {
                        newSection.className = "pageBarItem";
                    }
                    newSection.id = i;
                    newSection.addEventListener("click", this.eventHandler.bind(this), false);
                    newSection.style.width = 320/this.data.length + "px";
                    
                    var text = document.createElement("p");
                    text.className = "pageBarText";
                    text.innerHTML = this.data[i].Name;
                    
                    newSection.appendChild(text)
                    
                    pageBarContainer.appendChild(newSection);
                }
            
            }
        
            this.sections[this.currentSection].Render(this.appendDiv);        
    },
    
    eventHandler: function(element) {
        if (element.target.id != "") {
            this.currentSection = element.target.id
        } else {
            this.currentSection = element.target.parentNode.id;
        }
        
        this.Render();     
    },
    
    RetrievedLocation: function(position) {
        this.callback.RetrievedLocation(position);
    },
    
    renderCanEdit: function() {
        this.callback.renderCanEdit();
    },
    
    // Called by the Navigation bar when the user clicks the 'Edit' button
    EnableEdit: function() {
        this.sections[this.currentSection].EnableEdit();
    },
    
    // Called by the Navigation bar when the user clicks the 'Done' button
    DoneEdit: function() {
        this.sections[this.currentSection].DoneEdit();
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
        this.callback.tabItemSelected(data);
    }
}