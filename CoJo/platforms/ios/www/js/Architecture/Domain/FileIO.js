function FileIO(inpCallback) {
    this.callback = inpCallback;
    this.rootDirectory;
    this.entry;
}

FileIO.prototype = {
    ResolvePermURI: function(inpURI) {
        window.resolveLocalFileSystemURI("file://" + inpURI, this.ResolveSuccess.bind(this), this.resOnError.bind(this));
    },
    
    ResolveSuccess: function(inpEntry) {
        this.entry = inpEntry;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.gotFS.bind(this));
        
    },
    
    gotFS: function(fs) {
        this.rootDirectory = fs.root.toURL();
        fs.root.getDirectory("Media", {create: true, exclusive: false}, this.gotDirectory.bind(this), this.resOnError);  
    },
    
    gotDirectory: function(dir) {
        var fileName = "m";
        fileName += new Date().getTime();
        fileName += this.entry.name;
        
        //alert("fn: " + fileName);
        this.entry.moveTo(dir, fileName, this.successMove.bind(this), this.resOnError); 
    },
    
    successMove: function(entry) {
        this.callback.permSuccess(this.rootDirectory + "Media/" + entry.name);
    },
    
    resOnError: function(error) {
        alert("error");  
    }
}