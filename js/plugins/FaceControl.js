/*:
 * @target MZ
 * @plugindesc 顔向きでキャラを左右に動かすプラグイン（修正版） by サラ
 */

console.log("test");

(() => {
  const scripts = [
    'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
  ];
  let initialized = false;
  let lastX = null;

  function loadScripts(urls, cb) {
    let loaded = 0;
    urls.forEach(u => {
      const s = document.createElement('script');
      s.src = u;
      s.onload = () => {
        loaded++;
        if (loaded === urls.length) cb();
      };
      document.body.appendChild(s);
    });
  }

  function setup() {
    const video = document.createElement('video');
    video.style.display = 'none';
    document.body.appendChild(video);

    const faceMesh = new FaceMesh({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    faceMesh.onResults(rs => {
      if (rs.multiFaceLandmarks.length) {
        const nose = rs.multiFaceLandmarks[0][1];
        if (lastX !== null) {
          const dx = nose.x - lastX;
          if (dx > 0.015) $gamePlayer.moveStraight(6);
          else if (dx < -0.015) $gamePlayer.moveStraight(4);
        }
        lastX = nose.x;
      }
    });

    const cam = new Camera(video, {
      onFrame: async () => await faceMesh.send({ image: video }),
      width: 640, height: 480
    });
    cam.start();
    console.log('顔トラッキング準備完了💕');
  }

  const _SceneMapStart = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _SceneMapStart.call(this);
    if (!initialized) {
      loadScripts(scripts, () => { setup(); initialized = true; });
    }
  };
})();
