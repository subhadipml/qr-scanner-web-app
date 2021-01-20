function setupLiveReader(resultElement) {
  var closeButton = $(
    '<button class="uk-button uk-button-primary uk-width-1-1" onclick="stopBarcodeReader()">Close</button>'
  )
  var container = document.createElement('div')

  container.style.position = 'absolute'
  container.style.zIndex = '999'
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.left = '0'
  container.style.top = '0'
  container.style.background = '#474C55'
  container.id = 'barcode-reader'

  var canvas = document.createElement('canvas')
  var video = document.createElement('video')
  var context = canvas.getContext('2d')

  canvas.style.position = 'absolute'

  container.appendChild(closeButton[0])
  container.appendChild(canvas)

  document.body.appendChild(container)

  const constraints = {
    audio: false,
    video: {
      facingMode: 'environment'
    }
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
      window.currentStream = stream.getTracks()[0]
      video.width = 320

      BarcodeScanner.init()
      BarcodeScanner.streamCallback = function(result) {
        console.log('barcode detected, stream will stop')
        resultElement.value = result[0].Value

        BarcodeScanner.StopStreamDecode()
        stopBarcodeReader()
      }

      video.setAttribute('autoplay', '')
      video.setAttribute('playsinline', '')
      video.setAttribute('style', 'width: 100%')
      video.srcObject = stream
      container.appendChild(video)
      video.onloadedmetadata = function(e) {
        var canvasSetting = {
          x: 50,
          y: 20,
          width: 200,
          height: 30
        }
        var rect = video.getBoundingClientRect()
        canvas.style.height = rect.height + 'px'
        canvas.style.width = rect.width + 'px'
        canvas.style.top = rect.top + 'px'
        canvas.style.left = rect.left + 'px'
        const overlayColor = 'rgba(71, 76, 85, .9)'
        context.fillStyle = overlayColor
        context.fillRect(0, 0, rect.width, rect.height)
        context.clearRect(
          canvasSetting.x,
          canvasSetting.y,
          canvasSetting.width,
          canvasSetting.height
        )
        context.strokeStyle = '#ff671f'
        context.strokeRect(
          canvasSetting.x,
          canvasSetting.y,
          canvasSetting.width,
          canvasSetting.height
        )
        video.play()
        BarcodeScanner.DecodeStream(video)
      }
    })
    .catch(function(err) {
      console.log(err)
    })
}

function stopBarcodeReader() {
  var barcodeContainer = document.getElementById('barcode-reader')
  document.body.removeChild(barcodeContainer)

  window.currentStream.stop()
}
