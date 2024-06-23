import React, { Component } from "react";

class Kofi extends Component {
  constructor(props) {
    super(props);
    this.kofiStyle = {
      height: 712 + `px`,
      width: 100 + `%`,
    };
  }
  render() {
    return (
      <iframe
        className="col-10 mx-auto shadow p-3 mb-5 bg-white rounded"
        id="kofiframe"
        src="https://ko-fi.com/artefaktas/?hidefeed=true&widget=true&embed=true&preview=true"
        style={this.kofiStyle}
        height="712"
        title="artefaktas"
      ></iframe>
    );
  }
}

export default Kofi;
