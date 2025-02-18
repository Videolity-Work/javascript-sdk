class VideolityPlayer extends HTMLElement {
  constructor() {
    super();
    this.aspectRatio = this.getAttribute("viewRatio") || "16:9";
    this.src = this.getAttribute("src");
    this.iframe = null;
  }

  connectedCallback() {
    this.renderIframe();
    this.resizeIframe();
    this.setupEventListeners();
  }

  renderIframe() {
    const [width, height] = this.aspectRatio.split(":").map(Number);
    this.iframe = document.createElement("iframe");
    this.iframe.src = this.src + `&viewRatio=${this.aspectRatio}`;
    this.iframe.style.width = "100%";
    this.iframe.style.border = "none";
    this.style.display = "block";
    this.iframe.style.height = `${this.offsetWidth * (height / width)}px`;
    this.appendChild(this.iframe);
  }

  resizeIframe() {
    const [width, height] = this.aspectRatio.split(":").map(Number);
    const updateSize = () => {
      this.iframe.style.height = `${this.offsetWidth * (height / width)}px`;
    };
    window.addEventListener("resize", updateSize);
    updateSize();
  }

  setupEventListeners() {
    window.addEventListener("message", (event) => {
      if (event.data?.for === "videolityIframeResize") {
        const newRatio = event.data.aspectRatio;
        if (newRatio) {
          this.aspectRatio = newRatio;
          this.resizeIframe();
        }
      }
    });
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeIframe);
  }
}

window.customElements.define("videolity-player", VideolityPlayer);

class VideolityImage extends HTMLElement {
  constructor() {
    super();
    this.src = this.getAttribute("src");
    this.viewRatio = this.getAttribute("viewRatio") || "16:9";
    this.image = null;
  }

  connectedCallback() {
    this.renderImage();
    this.resizeImage();
  }

  renderImage() {
    const [width, height] = this.viewRatio.split(":").map(Number);
    this.image = document.createElement("img");
    this.image.src = this.src;
    this.image.style.width = "100%";
    this.image.style.height = `${this.offsetWidth * (height / width)}px`;
    this.image.style.objectFit = "cover"; // Optionally adjust how the image fits
    this.appendChild(this.image);
  }

  resizeImage() {
    const [width, height] = this.viewRatio.split(":").map(Number);
    const updateSize = () => {
      this.image.style.height = `${this.offsetWidth * (height / width)}px`;
    };
    window.addEventListener("resize", updateSize);
    updateSize();
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.resizeImage);
  }
}

window.customElements.define("videolity-image", VideolityImage);
