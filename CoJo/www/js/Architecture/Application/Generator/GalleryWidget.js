function ImageItem(inpData, inpDisplayProperty, inpCallback) {
    //alert("CREATING TABLE ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    
}

ImageItem.prototype = {

    Render: function(appendDiv, edit) {
        //alert("Rendering element");
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
        
        if (edit && this.data.constructor.name != "ManualImageRow") {
            var editCover = document.createElement("div");
            editCover.className = "thumbnailEditCover";
            
            if (this.selected) {
                var selectedItem = document.createElement("div");
                selectedItem.className = "thumbnailSelected";
                        
                editCover.appendChild(selectedItem);
            }
                        
            editCover.addEventListener('click', this.itemSelected.bind(this), false);
            
            rowDiv.appendChild(editCover);
        }
        
        appendDiv.appendChild(rowDiv);
        
        rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    eventHandler: function(element) {
        //alert(this.data.constructor.name)
        if (this.data.constructor.name == "ManualImageRow") {

            //alert("ADD ITEM");
            if (this.data.type == "Image") {
                this.callback.AddPicture();
            } else if (this.data.type == "Video") {
                this.callback.AddVideo();
            } else if (this.data.type == "Audio") {
                this.callback.AddAudio();
            }
            
            
        } else {
            if (this.callback.state == 1) {
                if (this.selected == 0) {
                    this.selected = 1;
                } else {
                    this.selected = 0;
                }
            } else {
                this.callback.RowSelected(this.data);
            }
        }
        
    },
    
    itemSelected: function(event) {
        //alert("item selected");
        if (this.selected) {
            alert("deselect");
            this.selected = 0;
        } else {
            this.selected = 1;
        }
        
        event.stopPropagation();
        this.callback.Render();
    }
}

function VideoItem(inpData, inpDisplayProperty, inpCallback) {
    //alert("CREATING VIDEO ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    
}

VideoItem.prototype = {

    Render: function(appendDiv, edit) {
        //alert("Rendering element");
        var rowDiv = document.createElement("div");
        rowDiv.className = "thumbnailDiv";
        
        if (!edit) {
            
            for (prop in this.data) {
                if (typeof(this.data[prop]) === "string") {
                    if (prop == this.displayProperty) {
                        var video = document.createElement("video");
                        video.width = "100";
                        video.height = "100";
                        video.className = "thumbnail";
                        video.src = this.data[prop];
                        video.preload = "auto";                    
                        
                        rowDiv.appendChild(video);
                        
                    }
                }
            }
            
        } else if (edit && this.data.constructor.name != "ManualImageRow") {
            var editCover = document.createElement("div");
            editCover.className = "thumbnailEditCoverVideo";
            
            if (this.selected) {
                var selectedItem = document.createElement("div");
                selectedItem.className = "thumbnailSelected";
                        
                editCover.appendChild(selectedItem);
            }
            
                          
            editCover.addEventListener('click', this.itemSelected.bind(this), false);
            
            rowDiv.appendChild(editCover);
        }
        
        appendDiv.appendChild(rowDiv);
        
        rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    itemSelected: function(event) {
        //alert("item selected");
        if (this.selected) {
            alert("deselect");
            this.selected = 0;
        } else {
            this.selected = 1;
        }
        
        event.stopPropagation();
        this.callback.Render();
    },
    
    eventHandler: function(element) {
        //alert(this.data.constructor.name)
        if (this.data.constructor.name == "ManualImageRow") {

            //alert("ADD ITEM");
            this.callback.AddVideo();
            
        } else {

            this.callback.RowSelected(this.data);
            
        }
        
    }
}

function AudioItem(inpData, inpDisplayProperty, inpCallback) {
    //alert("CREATING VIDEO ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    this.audio = "";
    
}

AudioItem.prototype = {

    Render: function(appendDiv, edit) {
        //alert("Rendering element");
        var rowDiv = document.createElement("div");
        rowDiv.className = "thumbnailDiv";
    
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    this.audio = document.createElement("audio");
                    this.audio.src = this.data[prop];
                    this.audio.addEventListener('ended', this.resetAudio.bind(this), false);
                    
                    var img = document.createElement("img");
                    img.src = "img/play.png";
                    img.addEventListener('click', this.togglePlay.bind(this), false);
                    img.className = "audioPosition";
                    

                    
                    rowDiv.appendChild(img);
                    
                }
            }
        }
            
        if (edit && this.data.constructor.name != "ManualImageRow") {
            var editCover = document.createElement("div");
            editCover.className = "thumbnailEditCover";
            editCover.style.backgroundColor = "";
            
            if (this.selected) {
                var selectedItem = document.createElement("div");
                selectedItem.className = "thumbnailSelected";
                        
                editCover.appendChild(selectedItem);
            }
            
                          
            editCover.addEventListener('click', this.itemSelected.bind(this), false);
            
            rowDiv.appendChild(editCover);
        }
        
        appendDiv.appendChild(rowDiv);
        
        //rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    resetAudio: function(event) {
        this.callback.Render();
        
    },
    
    togglePlay: function(event) {
        //alert("toggle play");
        //alert(event.target.src);
        if (this.audio.paused) {
            event.target.src = "img/stop.png";
            this.audio.play();
        } else {
            event.target.src = "img/play.png";
            this.audio.stop();
        }
        
        event.stopPropagation();
    },
    
    itemSelected: function(event) {
        //alert("item selected");
        if (this.selected) {
            this.selected = 0;
        } else {
            this.selected = 1;
        }
        
        event.stopPropagation();
        this.callback.Render();
    },
    
    eventHandler: function(element) {
        //alert(this.data.constructor.name)
        if (this.data.constructor.name == "ManualImageRow") {

            //alert("ADD ITEM");
            this.callback.AddVideo();
            
        } else {

            this.callback.RowSelected(this.data);
            
        }
        
    }
}

function ManualImageRow(inpData, inpType) {
    this.data = inpData;
    this.type = inpType;
}

function GalleryWidget(inpData, inpCallback, inpType) {
    //alert("GW CONST");
    this.data = inpData;

    this.rows = new Array();
    this.appendDiv;
    this.state = 0;
    this.type = inpType;
    
    this.callback = inpCallback;
    
    //alert("IDENT: " + this.data.Identifier);
    //alert("TYPE: " + Object.prototype.toString.call(this.data.Data));
    
    if (Object.prototype.toString.call(this.data.Data) == '[object Array]') {
        //alert("is array");
        for (i = 0; i < this.data.Data.length; i++) {
            var newItem = "";
            if (this.type == "Image") {
                //alert('Creating IMAGE gallery');
                newItem = new ImageItem(this.data.Data[i], this.data.Value, this);
            } else if (this.type == "Video") {
                //alert("Creating Video gallery");
                newItem = new VideoItem(this.data.Data[i], this.data.Value, this);
            } else if (this.type == "Audio") {
                newItem = new AudioItem(this.data.Data[i], this.data.Value, this);
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
            this.rows[i].Render(tableContainer, this.state);
        }
        
    },

    
    EnableEdit: function() {
        //alert("TABLE WIDGET IN EDIT MODE");
        this.state = 1;
        
        var addRow = new ManualImageRow("img/add.png", this.type);
        
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
    
    AddAudio: function() {
        this.callback.AddAudio();
    },
    
    RowSelected: function(data) {
        this.callback.RowSelected(data);
    },
    
    DeleteSelectedItems: function() {
        //alert("Delete selected items");
        //alert(this.data.Identifier);
        
        for (i = 0; i < this.rows.length; i++) {
            if (this.rows[i].selected) {
                //alert("row selected");
                for (x = 0; x < this.data.Data.length; x++) {
                    alert("row: " + this.rows[i].data[this.data.Identifier] + " == " + this.data.Data[x][this.data.Identifier]);
                    if (this.rows[i].data[this.data.Identifier] == this.data.Data[x][this.data.Identifier]) {
                        this.data.Data.splice(x,1);
                        this.rows.splice(i,1);
                        i--;
                    }
                }
            }
        }
        
        this.Render();
    }
    
}