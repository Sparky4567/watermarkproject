import React, { Component } from "react";

class Messenger extends Component {
  componentDidMount() {
    var chatbox = document.getElementById("fb-customer-chat");
    chatbox.setAttribute("page_id", "100772582494491");
    chatbox.setAttribute("attribution", "biz_inbox");

    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          xfbml: true,
          version: "v14.0",
        });
      }
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }

  render() {
    return (
      <div>
        <div id="fb-root"></div>
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </div>
    );
  }
}

export default Messenger;
