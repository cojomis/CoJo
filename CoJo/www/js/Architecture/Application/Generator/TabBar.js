function TabItem(inpId, inpSrc) {
    this.id = inpId;
    this.src = inpSrc;
}

function TabBarItem(inpImgSrc, inpId, inpPos, inpCallback) {
    this.callback = inpCallback;
    alert("CREATING TABBARITEM");
    this.imgSrc = inpImgSrc;
    this.id = inpId;
    this.pos = 64*inpPos;
}

TabBarItem.prototype = {
    Render: function(appendDiv) {
        var aPosition = document.createElement("div");
        aPosition.addEventListener('click', this.itemSelected.bind(this), false);
        aPosition.className = "tabBarItem";
        var thePos = this.pos + "px";
        //alert("pos: " + thePos);
        aPosition.style.left = thePos;
        
        var img = document.createElement("img");
        img.src = this.imgSrc;
        img.className = "tabItem";
        
        aPosition.appendChild(img);
        
        //alert(aPosition.style.left);
        
        //aPosition.style.backgroundColor = "red";
        
        appendDiv.appendChild(aPosition);
    },
    
    itemSelected: function(element) {
        this.callback.tabItemSelected(this);
    }
}

function TabBar(inpA, inpB, inpC, inpD, inpCallback) {
    
    this.callback = inpCallback;
    
    this.a = new TabBarItem(inpA.src, inpA.id, 0, this);
    this.b = new TabBarItem(inpB.src, inpB.id, 1, this);
    this.c = new TabBarItem(inpC.src, inpC.id, 3, this);
    this.d = new TabBarItem(inpD.src, inpD.id, 4, this);
}

TabBar.prototype = {
    Render: function(appendDiv) {
        alert("RENDERING TAB BAR");
        var tabBar = document.createElement("div");
        tabBar.className = "tabBar";
        
        this.a.Render(tabBar);
        this.b.Render(tabBar);
        this.c.Render(tabBar);
        this.d.Render(tabBar);
        
        appendDiv.appendChild(tabBar);
        
        
    },
    
    tabItemSelected: function(data) {
        alert("TAB BAR ITEM SELECTED");
        this.callback.tabItemSelected(data);
    }
}

function ViewTabBar(inpCallback) {
    alert("CREATING VIEW TAB BAR");
    this.callback = inpCallback;
    this.tabBar = new TabBar(new TabItem("notes", "img/Tab_Bar/notes.png"), new TabItem("associations", "img/Tab_Bar/associations.png"), new TabItem("media", "img/Tab_Bar/media.png"), new TabItem("share", "img/Tab_Bar/share.png"), this);
}

ViewTabBar.prototype = {
    Render: function(appendDiv) {
        alert("RENDERING VIEW TAB BAR");
        this.tabBar.Render(appendDiv);
    },
    
    tabItemSelected: function(data) {
        alert("VIEW TAB BAR ITEM SELECTED");
        this.callback.tabItemSelected(data);
    }
}