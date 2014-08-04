function DataTableItem(inpData, inpDisplayProperty, inpCallback) {
    alert("CREATING TABLE ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
    this.appendDiv = "";
    this.selected = 0;
    
}

DataTableItem.prototype = {

    Render: function(appendDiv) {
        //alert("Rendering row");
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
                        text.innerHTML = this.data[prop];
                        
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
        alert(this.data.constructor.name)
        if (this.data.constructor.name == "ManualDataRow") {
            //alert(this.data);
            if (this.data.data == "Add") {
                //alert("ADD ITEM");
                this.callback.AddItem();
            }
        } else {
            if (this.callback.state == 1) {
                alert("ITEM SELECTED");
                if (this.selected == 0) {
                    this.selected = 1;
                    this.callback.Render();
                    
                } else {
                    this.selected = 0;
                    this.callback.Render();
                }
                
                this.Render();
            } else {
                this.callback.RowSelected(this.data);
            }
        }
        
    }
}

function ManualDataRow(inpData) {
    this.data = inpData;
}

function InputTableItem(inpData, inpDisplayProperty, inpCallback) {
    //alert("CREATING INPUT TABLE ITEM");
    this.displayProperty = inpDisplayProperty;
    
    this.data = inpData;
    
    this.callback = inpCallback;
}

InputTableItem.prototype = {

    Render: function(appendDiv) {
        //alert("Rendering row");
        var rowDiv = document.createElement("div");
        rowDiv.className = "row";
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    rowDiv.innerHTML = prop;
                    var inputBox = document.createElement("input");
                    inputBox.type = "text";
                    inputBox.value = this.data[prop];
                    inputBox.addEventListener('change', this.InputChanged.bind(this), false);
                    rowDiv.appendChild(inputBox);
                }
            }
        }
        
        //rowDiv.addEventListener('click', this.updateValue.bind(this), false);
        
        appendDiv.appendChild(rowDiv);
        
        //rowDiv.addEventListener('click', this.eventHandler.bind(this), false);
    },
    
    InputChanged: function(element) {
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    this.data[prop] = encodeURIComponent(element.target.value);
                }
            }
        }
    },
    
    updateValue: function(element) {
        for (prop in this.data) {
            if (typeof(this.data[prop]) === "string") {
                if (prop == this.displayProperty) {
                    this.data[prop] = encodeURIComponent("Ive updated the value");
                    this.callback.RowSelected();
                }
            }
        }
    },
    
    eventHandler: function(element) {
        alert("ROW TAPPED: " + this.value);
        
    }
}

function TableWidget(inpData, inpCallback) {
    //alert("TW CONST");
    this.data = inpData;

    this.rows = new Array();
    this.appendDiv;
    this.state = 0;
    
    this.callback = inpCallback;
    
    //alert("IDENT: " + this.data.Identifier);
    //alert("TYPE: " + Object.prototype.toString.call(this.data.Data));
    
    if (Object.prototype.toString.call(this.data.Data) == '[object Array]') {
        alert("is array");
        for (i = 0; i < this.data.Data.length; i++) {
            var newItem = new DataTableItem(this.data.Data[i], this.data.Value, this);
            this.rows.push(newItem);
        }
        
    } else if (Object.prototype.toString.call(this.data.Data) == '[object Object]') {
        alert("is object");
        for (prop in this.data.Data) {
            //alert(typeof(this.data.Data[prop]));
            if (typeof(this.data.Data[prop]) == "string") {
                var newItem = new InputTableItem(this.data.Data, prop, this);
                this.rows.push(newItem);
            }
        }
    }
    

}

TableWidget.prototype = {

    Render: function() {
        //alert("RENDER TABLE");
        this.appendDiv.innerHTML = "";
        
        var tableContainer = document.createElement("div");
        tableContainer.className = "tableContainer";
        this.appendDiv.appendChild(tableContainer);
        
        for (i = 0; i < this.rows.length; i++) {
            this.rows[i].Render(tableContainer);
        }
        
        
    },

    
    EnableEdit: function() {
        alert("TABLE WIDGET IN EDIT MODE");
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
    
    AddItem: function() {
        this.callback.AddItem();
    },
    
    RowSelected: function(data) {
        this.callback.RowSelected(data);
    },
    
    DeleteSelectedItems: function() {
        alert("Delete selected items");
        alert(this.data.Identifier);
        
        for (i = 0; i < this.rows.length; i++) {
            if (this.rows[i].selected) {
                alert("row selected");
                for (x = 0; x < this.data.Data.length; x++) {
                    alert("row: " + this.rows[i].data[this.data.Identifier] + " == " + this.data.Data[x][this.data.Identifier]);
                    if (this.rows[i].data[this.data.Identifier] == this.data.Data[x][this.data.Identifier]) {
                        this.data.Data.splice(x,1);
                        x--;
                    }
                }
            }
        }
        
        this.Render();
    }
    
}