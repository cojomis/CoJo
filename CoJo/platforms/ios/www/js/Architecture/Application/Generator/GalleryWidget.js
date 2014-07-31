function ImageItem(inpData, inpDisplayProperty, inpCallback) {
    alert("CREATING TABLE ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    
}

ImageItem.prototype = {

    Render: function(appendDiv) {
        alert("Rendering element");
        var rowDiv = document.createElement("div");
        rowDiv.className = "thumbnailDiv";
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    var img = document.createElement("img");
                    img.src = this.data[prop];
                    img.className = "thumbnail";
                    rowDiv.appendChild(img);
                }
            }
        }
        
        appendDiv.appendChild(rowDiv);
        
        rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    eventHandler: function(element) {
        alert(this.data.constructor.name)
        if (this.data.constructor.name == "ManualImageRow") {

            alert("ADD ITEM");
            if (this.data.type == "Image") {
                this.callback.AddPicture();
            } else {
                this.callback.AddVideo();
            }
            
            
        } else {
            if (this.callback.state == 1) {
                // ADD SELECTED ITEM
            } else {
                this.callback.RowSelected(this.data);
            }
        }
        
    }
}

function VideoItem(inpData, inpDisplayProperty, inpCallback) {
    alert("CREATING VIDEO ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    
}

VideoItem.prototype = {

    Render: function(appendDiv) {
        alert("Rendering element");
        var rowDiv = document.createElement("div");
        rowDiv.className = "thumbnailDiv";
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    var video = document.createElement("video");
                    video.width = "100";
                    video.height = "100";
                    video.className = "thumbnail";
                    video.src = this.data[prop];
                    rowDiv.appendChild(video);
                }
            }
        }
        
        appendDiv.appendChild(rowDiv);
        
        rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    eventHandler: function(element) {
        alert(this.data.constructor.name)
        if (this.data.constructor.name == "ManualImageRow") {

            alert("ADD ITEM");
            this.callback.AddVideo();
            
        } else {
            if (this.callback.state == 1) {
                // ADD SELECTED ITEM
            } else {
                this.callback.RowSelected(this.data);
            }
        }
        
    }
}

function ManualImageRow(inpData, inpType) {
    this.data = inpData;
    this.type = inpType;
}

function GalleryWidget(inpData, inpCallback, inpType) {
    alert("GW CONST");
    this.data = inpData;

    this.rows = new Array();
    this.appendDiv;
    this.state = 0;
    this.type = inpType;
    
    this.callback = inpCallback;
    
    //alert("IDENT: " + this.data.Identifier);
    //alert("TYPE: " + Object.prototype.toString.call(this.data.Data));
    
    if (Object.prototype.toString.call(this.data.Data) == '[object Array]') {
        alert("is array");
        for (i = 0; i < this.data.Data.length; i++) {
            var newItem = "";
            if (this.type == "Image") {
                alert('Creating IMAGE gallery');
                newItem = new ImageItem(this.data.Data[i], this.data.Value, this);

            } else {
                alert("Creating Video gallery");
                newItem = new VideoItem(this.data.Data[i], this.data.Value, this);
            }
            
            this.rows.push(newItem);
        }
        
    }
    
}

GalleryWidget.prototype = {

    Render: function() {
        //alert("RENDER TABLE");
        this.appendDiv.innerHTML = "";
        
        var tableContainer = document.createElement("div");
        tableContainer.className = "galleryContainer";
        this.appendDiv.appendChild(tableContainer);
        
        for (i = 0; i < this.rows.length; i++) {
            this.rows[i].Render(tableContainer);
        }
        
    },

    
    EnableEdit: function() {
        alert("TABLE WIDGET IN EDIT MODE");
        this.state = 1;
        
        var addRow = new ManualImageRow("img/selected.png", this.type);
        
        var theRow = new ImageItem(addRow, "data", this);
        this.rows.splice(0,0,theRow);
        this.Render();
    },
    
    AddPicture: function() {
        this.callback.AddPicture();
    },
    
    AddVideo: function() {
        this.callback.AddVideo();
    },
    
    RowSelected: function(data) {
        this.callback.RowSelected(data);
    }
    
}