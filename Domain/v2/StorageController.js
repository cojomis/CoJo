function Pair(inpKey,inpValue) {
    this.key = inpKey;
    this.value = inpValue;
}

function StorageController(inpCallback) {
    alert("IN STORAGE CONTROLLER");
    this.newState = new Array();
    this.oldState = new Array();
    
    this.callback = inpCallback;
    
    this.database = new SQLDatabase(this);
    
    this.tmp = new Array();
    this.params = "";
    this.where = "";
    this.tables = "";
    this.values = "";

    
}

StorageController.prototype = {
    ResetParameters: function() {
        this.tmp = new Array();
        this.params = "";
        this.where = "";
        this.tables = "";
        this.values = "";

    },
    
    Read: function(obj) {
        this.ResetParameters();
        
        this.ParseObj(obj, 0);
        
        this.GenerateParamsWithTable(obj);
        
        var statement = "SELECT ";
        
        if (this.tmp[0][1].value != "*") {
            if (this.tmp.length > 1) {
                this.where = " WHERE " + this.tmp[1][0] + ".STORY_ID = " + this.tmp[0][1].value + " and STORY.ID = " + this.tmp[0][1].value;
            } else {
                this.where = " WHERE " + this.tmp[0][0] + ".ID = " + this.tmp[0][1].value;
            }
        }
        
        
        statement += this.params + " FROM " + this.tables + this.where ;
        
        alert(statement);
        
        this.database.Read(statement);
        
    },
    
    readCallback: function(res) {
        //alert("READ CALLBACK");
        //alert(res);
        this.callback.handleResponse(res);
    },
    
    UpdateState: function(obja, objb) {
        alert("in parse");
        this.Parse(obja, this.newState);
        this.Parse(objb, this.oldState);
        
        this.RecurseNew(this.newState[0], this.oldState[0], 0);
        //this.RecurseDeleted(this.oldState[0], this.newState[0], 0);
        
        alert("DONE");
                
    },
    
    RecurseNew: function(newArray, oldArray, storyID) {
            var i = 1;
            var sID = storyID;
            alert("Recurse");
            
            for (i = 1; i < newArray.length; i++) {
                if (newArray[0] == "Story") {
                    alert("In story");
                    sID = newArray[i][0].value;
                    alert("Story ID: " + sID);
                }

                this.CheckNew(newArray[i], oldArray, sID);
                this.CheckForUpdates(newArray[i], oldArray);
                
                var x = 0;
                for (x = 0; x < newArray[i].length; x++) {
                    if (newArray[i][x] instanceof Array) {
                        alert("GOING TO ID: " + x);
                        alert("OLD ARRAY: " + oldArray.length);

                        this.RecurseNew(newArray[i][x], oldArray[i][x], sID);

                    }
                }
            }
        
    },
    
    RecurseDeleted: function(newArray, oldArray, storyID) {
            var i = 1;
            var sID = storyID;
            
            for (i = 1; i < newArray.length; i++) {
                if (newArray[0] == "Story") {
                    alert("In story");
                    sID = newArray[i][0].value;
                    alert("Story ID: " + sID);
                }

                this.CheckDelete(newArray[i], oldArray);
                
                var x = 0;
                for (x = 0; x < newArray[i].length; x++) {
                    if (newArray[i][x] instanceof Array) {
                        alert("GOING TO ID: " + x);
                        this.RecurseDeleted(newArray[i][x], oldArray[i][x], sID);
                    }
                }
            }
        
    },
    
    CheckForUpdates: function(obj, arr) {
        //alert("Headline: " + obj[2].value)
        
        if (typeof(arr) === 'undefined') {
            alert("UPDATE UNDEFINED");
        }
        
        for(i = 1; i < arr.length; i++) {
            
            if (obj[0].value == arr[i][0].value) {
                var vals = "";
                for (x = 1; x < obj.length; x++) {
                    if (obj[x].value != arr[i][x].value) {
                        alert("UPDATE VALS " + obj[x].key + " -> " + arr[i][x].value);
                        vals += obj[x].key + "='" + obj[x].value + "',";

                    } else {
                        alert("NO UPDATE");
                    }
                         
                }
                
                if (vals != "") {
                    vals = vals.substr(0, vals.length-1);
                    var statement = "UPDATE " + arr[0] + " SET " + vals + " WHERE ID=" + obj[0].value;
                    alert(statement);
                
                    this.database.Update(statement);
                }
                
            }
            
        }
    },
    
    CheckNew: function(obj, arr, storyID) {

        var found = false;
        
        if(typeof(arr) === 'undefined') {
            alert("NEW UNDEFINED");
        }
        
        for (i = 1; i < arr.length; i++) {
            if (obj[0].value == arr[i][0].value) {
                found = true;
            }
        }

        
        if (!found) {
            //alert("CREATE " + arr[0] + " with ID " + obj[0].value);
            
            var cols = "";
            var vals = "";
            for (i = 0; i < obj.length; i++) {
                if (!(typeof(obj[i].key) === 'undefined') && obj[i].key != "ID") {
                    alert("Key: " + obj[i].key);
                    cols += obj[i].key + ",";
                    vals += "'" + obj[i].value + "',";
                }
                

            }
            
            cols = cols.substr(0, cols.length-1);
            vals = vals.substr(0, vals.length-1);
            var statement;
            
            if (arr[0] != "Story") {
                statement = "INSERT INTO " + arr[0] + " (" + cols + ",STORY_ID) VALUES (" + vals + "," + storyID +")";
            } else {
                statement = "INSERT INTO " + arr[0] + " (" + cols + ") VALUES (" + vals + ")";
            }
            
            alert(statement);
            
            this.database.Create(statement);
        } else {
            alert("NOTHING TO CREATE");
        }
    },
    
    CheckDelete: function(obj, arr) {
        var found = false;
        
        for (i = 1; i < arr.length; i++) {
            if (obj[0].value == arr[i][0].value) {
                found = true;
            }
        }
        
        var statement;
        
        if (!found) {
            statement = "DELETE FROM " + arr[0] + " WHERE ID='" + obj[0].value + "'";
            
            alert(statement);
            
            this.database.Delete(statement);
        } else {
            alert("NOTHING TO DELETE");
        }
        
        alert("END DELETE");
        
        
    },
    
    Parse: function(data, arr) {
        //alert("Arr: " + arr);
        for(property in data) {
            // An array in the JSON file relates to a table in the database
            if (data[property] instanceof Array) {
                //alert("is array");
                arr.push(new Array);
                //The name of the 'array' is also added to the structure as it relates to the table name in the database
                arr[arr.length-1].push(property);
                // Recursively check the JSON array for further parameters
                this.Parse(data[property], arr[arr.length-1]) ;
            }
            else if (data[property] instanceof Object) {
                //alert("is object");
                // An object contains data, an Object can be thought of as a row in the database table
                arr.push(new Array);
                this.Parse(data[property], arr[arr.length-1]);
            }
            else if (typeof(property) == "string") {
                //alert(property + " " + data[property]);
                // Create a key/value pair to store the property name and its related value
                
                var tmpPair = new Pair(property, data[property]);
                arr.push(tmpPair);
                
                //alert(tmpPair.key + " - " + tmpPair.value);
            }
            
        }
    },
    
    GenerateParamsWithTable: function(obj) {
        for (i in this.tmp) {
            // If this is the last 'table', don't append a ','
            if (i == this.tmp.length-1) {
                this.tables += this.tmp[i][0];
            }
            else {
                this.tables += this.tmp[i][0] + ",";
            }
            
            if (this.tmp[i] instanceof Array) {
                // Go through all the key/value pairs for the specific table to generate the parameter list (note this does not contain any associated values). [i][0] is the database table name
                for (x = 1; x < this.tmp[i].length; x++) {
                    if (i == this.tmp.length-1 && x == this.tmp[i].length-1) {
                        this.params += this.tmp[i][0] + "." + this.tmp[i][x].key;
                        
                    } else {
                        this.params += this.tmp[i][0] + "." + this.tmp[i][x].key + ",";
                    }  
                }
            }
        }
    },
    
    ParseObj: function(data, index) {
        for(property in data) {
            // An array in the JSON file relates to a table in the database
            if (data[property] instanceof Array) {
                this.tmp.push(new Array);
                //The name of the 'array' is also added to the structure as it relates to the table name in the database
                this.tmp[this.tmp.length-1].push(property);
                
                // Recursively check the JSON array for further parameters
                this.ParseObj(data[property],this.tmp.length-1);
            }
            else if (data[property] instanceof Object) {
                // An object contains data, an Object can be thought of as a row in the database table
                this.ParseObj(data[property], index);
            }
            else if (typeof(property) == "string") {
                // Create a key/value pair to store the property name and its related value
                var tmpPair = new Pair(property, data[property]);
                if (this.tmp[index] instanceof Array) {
                    this.tmp[index].push(tmpPair);
                }
                //alert(tmpPair.key + " - " + tmpPair.value);
            }
            
        }
        
    }
    
}