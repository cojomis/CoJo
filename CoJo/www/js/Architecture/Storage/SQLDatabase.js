/*
 *SQLDatabase
 *Manages the creation of transactions and execution of  SQL statements. Ensures the database to created correctly.
 *
 */

function SQLDatabase(inpCallback) {
    // Database configuration (Created if the database does not already exists)
    this.database = window.openDatabase("CoJooooaaAFAFGfFFf", "1.0", "CojooooaaAFAFFFfFf", 200000, this.databaseReady.bind(this));
    this.currentStatement = "";
    
    // When results are received (i.e. Select), the listener is called to inform them of the results
    this.callback = inpCallback;
    this.statements = "";

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
        tx.executeSql('CREATE TABLE STORY ("STORY_ID" INTEGER ,"Headline" VARCHAR ,"Story_Date" VARCHAR ,"Story_Time" VARCHAR ,"Latitude" VARCHAR ,"Longitude" VARCHAR ,PRIMARY KEY ( "STORY_ID" ))');
        tx.executeSql('CREATE TABLE IMAGE ("ID" INTEGER ,"URI" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ( "ID" ), FOREIGN KEY (STORY_ID) REFERENCES STORY(STORY_ID))');
        tx.executeSql('CREATE TABLE VIDEO ("ID" INTEGER ,"URI" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ( "ID" ), FOREIGN KEY (STORY_ID) REFERENCES STORY(STORY_ID))');
        tx.executeSql('CREATE TABLE AUDIO ("ID" INTEGER, "URI" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ("ID"), FOREIGN KEY (STORY_ID) REFERENCES STORY(STORY_ID))')
        tx.executeSql('CREATE TABLE NOTE ("ID" INTEGER ,"Text" VARCHAR ,"STORY_ID" INTEGER ,PRIMARY KEY ( "ID" ), FOREIGN KEY (STORY_ID) REFERENCES STORY(STORY_ID))');
        tx.executeSql('INSERT INTO STORY(Headline) VALUES("App Story")');
    },
    
    errorTable: function(err) {
        alert("TABLE ERROR");
        alert(err.code);
    },
    
    successTable: function(tx, res) {
        alert("SUCCESS TABLE");
    },
    
    UpdateState: function(inpStatements) {
        this.statements = inpStatements;
        this.database.transaction(this.executeUpdateState.bind(this), this.UpdateStateError, this.UpdateStateSuccess.bind(this));
    },
    
    executeUpdateState: function(tx) {
        for (i = 0; i < this.statements.length; i++) {
            tx.executeSql(this.statements[i], []);
        }
    },
    
    UpdateStateSuccess: function() {
        this.callback.transactionComplete();
    },
    
    UpdateStateError: function(err) {
        alert("TRANSACTION ERROR");
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
    }
}