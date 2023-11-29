$(document).ready(function() {
      const cbzLink = $('#cbzLinkDiv link[rel="cbz"]').attr('href');

      if (cbzLink) {
        $('#imageCanvas').show(); // Show canvas when a .cbz file is detected
        displayCbzViewer(cbzLink);
      }

      function displayCbzViewer(cbzUrl) {
        $.ajax({
          url: cbzUrl,
          type: 'GET',
          xhrFields: {
            responseType: 'arraybuffer'
          },
          success: function(data) {
            const arrayBuffer = data;
            const zip = new JSZip();

            zip.loadAsync(arrayBuffer).then(function(zipFiles) {
              const imageFiles = Object.keys(zipFiles.files)
                .filter(filename => filename.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/));

              let currentImageIndex = 0;

              function displayImage(index) {
                const file = zipFiles.files[imageFiles[index]];

                file.async('uint8array').then(function(fileData) {
                  const blob = new Blob([fileData], { type: file._data.uncompressedFile.type });
                  const imageUrl = URL.createObjectURL(blob);

                  const canvas = $('#imageCanvas')[0];
                  const context = canvas.getContext('2d');

                  const img = new Image();
                  img.onload = function() {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    URL.revokeObjectURL(imageUrl);
                  };

                  img.src = imageUrl;
                });
              }

              displayImage(currentImageIndex);

              $('#prevBtn').on('click', function() {
                if (currentImageIndex > 0) {
                  currentImageIndex--;
                  displayImage(currentImageIndex);
                }
              });

              $('#nextBtn').on('click', function() {
                if (currentImageIndex < imageFiles.length - 1) {
                  currentImageIndex++;
                  displayImage(currentImageIndex);
                }
              });

            }).catch(function(error) {
              console.error('Error reading .cbz file:', error);
            });
          },
          error: function(xhr, status, error) {
            console.error('Error fetching .cbz file:', error);
          }
        });
      }
    });
