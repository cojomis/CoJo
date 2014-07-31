function Content(inpData, inpCallback) {
    this.data = inpData;
    this.callback = inpCallback;
    this.sections = new Array();
    this.appendDiv;
    
    alert("LENGTH: " + this.data.length);

    for(var i = 0; i < this.data.length; i++) {
        alert("Creating section");
        var newSection = new Section(this.data[i], this);
        this.sections.push(newSection);
    }
    
    this.currentSection = 0;
    
}

Content.prototype = {
    Render: function() {
            alert("DIV: " + this.appendDiv);
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
                    newSection.innerHTML = this.data[i].Name;
                    pageBarContainer.appendChild(newSection);
                }
            
            }
        
            
            this.sections[this.currentSection].Render(this.appendDiv);
        
            
    },
    
    eventHandler: function(element) {
        alert(element.target.id);
        this.currentSection = element.target.id;
        this.Render();
        
    },
    
    renderCanEdit: function() {
        this.callback.renderCanEdit();
    },
    
    EnableEdit: function() {
        alert("CONTENT EDIT");
        this.sections[this.currentSection].EnableEdit();
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
        alert("CONTENT TAB ITEM SELECTED");
        this.callback.tabItemSelected(data);
    }
}