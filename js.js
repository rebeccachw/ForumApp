window.user = [];
//====================== PROFILE MODULE ======================//
var Profile = React.createClass({
    changeUserInfo: function() {
    this.props.funcChangeUserInfo(document.getElementById("username").value, document.getElementById("image").value, document.getElementById("country").value);
  },
    render:function(){
        return (
            <div id="profile_panel">
                <input onKeyUp={this.changeUserInfo} type="text" placeholder="Username" id="username" />
                <br/>
                <input onKeyUp={this.changeUserInfo} type="text" placeholder="Profile Picture" id="image" />
                <br/>
                <input onKeyUp={this.changeUserInfo} type="text" placeholder="Country" id="country" />
                <br/>
                <button id="login"><b>f</b></button>
            </div>
        )
    }
});


//====================== MESSAGE MODULE ======================//
var Message = React.createClass({
    addPost: function() {
        this.props.funcAddPost(
            document.getElementById("image").value,
            document.getElementById("country").value,
            document.getElementById("post").value,
            document.getElementById("username").value);
    },
    render:function(){
            var postArray = this.props.list.map(function(obj) {
      return (
        <div id="record">
          <div id="post_image"><img id="user_image" src={obj.image} /></div>
          <div id="post_title"><h3>-Message from {obj.username} in {obj.country}-</h3></div>
            <div className="post_messages"><h4>{obj.post}</h4></div>
        </div>
      )
    });
        return (
            <div id="message_panel">
                <textarea id="post" placeholder="Please leave a message" />
                <br/>
                <button onClick={this.addPost} id="postBut">Post</button>
                {postArray}
            </div>
        )
    }

});

//====================== APP ======================//
var App = React.createClass({
    getInitialState: function() {
        var self = this;
        $.ajax({
            url: "get.php",
            type: "GET",
            dataType: "JSON",
            success: function(resp) {
                self.setState({
                    users:resp
                });
            }
        });
      
    return { 
      username: "Your Name",
      image: "http://gazettereview.com/wp-content/uploads/2016/03/facebook-avatar.jpg",
      country: "",
      post: "",
      users: window.user
    }
  },
    addPost: function(image, country, post, username){
        var obj = {
            image: image,
            country: country,
            post: post,
            username: username
            }
        this.state.users.push(obj);
        
        $.ajax({
            url: "send.php",
            type: "post",
            data: {
                username: username,
                image: image,
                country: country,
                post: post
            }
        });
      
    this.setState({
      users: this.state.users
    });
  },
    changeUserInfo: function(username, image, country) {
        this.setState({
            username: username,
            image: image
        });
    },
    render:function(){
        return (
            <div id="display">
                <div id="pic_name">
                    <img src={this.state.image} id="profile_pic"/>
                    <br/>
                    <b>{this.state.username}</b>
                    <Profile funcChangeUserInfo={this.changeUserInfo} username={this.state.username} image={this.state.image}/>
                    <div id="map"></div>
                </div>
            
                <Message funcAddPost={this.addPost} list={this.state.users}/>
            </div>
        )
    }
});


ReactDOM.render(
  <App />,
  document.getElementById("app")
);

//====================== FB API ======================//
window.fbAsyncInit = function() {
    FB.init({
      appId      : '717078125114266',
      xfbml      : true,
      version    : 'v2.8'
    });
    
    var login = document.getElementById("login");
    
    login.onclick = function(){
        FB.login(function(resp){
            console.log(resp);
            if(resp.status == "connected"){
                window.user.login = true;
                FB.api("/me?fields=name,picture",function(uresp){
                  window.user.name = uresp.name;
                  window.user.image = uresp.picture.data.url;
                  document.getElementById("username").value = window.user.name;
                  document.getElementById("image").value = window.user.image;
                });
            } else {
                return false;
            }
        });
    }

};


(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//====================== MAP ======================//
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 3,
      lng: 3
    },
    zoom: 3
  });

  var infoWindow = new google.maps.InfoWindow({
    map: map
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var newPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(newPosition);
      infoWindow.setContent('Click Map to Select a country');
      map.setCenter(newPosition);
    });

  }
}

initMap();

var geoCoder = new google.maps.Geocoder();

google.maps.event.addListener(map, 'click', function(event) {
  geoCoder.geocode({
      'latLng': event.latLng
    },

    function(results, status) {
      var location = results[0].address_components;
      console.log(results[0].address_components);
      for (var i = location.length - 1; i >= 0; i--) {
        if (location[i].types.indexOf("country") != -1) {
          document.getElementById("country").value = location[i].long_name;
        }
      }
    });
});