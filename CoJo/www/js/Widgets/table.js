function Row(inpText, inpID) {
    this.item_id = inpID;
    this.text = inpText;
    this.selected = false;
}

Row.prototype = {
    ToggleSelected: function() {
        if (!this.selected) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }
}

function Table(elementID, inpCallback) {
    this.appendingElement = document.getElementById(elementID)
    alert(this.appendingElement);
    this.rows = new Array();
    
    this.callback = inpCallback;
    
    this.state = 0;
}

Table.prototype = {
    
    SetState: function(inpState) {
        if ((this.state != inpState) && (inpState == 1 || inpState == 0)) {
            this.state = inpState;
            
            if (this.state == 0) {
                this.rows.splice(0,1);
                for (i = 0; i < this.rows.length; i++) {
                    this.rows[i].selected = 0;
                }
            }
            else {
                var addRow = new Row("Add", 0);
                this.rows.splice(0,0,addRow);
            }
            
            this.Render();
        }
    },
    
    AddRow: function(inpText, inpID) {
        var newRow = new Row(inpText, inpID);
        this.rows.push(newRow);
        this.Render();
    },
    RowSelected: function(element) {
        
        //alert("Tag name: " + element.target.tagName);
        var theDiv = "";
        
        if (element.target.tagName != "DIV") {
            theDiv = element.target.parentNode;
        } else {
            theDiv = element.target;
        }
        
        alert("Tag name: " + theDiv.id);
        
        // edit state
        if (this.state) {
            var children = theDiv.getElementsByClassName("selected");
            // The item has not already been selected
            if (children.length < 1) {
                
                //var div = element.target.parentNode;
                alert(theDiv.id);
                var select = document.createElement("img");
                select.className = "selected";
                select.src = "img/selected.png";
                theDiv.appendChild(select);          
            }
            // The item has already been selected
            else {
                element.target.parentNode.removeChild(children[0]);
            }
            
            // Toggle the state of the ImageItem
            this.rows[theDiv.id].ToggleSelected();
        }
        else {
            
            this.callback.RowSelected(this.rows[theDiv.id].text);
        }
        
        
    },
    Render: function() {
        // Clear any previous state and redraw
        this.appendingElement.innerHTML = "";
        var i;
        for (i = 0; i < this.rows.length; i++) {
            //alert("Adding element: " + this.rows[i].text)
            var div = document.createElement("div");
            div.className = "row";
            var p = document.createElement("p");
            p.innerHTML = this.rows[i].text;
            p.className = "rowHeading";
            div.id = i;

            if (this.state && i == 0) {
                div.addEventListener("click", this.AddListener.bind(this), false);

            } else {
                div.addEventListener("click", this.RowSelected.bind(this), false);
            }
            
            div.appendChild(p);
            this.appendingElement.appendChild(div);
        }  
    },
    
    AddListener: function(element) {
        this.callback.AddListener(); 
    },
    
    // Will need to inform a subscriber so that it can remove the image from the file system
    DeleteSelectedItems: function() {
        if (this.state == 1) {
            for (i = 0; i < this.rows.length; i++) {
                if (this.rows[i].selected) {
                    alert("SELECTED ID: " + i);
                    alert("ITEM ID: " + this.rows[i].item_id);
                    this.callback.deleteFromState(this.rows[i].item_id);
                    this.rows.splice(i,1);
                    
                    // In order to not skip items when one is deleted (shuffled back), we must
                    // decrement the pointer
                    i--;
                }
            }

        this.Render();
        }
    }
    
}