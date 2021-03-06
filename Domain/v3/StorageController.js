// A class that represents the key/value pairs in a JSON structure (the leafs of the tree structure)
function Pair(inpKey,inpValue) {
    this.key = inpKey;
    this.value = inpValue;
}


function StorageController(inpCallback) {
    this.newState = new Array();
    this.oldState = new Array();
    
    this.callback = inpCallback;
    
    this.database = new SQLDatabase(this);
    
    this.Story;
    this.currentArray;

    
}

StorageController.prototype = {
    
    Read: function(arr) {
        this.Story = arr.Story;
        this.ParseRead();
        
        
    },
    
    ParseRead: function() {
        alert("IN PARSE READ");
        var i = 0;
        alert("Story Length: " + this.Story.length);
        for (i = 0; i < this.Story.length; i++) {
            var used = this.Check(this.Story, this.Story[i], "", "Story");
            
            alert("Used: " + used);
            
            if (used) {
                return;
            }
            
            alert("Checking next tables");
            
            for (x in this.Story[i]) {
                alert("X: " + x);
                if (this.Story[i][x] instanceof Array) {
                    alert("TABLE : " + x);
                    used = this.Check(this.Story[i][x], this.Story[i][x][0], this.Story[i].STORY_ID, x);
                    
                    if (used) {
                        return;
                    }
                }
            }
        }
        
        alert("SELECT COMPLETE");
        alert(JSON.stringify(this.Story));
    },
    
    Check: function(arr, obj, storyID, table) {
        alert("IN CHECK");
        this.currentArray = arr;
        
        //alert(arr.Headline);
        
        if (typeof(obj) != 'undefined') { 
            var params = "";
            
            for (i in obj) {
                alert(i);
                if (typeof(obj[i]) == 'string') {
                    if (obj[i] == "*" || obj[i] == "") {
                        params += table + "." + i + ",";
                    } else {
                        return false;
                    }
                }
            }
            
            params = params.substr(0, params.length-1);
            
            var statement = "";
            
            if (storyID != "") {
                statement = "SELECT " + params + " FROM " + table + " WHERE " + table  + ".STORY_ID=" + storyID;
                
            } else {
                statement = "SELECT " + params + " FROM " + table;
            }
            
            alert(statement);
            
            this.database.Read(statement);
            
            return true;
        } else {
            return false;
        }
    
    },
    
    readCallback: function(res) {
        alert("Returned rows: " + res.rows.length);
        
        alert(this.currentArray);
        var template = this.currentArray.pop();
        //alert(template);
        //alert("retrieved");
        
        for (i = 0; i < res.rows.length; i++) {
            
            //alert("Next row");
            var tmp = JSON.parse(JSON.stringify(template));
            alert(tmp);
            
            for (x in tmp) {
                //alert("X: " + x);
                for (q in res.rows.item(i)) {
                    //alert("Q: " + q);
                    if (x == q) {
                        alert("Setting " + x + " = " + res.rows.item(i)[q]);
                        tmp[x] = res.rows.item(i)[q];
                    }
                }
            }
            //alert("pushing");
            this.currentArray.push(tmp);
            
        }
        
        this.ParseRead();
    },
    
    // Compares the before and after states and determines what the relevant INSERT, UPDATE, and DELETE statements are in order to make the database consistent with the new state
    UpdateState: function(obja, objb) {
        // Generate a representation of the Javascript objects in array form so that they can be processed
        // The resulting multidimensional array has the following meaning: arr[Everything][Story(starting at index 1][Parameter/Subtable][Subtable Index (starting at index 1][Parameter]
        this.Parse(obja, this.newState);
        this.Parse(objb, this.oldState);
        
        this.RecurseNew(this.newState[0], this.oldState[0], 0);
        this.RecurseDeleted(this.oldState[0], this.newState[0], 0);
        
        alert("DONE");
                
    },
    
    RecurseNew: function(newArray, oldArray, storyID) {
            var i = 1;
            var sID = storyID;
            
            // Note starting at one as indicated above (0 is the name of the table, not the first story in the table)
            for (i = 1; i < newArray.length; i++) {
                // For all future recursions into child tables of a story, we must know the story ID when creating the foriegn key relationship. Store it here.
                if (newArray[0] == "Story") {
                    sID = newArray[i][0].value;
                }

                this.CheckNew(newArray[i], oldArray, sID);
                // As the entry has already been made, we don't care about the story ID, the WHERE comes from the primary key of the to be updated value
                this.CheckForUpdates(newArray[i], oldArray);
                
                var x = 0;
                // Find and recurse through any subtables (Image, Video, etc)
                for (x = 0; x < newArray[i].length; x++) {
                    if (newArray[i][x] instanceof Array) {
                        alert("CHECKING SUB TABLES");
                        this.RecurseNew(newArray[i][x], oldArray[i][x], sID);
                    }
                }
            }
        
    },
    
    // See RecurseNew for details. When this method is called, the this.oldState is passed as the first parameter as it determines whether items have been removed within the new state
    RecurseDeleted: function(newArray, oldArray, storyID) {
            var i = 1;
            var sID = storyID;
            
            for (i = 1; i < newArray.length; i++) {
                if (newArray[0] == "Story") {
                    sID = newArray[i][0].value;
                }

                this.CheckDelete(newArray[i], oldArray);
                
                var x = 0;
                for (x = 0; x < newArray[i].length; x++) {
                    if (newArray[i][x] instanceof Array) {
                        this.RecurseDeleted(newArray[i][x], oldArray[i][x], sID);
                    }
                }
            }
        
    },
    
    CheckForUpdates: function(obj, arr) {        
        
        for(i = 1; i < arr.length; i++) {
            
            if (obj[0].value == arr[i][0].value) {
                var vals = "";
                for (x = 1; x < obj.length; x++) {
                    if (!(obj[x] instanceof Array) && obj[x].value != arr[i][x].value) {
                        vals += obj[x].key + "='" + obj[x].value + "',";
                    } else {
                        // No update
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
        
        // Check whether the obj already exists, if it does, we do not need to add it again
        for (i = 1; i < arr.length; i++) {
            if (obj[0].value == arr[i][0].value) {
                found = true;
            }
        }

        
        if (!found) {            
            var cols = "";
            var vals = "";
            for (i = 0; i < obj.length; i++) {
                // We don't care about the ID as the database will automaticallty create this, so we forget this property
                if (!(typeof(obj[i].key) === 'undefined') && obj[i].key != "ID" && obj[i].key != "STORY_ID") {
                    cols += obj[i].key + ",";
                    vals += "'" + obj[i].value + "',";
                }
                

            }
            
            cols = cols.substr(0, cols.length-1);
            vals = vals.substr(0, vals.length-1);
            var statement;
            
            // If inserting into a subtable, we need to add the foreign key constraint back to the related story. Note the foreign key column name must always be STORY_ID in this case
            if (arr[0] != "Story") {
                statement = "INSERT INTO " + arr[0] + " (" + cols + ",STORY_ID) VALUES (" + vals + "," + storyID +")";
            } else {
                statement = "INSERT INTO " + arr[0] + " (" + cols + ") VALUES (" + vals + ")";
            }
            
            alert(statement);
            
            this.database.Create(statement);
        } else {
            // Nothing to create
        }
    },
    
    CheckDelete: function(obj, arr) {
        var found = false;
        
        // If we find the obj in the new array, it has not been deleted
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
            // Nothing to delete
        }    
        
    },
    
    Parse: function(data, arr) {
        for(property in data) {
            // An array in the JSON file relates to a table in the database
            if (data[property] instanceof Array) {
                arr.push(new Array);
                //The name of the 'array' is also added to the structure as it relates to the table name in the database
                arr[arr.length-1].push(property);
                // Recursively check the JSON array for further parameters
                this.Parse(data[property], arr[arr.length-1]) ;
            }
            else if (data[property] instanceof Object) {
                // An object contains data, an Object can be thought of as a row in the database table
                arr.push(new Array);
                this.Parse(data[property], arr[arr.length-1]);
            }
            else if (typeof(property) == "string") {
                // Create a key/value pair to store the property name and its related value
                
                var tmpPair = new Pair(property, data[property]);
                arr.push(tmpPair);    
            }
            
        }
    }

    
}