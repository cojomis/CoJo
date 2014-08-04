function TabItem(inpId) {
    this.id = inpId;
}

function TabBarItem(inpId, inpPos, inpCallback) {
    this.callback = inpCallback;
    //alert("CREATING TABBARITEM");
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
    
    this.a = new TabBarItem(inpA.id, 0, this);
    this.b = new TabBarItem(inpB.id, 1, this);
    this.c = new TabBarItem(inpC.id, 3, this);
    this.d = new TabBarItem(inpD.id, 4, this);
}

TabBar.prototype = {
    Render: function(appendDiv) {
        alert("RENDERING TAB BAR");
        appendDiv.innerHTML = "";
        var tabBar = document.createElement("div");
        tabBar.className = "tabBar";
        
        var tabBarImage = document.createElement("img");
        tabBarImage.src = this.callback.imgSrc;
        
        tabBar.appendChild(tabBarImage);
        
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
    //alert("CREATING VIEW TAB BAR");
    
    this.imgSrc = "img/tabBar.png";
    this.callback = inpCallback;
    this.tabBar = new TabBar(new TabItem("notes"), new TabItem("associations"), new TabItem("media"), new TabItem("share"), this);
}

ViewTabBar.prototype = {
    Render: function(appendDiv) {
        //alert("RENDERING VIEW TAB BAR");
        this.tabBar.Render(appendDiv);
    },
    
    tabItemSelected: function(data) {
        //alert("VIEW TAB BAR ITEM SELECTED");
        this.callback.tabItemSelected(data);
    }
}

function BasicEditTabBar(inpCallback) {
    this.imgSrc = "img/basicEdit.png";
    this.callback = inpCallback;
    this.tabBar = new TabBar(new TabItem(""), new TabItem(""), new TabItem(""), new TabItem("delete"), this);
}

BasicEditTabBar.prototype = {
    Render: function(appendDiv) {
        //alert("RENDERING VIEW TAB BAR");
        this.tabBar.Render(appendDiv);
    },
    
    tabItemSelected: function (data) {
        this.callback.tabItemSelected(data);
    }
}

function MapEditTabBar(inpCallback) {
    this.imgSrc = "img/mapEdit.png";
    this.callback = inpCallback;
    this.tabBar = new TabBar(new TabItem(""), new TabItem(""), new TabItem(""), new TabItem("geolocate"), this);
}

MapEditTabBar.prototype = {
    Render: function(appendDiv) {
        //alert("RENDERING VIEW TAB BAR");
        this.tabBar.Render(appendDiv);
    },
    
    tabItemSelected: function (data) {
        this.callback.tabItemSelected(data);
    }
}