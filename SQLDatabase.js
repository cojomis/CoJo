function SQLDatabase(inpCallback) {
    alert("in constructor");
    this.database = window.openDatabase("CojoDB", "1.0", "CoJo", 200000);
    this.database.transaction(this.createDB);
    this.currentStatement = "";
    this.callback = inpCallback;

}

SQLDatabase.prototype = {
    createDB: function() {
        alert("CREATING DB");
        tx.executeSql('CREATE TABLE IF NOT EXISTS STORY ("STORY_ID" INTEGER ,"Headline" VARCHAR ,"Story_Date" VARCHAR ,"Story_Time" VARCHAR ,PRIMARY KEY ( "STORY_ID" ))');
    },
      
    Create: function(statement) {
        alert("CREATE");
        this.currentStatement = statement;
        this.database.transaction(this.executeCreate.bind(this));
    },
    
    executeCreate: function(tx) {
        alert("execute sql");
        tx.executeSql(this.currentStatement, [], this.executeCreateComplete.bind(this));
    },
    
    executeCreateComplete: function(tx, res) {
        this.callback.insertCallback(res);
    },
    
    Read: function(statement) {
        this.currentStatement = statement;
        this.database.transaction(this.executeRead.bind(this));
    },
    
    executeRead: function (tx) {
        alert("CREATING TRANS");
        tx.executeSql(this.currentStatement, [], this.executeReadComplete.bind(this));
    },
    
    executeReadComplete: function(tx, res) {
        alert("SUCCESS READ");
        alert(res.rows.length);
        this.callback.readCallback(res);
    },
    
    Update: function(statement) {
        this.currentStatement = statement;
        this.database.transaction(this.executeUpdate.bind(this));
    },
    
    executeUpdate: function(tx) {
        tx.executeSql(this.currentStatement, [], this.executeUpdateComplete.bind(this));
    },
    
    executeUpdateComplete: function(tx, res) {
        this.callback.updateCallback(res);
    },
    
    Delete: function(statement) {
        this.currentStatement = statement;
        this.database.transaction(this.executeDelete.bind(this));
    },
    
    executeDelete: function (tx) {
        tx.executeSql(this.currentStatement, this.executeDeleteComplete.bind(this));
    },
    
    executeDeleteComplete: function (tx, res) {
        this.callback.deleteCallback(res);
    }
}