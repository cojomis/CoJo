/*
 *SQLDatabase
 *Manages the creation of transactions and execution of  SQL statements. Ensures the database to created correctly.
 *
 */

function SQLDatabase(inpCallback) {
    // Database configuration (Created if the database does not already exists)
    this.database = window.openDatabase("CoJo", "1.0", "Cojo", 200000, this.databaseReady.bind(this));
    this.currentStatement = "";
    
    // When results are received (i.e. Select), the listener is called to inform them of the results
    this.callback = inpCallback;

}

SQLDatabase.prototype = {
    // If the database has to be created for the first time, this method is called which will instruct the database to create the relevant tables
    databaseReady: function(db) {
        alert("Database Ready");
        this.database.transaction(this.createDB, this.errorTable, this.successTable);   
    },
    
    databaseError: function(DB) {
        alert("DB ERROR");
    },
    
    createDB: function(tx) {
        tx.executeSql('CREATE TABLE STORY ("ID" INTEGER ,"Headline" VARCHAR ,"Story_Date" VARCHAR ,"Story_Time" VARCHAR ,"Latitude" VARCHAR ,"Longitude" VARCHAR ,PRIMARY KEY ( "ID" ))');
        tx.executeSql('CREATE TABLE IMAGE ("ID" INTEGER ,"URI" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ( "ID" ), FOREIGN KEY (STORY_ID) REFERENCES STORY(ID))');
        tx.executeSql('CREATE TABLE VIDEO ("ID" INTEGER ,"URI" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ( "ID" ), FOREIGN KEY (STORY_ID) REFERENCES STORY(ID))');
        tx.executeSql('CREATE TABLE AUDIO ("ID" INTEGER, "URI" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ("ID"), FOREIGN KEY (STORY_ID) REFERENCES STORY(ID))')
        tx.executeSql('CREATE TABLE NOTE ("ID" INTEGER ,"Text" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ( "ID" ), FOREIGN KEY (STORY_ID) REFERENCES STORY(ID))');
    },
    
    errorTable: function(err) {
        alert("TABLE ERROR");
        alert(err.code);
    },
    
    successTable: function(tx, res) {
        alert("SUCCESS TABLE");
    },
    
    Create: function(statement) {
        this.currentStatement = statement;
        this.database.transaction(this.executeCreate.bind(this));
    },
    
    executeCreate: function(tx) {
        tx.executeSql(this.currentStatement, [], this.executeCreateComplete.bind(this));
    },
    
    executeCreateComplete: function(tx, res) {
        alert(res.insertId);
        this.callback.insertCallback(res);
    },
    
    Read: function(statement) {
        this.currentStatement = statement;
        this.database.transaction(this.executeRead.bind(this));
    },
    
    executeRead: function (tx) {
        tx.executeSql(this.currentStatement, [], this.executeReadComplete.bind(this), this.executeReadError);
    },
    
    executeReadError: function(tx,err) {
        alert(err.code);  
    },
    
    executeReadComplete: function(tx, res) {
        this.callback.readCallback(res).bind(this.callback);
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