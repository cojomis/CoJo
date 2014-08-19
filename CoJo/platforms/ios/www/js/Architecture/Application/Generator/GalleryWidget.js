// A Gallery is made up of Items of a specific type. This class specifies an ImageItem used for displaying still images. It takes the array of data surrounding the Image and the name of a property that contains
// the URI of the Image. The Image will be displayed using the <img> tag
function ImageItem(inpData, inpDisplayProperty, inpCallback) {
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    
}

ImageItem.prototype = {

    Render: function(appendDiv, edit) {
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

        if (this.data.constructor.name == "ManualImageRow") {
            
            this.callback.EventHandler(new AppEvent(this, "addmedia", this.data.type));
            
        } else {
            if (this.callback.state == 1) {
                if (this.selected == 0) {
                    this.selected = 1;
                } else {
                    this.selected = 0;
                }
            }
        }
        
    },
    
    itemSelected: function(event) {
        if (this.selected) {
            this.selected = 0;
        } else {
            this.selected = 1;
        }
        
        event.stopPropagation();
        this.callback.Render();
    }
}

// Similarly to the ImageItem, the VideoItem is a Gallery item type, however, the video is displayed using HTML5 video playback. It also uses the default controls resulting in a workaround to support editing as detailed below
function VideoItem(inpData, inpDisplayProperty, inpCallback) {
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    
}

VideoItem.prototype = {

    Render: function(appendDiv, edit) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "thumbnailDiv";
        
        // If we are in edit mode, we cannot render the video tag at all otherwise it captures all click events and prevents us from performing operations such as delete (the video just starts playing). Therefore, a block
        // box is rendered as a workaround for the meantime. A solution to this may be custom controls but I'm not sure this is supported by mobile safari (although mobile safari supports custom audio controls...)
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
                
    },
    
    itemSelected: function(event) {
        if (this.selected) {
            this.selected = 0;
        } else {
            this.selected = 1;
        }
        
        event.stopPropagation();
        this.callback.Render();
    }
}

// AudioItem uses the HTML5 audio tag functionality with custom controls to present a play and stop button
function AudioItem(inpData, inpDisplayProperty, inpCallback) {
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.selected = 0;
    this.audio = "";
    
}

AudioItem.prototype = {

    Render: function(appendDiv, edit) {
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
        
    },
    
    resetAudio: function(event) {
        this.callback.Render();
        
    },
    
    togglePlay: function(event) {

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

        if (this.selected) {
            this.selected = 0;
        } else {
            this.selected = 1;
        }
        
        event.stopPropagation();
        this.callback.Render();
    }
}

function ManualImageRow(inpData, inpType) {
    this.data = inpData;
    this.type = inpType;
}

function GalleryWidget(inpData, inpCallback, inpType) {
    this.data = inpData;

    this.rows = new Array();
    this.appendDiv;
    this.state = 0;
    this.type = inpType;
    
    this.callback = inpCallback;
    
    
    if (Object.prototype.toString.call(this.data.Data) == '[object Array]') {
        for (i = 0; i < this.data.Data.length; i++) {
            var newItem = "";
            if (this.type == "Image") {
                newItem = new ImageItem(this.data.Data[i], this.data.Value, this);
            } else if (this.type == "Video") {
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
        this.appendDiv.innerHTML = "";
        
        var tableContainer = document.createElement("div");
        tableContainer.className = "galleryContainer";
        this.appendDiv.appendChild(tableContainer);
        
        for (i = 0; i < this.rows.length; i++) {
            this.rows[i].Render(tableContainer, this.state);
        }
        
    },

    
    EnableEdit: function() {
        this.state = 1;
        
        var addRow = new ManualImageRow("img/add.png", this.type);
        
        var theRow = new ImageItem(addRow, "data", this);
        this.rows.splice(0,0,theRow);
        this.Render();
    },
    
    EventHandler: function(event) {
        this.callback.EventHandler(event);
    },
    
    DeleteSelectedItems: function() {
        
        for (i = 0; i < this.rows.length; i++) {
            if (this.rows[i].selected) {
                for (x = 0; x < this.data.Data.length; x++) {
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