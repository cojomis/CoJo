function Pair(inpKey, inpValue) {
    this.key = inpKey;
    this.value = inpValue;
}

// InpCallback is an object that implements predefined methods to allow results from READ requests to be returned (at this moment in time, further callbacks can be added in the future)
function SQLDatabaseController(inpCallback) {
    this.tmp = new Array();
    this.params = "";
    this.where = "";
    this.tables = "";
    this.values = "";
    
    this.statement = "";
    this.callback = inpCallback;
    
    this.database = new SQLDatabase(this);
    
}

SQLDatabaseController.prototype = {
    
    ResetParameters: function() {
        this.tmp = new Array();
        this.params = "";
        this.where = "";
        this.tables = "";
        this.values = "";
    
        this.statement = "";
    },
    
    Create: function(obj) {
        this.ResetParameters();
        this.ParseObj(obj, 0);
        this.GenerateParamsWithoutTable();
        
        for(i = 1; i < this.tmp[this.tmp.length-1].length; i++) {
            if (i < this.tmp[this.tmp.length-1].length-1) {
                this.values += "'" + this.tmp[this.tmp.length-1][i].value + "',";
            } else {
                this.values += "'" + this.tmp[this.tmp.length-1][i].value + "'";
            }
        }
        
        if (this.tmp.length > 1) {
            this.params += ",STORY_ID";
            this.values += "," + this.tmp[0][1].value;
        }
        
        
        this.statement = "INSERT INTO " + this.tmp[this.tmp.length-1][0] + "(" + this.params + ") VALUES (" ;
        
        this.statement += this.values + ")";
        
        alert(this.statement);
        
        this.database.Create(this.statement);
        
    },
    
    insertCallback: function(res) {
        alert(res.rows.length);
    },
    
    Read: function(obj) {
        this.ResetParameters();
        
        this.ParseObj(obj, 0);
        
        this.GenerateParamsWithTable(obj);
        
        this.statement = "SELECT ";
        
        if (this.tmp[0][1].value != "*") {
            if (this.tmp.length > 1) {
                this.where = " WHERE " + this.tmp[1][0] + ".ID = " + this.tmp[1][1].value + " and STORY.ID = " + this.tmp[0][1].value;
            } else {
                this.where = " WHERE " + this.tmp[0][0] + ".ID = " + this.tmp[0][1].value;
            }
        }
        
        
        this.statement += this.params + " FROM " + this.tables + this.where ;
        
        alert(this.statement);
        
        this.database.Read(this.statement);
        
    },
    
    readCallback: function(res) {
        this.callback.handleResponse(res);
    },
    
    Update: function(obj) {
        this.ResetParameters();
        
        this.ParseObj(obj, 0);
        
        // For
        for(i = 1; i < this.tmp[this.tmp.length-1].length; i++) {
                // Whilst the STORY_ID is required, it cannot be updated and is therefore ignored
                if (this.tmp[this.tmp.length-1][i].key != "ID") {
                    if (i < this.tmp[this.tmp.length-1].length-1) {
                        // There are more to add so insert a ','
                        this.params += this.tmp[this.tmp.length-1][i].key + " = '" + this.tmp[this.tmp.length-1][i].value + "',";
                    } else {
                        this.params += this.tmp[this.tmp.length-1][i].key + " = '" + this.tmp[this.tmp.length-1][i].value + "'";
                    }
            }
            
        }
        
        // Ensure the correct item for the specific Story is updated
        
        this.where += "ID = " + this.tmp[this.tmp.length-1][1].value;

        
        this.statement = "UPDATE " + this.tmp[this.tmp.length-1][0] + " SET " + this.params + " WHERE " + this.where;
        
        alert(this.statement);
        
        this.database.Update(this.statement);
    },
    
    updateCallback: function(res) {
        alert("Update successful");
    },
    
    Delete: function(obj) {
        this.ResetParameters();
        
        this.ParseObj(obj, 0);
        
        // Generate the where part of the DELETE statement
        for(i = 1; i < this.tmp[this.tmp.length-1].length; i++) {
            
            if (i < this.tmp[this.tmp.length-1].length-1) {
                // There are more conditions so append an 'and'
                this.where += this.tmp[this.tmp.length-1][i].key + "='" + this.tmp[this.tmp.length-1][i].value + "' and ";
            } else {
                this.where += this.tmp[this.tmp.length-1][i].key + "='" + this.tmp[this.tmp.length-1][i].value + "'";
            }
        }
        
        // If deleting from a one-to-many table (Video, Audio, etc), ensure only those rows that belong to the identifed Story are being delete
        if (this.tmp.length > 1) {
            this.where += " and STORY_ID='" + this.tmp[0][1].value + "'"; 
        }
        
        this.statement = "DELETE FROM " + this.tmp[this.tmp.length-1][0] + " WHERE " + this.where;
        
        alert(this.statement);
        
    },
    
    deleteCallback: function(res) {
        alert("DELETE SUCCESSFUL");  
    },
    
    // Some requests require the table name be appended to the parameters, if so, this method can be used
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
    
    // Some requests require the Table name be present when identifying columns within the table, others don't and can therefore use this method to generate the parameters without appended table names
    GenerateParamsWithoutTable: function() {

        for (x = 1; x < this.tmp[this.tmp.length-1].length; x++) {
            if (x < this.tmp[this.tmp.length-1].length-1) {
                this.params += this.tmp[this.tmp.length-1][x].key + ",";
                
            } else {
                this.params += this.tmp[this.tmp.length-1][x].key;
            }
        }

    },
    
    // Scans through all the properties of the JSON object in Javascript object form and create a multidimensional array of key/value pairs relating to the parameters in the JSON file
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
    
};