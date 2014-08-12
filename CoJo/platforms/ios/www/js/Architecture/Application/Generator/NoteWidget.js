function Note() {
    this.ID = "NEW";
    this.Text = " ";
}

function NoteWidget(inpData, inpCallback) {
    this.data = inpData;
    this.callback = inpCallback;
    
    if (this.data.Data.length < 1) {
        var nNote = new Note();
        this.data.Data.push(nNote);
    }
    
    this.appendDiv;
}

NoteWidget.prototype = {
    Render: function() {
        var tArea = document.createElement("textarea");
        tArea.rows = "20";
        tArea.cols = "49";
        tArea.className = "textArea";
        
        tArea.value = this.data.Data[0][this.data.Value];
        
        tArea.addEventListener('change', this.updateValue.bind(this), false);
        
        this.appendDiv.appendChild(tArea);
    },
    
    updateValue: function(event) {
        this.data.Data[0][this.data.Value] = event.target.value;
    }
    
}