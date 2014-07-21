function Pair(inpKey, inpValue) {
    this.key = inpKey;
    this.value = inpValue;
}

function SQLDatabaseController() {
    this.tmp = new Array();
    this.params = "";
    this.where = "";
    this.tables = "";
    this.values = "";
    
    this.statement = "";
    
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
            //alert("inner loop");
            if (i < this.tmp[this.tmp.length-1].length-1) {
                alert(this.tmp[this.tmp.length-1][i].value);
                this.values += "'" + this.tmp[this.tmp.length-1][i].value + "',";
            } else {
                alert(this.tmp[this.tmp.length-1][i].value);
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
        
        alert(this.database);
        this.database.Create(this.statement);
        
    },
    
    insertCallback: function(res) {
        alert("CALLBACK RECEIVED");
        alert(res.insertId);
    },
    
    Read: function(obj) {
        this.ResetParameters();
        
        this.statement = "SELECT ";
        
        this.ParseObj(obj, 0);
        
        this.GenerateParamsWithTable(obj);
        
        if (this.tmp.length > 1) {
            this.where += this.tmp[i][0] + ".STORY_ID = " + this.tmp[0][1].value + " and STORY.STORY_ID = " + this.tmp[0][1].value;
        } else {
            this.where += this.tmp[i][0] + ".STORY_ID = " + this.tmp[0][1].value;
        }

        this.statement += this.params + " FROM " + this.tables + " WHERE " + this.where ;
        
        alert(this.statement);
        
        this.database.Read(this.statement);
        
        //this.database.transaction(function(tx) {tx.executeSql(statement)})
    },
    
    readCallback: function(res) {
        alert(res.rows.item(0).Headline);
    },
    
    Update: function(obj) {
        this.ResetParameters();
        
        this.ParseObj(obj, 0);
        
        
        for(i = 1; i < this.tmp[this.tmp.length-1].length; i++) {
                //alert("inner loop");
                if (this.tmp[this.tmp.length-1][i].key != "STORY_ID") {
                    if (i < this.tmp[this.tmp.length-1].length-1) {
                    alert(this.tmp[this.tmp.length-1][i].value);
                    this.params += this.tmp[this.tmp.length-1][i].key + " = '" + this.tmp[this.tmp.length-1][i].value + "',";
                } else {
                    alert(this.tmp[this.tmp.length-1][i].value);
                    this.params += this.tmp[this.tmp.length-1][i].key + " = '" + this.tmp[this.tmp.length-1][i].value + "'";
                }
            }
            
        }
        
  
        this.where += "STORY_ID = " + this.tmp[0][1].value;

        
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
        
        for(i = 1; i < this.tmp[this.tmp.length-1].length; i++) {
            //alert("inner loop");
            if (i < this.tmp[this.tmp.length-1].length-1) {
                alert(this.tmp[this.tmp.length-1][i].value);
                this.where += this.tmp[this.tmp.length-1][i].key + "='" + this.tmp[this.tmp.length-1][i].value + "' and ";
            } else {
                alert(this.tmp[this.tmp.length-1][i].value);
                this.where += this.tmp[this.tmp.length-1][i].key + "='" + this.tmp[this.tmp.length-1][i].value + "'";
            }
        }
        
        if (this.tmp.length > 1) {
            this.where += " and STORY_ID='" + this.tmp[0][1].value + "'"; 
        }
        
        this.statement = "DELETE FROM " + this.tmp[this.tmp.length-1][0] + " WHERE " + this.where;
        
        alert(statement);
        
    },
    
    deleteCallback: function(res) {
        alert("DELETE SUCCESSFUL");  
    },
    
    GenerateParamsWithTable: function(obj) {
        for (i in this.tmp) {
            if (i == this.tmp.length-1) {
                this.tables += this.tmp[i][0];
            }
            else {
                this.tables += this.tmp[i][0] + ",";
            }
            
            if (this.tmp[i] instanceof Array) {
                
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
    
    GenerateParamsWithoutTable: function() {

        for (x = 1; x < this.tmp[this.tmp.length-1].length; x++) {
            if (x < this.tmp[this.tmp.length-1].length-1) {
                this.params += this.tmp[this.tmp.length-1][x].key + ",";
                
            } else {
                this.params += this.tmp[this.tmp.length-1][x].key;
            }
        }

    },
    
    ParseObj: function(data, index) {
        for(property in data) {
            if (data[property] instanceof Array) {
                //alert("array");
                this.tmp.push(new Array);
                //alert("Array length:" + tmp.length);
                //alert("Type of new element: " )
                this.tmp[this.tmp.length-1].push(property);
                this.ParseObj(data[property],this.tmp.length-1);
            }
            else if (data[property] instanceof Object) {
                this.ParseObj(data[property], index);
            }
            else if (typeof(property) == "string") {
                var tmpPair = new Pair(property, data[property]);
                if (this.tmp[index] instanceof Array) {
                    this.tmp[index].push(tmpPair);
                }
                alert(tmpPair.key + " - " + tmpPair.value);
            }
            
        }
        
    }
    
};