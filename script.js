// Get the necessary HTML elements
const container = document.querySelector(".container");
const innerContainer = document.querySelector(".inner-container");
const fileNameContainer = document.querySelector(".file-name-container");
const convertBtn = document.querySelector("#convertBtn");
const imageUpload = document.querySelector("#imageUpload");
const browseLabel = document.querySelector("#browseLabel");

// Add event listeners
innerContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  container.classList.add("highlight");
});

innerContainer.addEventListener("dragleave", () => {
  container.classList.remove("highlight");
});

innerContainer.addEventListener("drop", (e) => {
  e.preventDefault();
  container.classList.remove("highlight");

  const files = e.dataTransfer.files;

  if (files.length > 0) {
    const file = files[0];
    handleImage(file);
    convertBtn.disabled = false;
    convertBtn.addEventListener("click", () => {
      convertAndDownload(file);
    });
  }
});

browseLabel.addEventListener("click", () => {
  imageUpload.click();
});

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  handleImage(file);
  convertBtn.disabled = false;
  convertBtn.addEventListener("click", () => {
    convertAndDownload(file);
  });
});

// Function to handle the dropped image or selected file
function handleImage(file) {
  if (file.type.startsWith("image/")) {
    fileNameContainer.innerText = file.name;
    fileNameContainer.classList.add("active");
  } else {
    fileNameContainer.innerText = "No file selected";
    fileNameContainer.classList.remove("active");
  }
}

// Image Conversion and Download
function convertAndDownload(imageFile) {
  if (imageFile) {
    const sizes = [16, 48, 128, 192, 256, 512];
    const zip = new JSZip();
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      sizes.forEach((size) => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, size, size);
        canvas.toBlob(function (blob) {
          zip.file(`icon${size}.png`, blob, { binary: true });

          if (size === sizes[sizes.length - 1]) {
            zip.generateAsync({ type: "blob" }).then(function (content) {
              const zipFilename = "all_sizes.zip";
              const downloadLink = document.createElement("a");
              downloadLink.href = URL.createObjectURL(content);
              downloadLink.download = zipFilename;
              downloadLink.style.display = "none";
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            });
          }
        }, "image/png");
      });
    };

    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  }
}
