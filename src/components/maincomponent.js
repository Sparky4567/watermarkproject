import React, { Component } from "react";
import watermark from "watermarkjs";
import Kofi from "./kofi";
import Messenger from "./messenger";
class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.settings = {
      downloadButtonText: `Download`,
      applyButtontext: `Apply filter`,
      minFont: 120,
      defColor: "#ffffff",
      defText: "artefaktas.eu",
      filters: [
        { name: `None`, value: `none` },
        { name: `Grayscale`, value: `grayscale` },
        { name: `Blur`, value: `blur` },
        { name: `Sepia`, value: `sepia` },
        { name: `Opacity`, value: `opacity` },
        { name: `Invert`, value: `invert` },
        { name: `Saturate`, value: `saturate` },
      ],
    };
    this.state = {
      image: null,
      canvasHeight: null,
      canvasWidth: null,
      watermarkedImage: null,
      fontSize: this.settings.minFont,
      selectedColor: this.settings.defColor,
      fieldText: this.settings.defText,
      chosenFilter: null,
      sliderValue: null,
      targetFile: null,
    };
    this.inputChange = this.inputChange.bind(this);
    this.startWatermarking = this.startWatermarking.bind(this);
    this.downloadStart = this.downloadStart.bind(this);
    this.sliderChange = this.sliderChange.bind(this);
    this.watermarkModified = this.watermarkModified.bind(this);
    this.canvasStyle = {
      width: 100 + `%`,
      height: `auto`,
    };
    this.labelStyle = {
      fontWeight: `bold`,
    };

    this.fontSizer = this.fontSizer.bind(this);
    this.colorPicker = this.colorPicker.bind(this);
    this.filterChange = this.filterChange.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.kofiStyle = {
      border: `none`,
      width: 100 + "%",
      padding: 4 + `px`,
      background: `#f9f9f9`,
    };
  }

  startWatermarking() {
    let textVal = this.state.fieldText;
    var options = {
      init: function (img) {
        img.crossOrigin = "anonymous";
      },
    };

    // Consider using options if using URL
    let currentImage = this.state.image;
    let currentFontSize = this.state.fontSize;
    let currentColor = this.state.selectedColor;
    async function res(im, f, c) {
      return watermark([im], options)
        .image(
          watermark.text.center(textVal, `${f}px Josefin Slab`, `${c}`, 0.5)
        )
        .then(function (img) {
          return img.src;
        });
    }
    res(currentImage, currentFontSize, currentColor).then((data) => {
      this.setState({ watermarkedImage: data });
    });
  }

  async addWatermark(image) {
    const canvas = document.getElementById("output");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match the image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the original image
    ctx.drawImage(image, 0, 0);

    // Define the watermark text and style
    const watermarkText = "Watermark";
    ctx.font = "30px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";

    // Define the spacing between watermarks
    const spacingX = 150;
    const spacingY = 150;

    // Calculate the diagonal length to cover the canvas with watermarks
    const diagonal = Math.sqrt(
      canvas.width * canvas.width + canvas.height * canvas.height
    );

    // Draw the watermark at various positions
    for (let x = -diagonal; x < canvas.width + diagonal; x += spacingX) {
      for (let y = -diagonal; y < canvas.height + diagonal; y += spacingY) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((45 * Math.PI) / 180);
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
      }
    }
  }

  watermarkModified() {
    let textVal = this.state.fieldText;
    var options = {
      init: function (img) {
        img.crossOrigin = "anonymous";
      },
    };

    // Consider using options if using URL
    let currentImage = this.state.watermarkedImage;
    let currentFontSize = this.state.fontSize;
    let currentColor = this.state.selectedColor;
    async function res(im, f, c) {
      return watermark([im], options)
        .image(
          watermark.text.center(textVal, `${f}px Josefin Slab`, `${c}`, 0.5)
        )
        .then(function (img) {
          return img.src;
        });
    }
    res(currentImage, currentFontSize, currentColor).then((data) => {
      this.setState({ watermarkedImage: data });
    });
  }

  downloadStart() {
    const blob = this.state.watermarkedImage;
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blob;
    anchor.download = "name.png";
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(blob);
  }

  fontSizer(ev) {
    this.setState({ fontSize: ev.target.value });
  }

  colorPicker(ev) {
    this.setState({ selectedColor: ev.target.value });
  }

  textChange(ev) {
    this.setState({
      fieldText: ev.target.value,
    });
  }

  inputChange(ev) {
    let img = ev.target.files[0];
    this.setState({ targetFile: img });
    let url = URL.createObjectURL(img);
    this.setState({ image: url, watermarkedImage: null });
  }

  filterChange(ev) {
    let selectedValue = ev.currentTarget.selectedOptions[0].value;
    this.setState({ chosenFilter: selectedValue });
  }

  sliderChange(ev) {
    let slideVal = ev.currentTarget.value;
    this.setState({ sliderValue: slideVal });
  }

  defineImage(effect, effectStrength) {
    let tempCanvas = document.createElement("canvas");
    let previmg = document.querySelector("img");
    let img = new Image();
    let context = tempCanvas.getContext("2d");
    img.src = previmg.src;
    img.height = previmg.naturalHeight;
    img.width = previmg.naturalWidth;

    img.addEventListener("load", () => {
      if (effectStrength > 0 && effectStrength < 100) {
        effectStrength = effectStrength / 100;
      } else {
        effectStrength = 1;
      }
      tempCanvas.height = img.height;
      tempCanvas.width = img.width;
      context.filter = `${effect}(${effectStrength})`;
      context.drawImage(img, 0, 0, img.width, img.height);
      context.filter = `none`;
      let tUrl = tempCanvas.toDataURL("image/png", 0.92);
      var byteString = atob(tUrl.split(",")[1]);
      var mimeString = tUrl.split(",")[0].split(":")[1].split(";")[0];

      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ab], { type: mimeString });
      this.setState({ watermarkedImage: URL.createObjectURL(blob) }, () => {
        this.watermarkModified();
      });
    });
  }

  applyFilter() {
    let filterStrength = parseInt(this.state.sliderValue);
    let applyFilter = this.state.chosenFilter;

    switch (applyFilter) {
      case "grayscale":
        this.defineImage("grayscale", filterStrength);
        break;

      case "sepia":
        this.defineImage("sepia", filterStrength);
        break;

      case "blur":
        this.defineImage("blur", filterStrength);
        break;

      case "opacity":
        this.defineImage("opacity", filterStrength);
        break;

      case "invert":
        this.defineImage("invert", filterStrength);
        break;

      case "saturate":
        this.defineImage("saturate", filterStrength);
        break;

      default:
        break;
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row text-center py-4">
          <div className="col-10 mx-auto shadow p-3 mb-5 bg-white rounded">
            <input
              className="form-control form-control-md my-4"
              type="file"
              onInput={(ev) => {
                this.inputChange(ev);
              }}
            ></input>
            <label
              style={this.labelStyle}
              className="form-control form-control-md my-4 text-center"
            >
              Watermark text
            </label>
            <input
              id="wt"
              className="form-control form-control-md my-4 text-center"
              type="text"
              defaultValue={this.state.fieldText}
              onInput={(ev) => {
                this.textChange(ev);
              }}
            ></input>

            <label
              style={this.labelStyle}
              className="form-control form-control-md my-4 text-center"
            >
              Font color
            </label>
            <input
              className="form-control form-control-md my-4 text-center"
              type="color"
              defaultValue={this.state.selectedColor}
              onInput={(ev) => {
                this.colorPicker(ev);
              }}
            ></input>
            <label
              style={this.labelStyle}
              className="form-control form-control-md my-4 text-center"
            >
              Font size in pixels
            </label>
            <input
              className="form-control form-control-md my-4 text-center"
              type="number"
              step="1"
              defaultValue={this.state.fontSize}
              min="0"
              onInput={(ev) => {
                this.fontSizer(ev);
              }}
            ></input>
            <button
              className="form-control form-control-md btn-dark btn btn-md"
              onClick={this.startWatermarking}
            >
              Watermark it
            </button>
          </div>
          <div className="col-10 mx-auto">
            <div className="row text-center">
              {this.state.watermarkedImage !== null ? (
                <>
                  <div className="col-10 mx-auto shadow p-3 mb-5 bg-white rounded">
                    <label
                      style={this.labelStyle}
                      className="form-control form-control-md my-4 text-center"
                    >
                      Image filter
                    </label>

                    <select
                      defaultValue={this.settings.filters[0].value}
                      onChange={(ev) => {
                        ev.currentTarget.setAttribute("selected", true);
                        this.filterChange(ev);
                      }}
                      className="form-control form-control-md my-4 text-center"
                    >
                      {this.settings.filters.map((filt, i) => {
                        if (i === 0) {
                          return (
                            <option key={i} value={filt.value}>
                              {filt.name}
                            </option>
                          );
                        } else {
                          return (
                            <option key={i} value={filt.value}>
                              {filt.name}
                            </option>
                          );
                        }
                      })}
                    </select>
                    {this.state.chosenFilter !== null ? (
                      <input
                        type="range"
                        min="1"
                        max="100"
                        className="form-control form-control-md"
                        defaultValue={0}
                        onChange={(ev) => {
                          this.sliderChange(ev);
                        }}
                      ></input>
                    ) : (
                      ""
                    )}
                    {this.state.sliderValue !== null ? (
                      <>
                        <input
                          disabled
                          value={this.state.sliderValue}
                          className="btn btn-md btn-dark form-control form-control-md my-4"
                        ></input>
                        <button
                          className="btn btn-md btn-dark form-control form-control-md my-4"
                          onClick={this.applyFilter}
                        >
                          {this.settings.applyButtontext}
                        </button>
                      </>
                    ) : (
                      ""
                    )}
                    <button
                      className="btn btn-md btn-secondary form-control form-control-md my-4"
                      onClick={this.downloadStart}
                    >
                      {this.settings.downloadButtonText}
                    </button>
                  </div>
                </>
              ) : (
                ""
              )}
              <div className="col-6">
                {this.state.image !== null ? (
                  <div>
                    <img
                      alt="eximage"
                      style={this.canvasStyle}
                      src={this.state.image}
                      className="shadow p-3 mb-5 bg-white rounded"
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="col-6">
                {this.state.watermarkedImage !== null ? (
                  <div>
                    <img
                      id="wt"
                      alt="eximage"
                      className="shadow p-3 mb-5 bg-white rounded"
                      style={this.canvasStyle}
                      src={this.state.watermarkedImage}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <Kofi />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainComponent;
