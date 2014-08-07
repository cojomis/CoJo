function MapWidget(inpData, inpCallback) {
    this.callback = inpCallback;

    this.data = inpData;
    this.appendDiv;
    
    this.map;
    

}

MapWidget.prototype = {
    Render: function() {
        var options;
        
        if (this.data.Data.Latitude != null) {
            options = {
                center: new google.maps.LatLng(this.data.Data.Latitude, this.data.Data.Longitude),
                zoom: 8
            };
        } else {
            options = {
                center: new google.maps.LatLng(-34.397, 150.644),
                zoom: 8
            }
        }
        
        this.map = new google.maps.Map(this.appendDiv, options);
        
        if (this.data.Data.Latitude != null) {
            var infoWindow = new google.maps.InfoWindow({
                map: this.map,
                position: new google.maps.LatLng(this.data.Data.Latitude, this.data.Data.Longitude),
                content: "Story Location"
            });
        }
    
    },
    
    GetCurrentLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.locationRetrieved.bind(this), this.locationError);
        }  
    },
    
    locationRetrieved: function(position) {
        //alert("Location retrieved");
        var initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        
        var infoWindow = new google.maps.InfoWindow({
           map: this.map,
           position: initialLocation,
           content: "Story Location"
        });
        
        this.callback.RetrievedLocation(position);
    },
    
    locationError: function() {
        alert("Location Error");
    }
}
