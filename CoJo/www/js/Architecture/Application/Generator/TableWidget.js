// A DataTableItem is used for displaying a single parameter from an array of objects. For example, the My Stories page uses this row type to display Story headlines which can be selected to view the Story
function DataTableItem(inpData, inpDisplayProperty, inpCallback) {
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.appendDiv = "";
    
    // Used to determine which rows should be deleted when DeleteSelectedItems is called
    this.selected = 0;
    
}

DataTableItem.prototype = {

    Render: function(appendDiv) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    var text = document.createElement("p");
                    if (this.data[prop] == "Add") {
                        text.className = "dataRowText";
                        text.style.color = "#74D7ED";
                        text.innerHTML = this.data[prop];
                    } else {
                        text.className = "dataRowText";
                        text.innerHTML = decodeURIComponent(this.data[prop]);
                        
                        if (this.selected) {
                            var selectedDiv = document.createElement("div");
                            selectedDiv.className = "selected";
                            
                            rowDiv.appendChild(selectedDiv);
                        }
                        
                    }
                    
                    rowDiv.appendChild(text);
                }
            }
        }
        
        appendDiv.appendChild(rowDiv);
        
        rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    eventHandler: function(element) {
        if (this.data.constructor.name == "ManualDataRow") {
            if (this.data.data == "Add") {
                //alert("add item");
                
                var evt = new AppEvent(this, "additem", "");
                this.callback.EventHandler(evt);
                //this.callback.AddItem();
            }
        } else {
            // If the Table Widget is in edit mode, selecting a row should toggle the selection of said row
            if (this.callback.state == 1) {
                if (this.selected == 0) {
                    this.selected = 1;
                    this.callback.Render();
                    
                } else {
                    this.selected = 0;
                    this.callback.Render();
                }
                
                
            } else {
                this.callback.EventHandler(new AppEvent(this, "rowselected", this.data));
            }
        }
        
    }
}

function ManualDataRow(inpData) {
    this.data = inpData;
}

// A table row item type that supports a header and an input field to allow the user to edit data
function InputTableItem(inpData, inpDisplayProperty, inpCallback) {
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
}

InputTableItem.prototype = {

    Render: function(appendDiv) {
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    var label = document.createElement("div");
                    label.className = "inputLabel";
                    
                    var labelText = document.createElement("p");
                    labelText.className = "textInputLabel";
                    labelText.innerHTML = prop;
                    label.appendChild(labelText);
                    
                    rowDiv.appendChild(label)
                    
                    var inputBox = document.createElement("input");
                    inputBox.type = "text";
                    inputBox.className = "inputBox"
                    inputBox.value = decodeURIComponent(this.data[prop]);
                    inputBox.addEventListener('change', this.InputChanged.bind(this), false);
                    
                    rowDiv.appendChild(inputBox);
                }
            }
        }
                
        appendDiv.appendChild(rowDiv);
        
    },
    
    InputChanged: function(element) {
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    this.data[prop] = encodeURIComponent(element.target.value);
                }
            }
        }
    }
}

function TableWidget(inpData, inpCallback, inpType) {
    this.data = inpData;

    this.rows = new Array();
    this.appendDiv;
    this.state = 0;
    
    this.type = inpType;
    
    this.callback = inpCallback;
    
    if (Object.prototype.toString.call(this.data.Data) == '[object Array]') {

        for (i = 0; i < this.data.Data.length; i++) {
            var newItem = new DataTableItem(this.data.Data[i], this.data.Value, this);
            
            this.rows.push(newItem);
        }
        
    } else if (Object.prototype.toString.call(this.data.Data) == '[object Object]') {
        for (prop in this.data.Data) {
            if (typeof(this.data.Data[prop]) == "string") {
                var newItem = new InputTableItem(this.data.Data, prop, this);
                this.rows.push(newItem);
            }
        }
    }
    

}

TableWidget.prototype = {

    Render: function() {
        this.appendDiv.innerHTML = "";
        
        var tableContainer = document.createElement("div");
        tableContainer.className = "tableContainer";
        this.appendDiv.appendChild(tableContainer);
        
        for (i = 0; i < this.rows.length; i++) {
            this.rows[i].Render(tableContainer);
        }
        
        
    },

    
    EnableEdit: function() {
        this.state = 1;
        
        var addRow = new ManualDataRow("Add");
        var theRow = new DataTableItem(addRow, "data", this);
        this.rows.splice(0,0,theRow);
        this.Render();
    },
    
    DoneEdit: function() {
        this.state = 0;
        this.rows.splice(0,1);
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