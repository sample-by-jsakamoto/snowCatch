(function() {
    var KEY_CODE = {
        left: 37,
        right: 39
    };
    var key_value = 0;
    var snow_man_rightLimit = 0;

    var audio = null;
    var audioPlayed = false;

    var canvas;
    var ctx;
    var img = { snow: null, snow_man: null };
    var snow_x = 0;
    var snow_y = 0;
    var snow_man_x = 0;
    var snow_man_y = 0;
    var requestId = 0;
    var pause = false;

    //DOM のロードが完了したら実行
    document.addEventListener('DOMContentLoaded', function() {
        loadAssets();
        setHandlers();
    });

    function setHandlers() {
        document.addEventListener('keydown', function(event) {
            if (event.which == KEY_CODE.left) {
                key_value = -3;
            } else if (event.which == KEY_CODE.right) {
                key_value = 3;
            }
        })
        document.addEventListener('keyup', function() {
            key_value = 0;
        });
    }

    function loadAssets() {
        //HTML ファイル上の canvas エレメントのインスタンスを取得
        canvas = document.getElementById('bg');

        //アニメーションの開始
        canvas.addEventListener('click', function() {
            if (!requestId) {
                pause = false;
                renderFrame();
            }
            else {
                requestId = 0;
                pause = true;
            }
        });

        audio = new Audio('./audio/kiiiin1.mp3');

        //2D コンテキストを取得
        ctx = canvas.getContext('2d');

        //image オブジェクトのインスタンスを生成
        img.snow = new Image();

        //image オブジェクトに画像をロード
        img.snow.src = './img/snow.png';

        //画像読み込み完了後、Canvas に 画像を表示する
        img.snow.onload = function() {
            //snow_x = getCenterPosition(canvas.clientWidth, img.snow.width);
            //snow_y = 0;
            snow_x = getRandomInt(0, canvas.clientWidth - img.snow.width);
            snow_y = getRandomInt(-img.snow.height, -500);
            ctx.drawImage(img.snow, snow_x, snow_y);
        };

        //雪だるまインスタンスの生成 
        img.snow_man = new Image();
        img.snow_man.src = './img/snow_man.png';

        img.snow_man.onload = function() {
            snow_man_x = getCenterPosition(canvas.clientWidth, img.snow_man.width);
            //雪だるま画像は、表示領域の底辺に画像の底辺がつくように
            snow_man_y = canvas.clientHeight - img.snow_man.height;

            snow_man_rightLimit = canvas.clientWidth - img.snow_man.width;

            ctx.drawImage(img.snow_man, snow_man_x, snow_man_y);
        };
    }

    //中央の Left 位置を求める関数
    function getCenterPosition(containerWidth, itemWidth) {
        return (containerWidth / 2) - (itemWidth / 2);
    }

    function renderFrame() {
        if (pause) return;

        //snow の y 値(縦位置) が canvas からはみ出たら先頭に戻す
        if (snow_y > canvas.clientHeight) {
            // snow_y = 0;
            snow_x = getRandomInt(0, canvas.clientWidth - img.snow.width);
            snow_y = getRandomInt(-img.snow.height, -500);
            audio.pause();
            audio.currentTime = 0;
            audioPlayed = false;
        };

        //canvas をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //snow の y 値を増分
        //snow_y += 2;
        snow_y += 6;

        if ((snow_man_x < snow_man_rightLimit && key_value > 0) || (snow_man_x >= 3 && key_value < 0)) {
            snow_man_x += key_value;
        }

        //画像を描画
        ctx.drawImage(img.snow, snow_x, snow_y);
        ctx.drawImage(img.snow_man, snow_man_x, snow_man_y);

        if (isHit(img.snow, snow_x, snow_y, img.snow_man, snow_man_x, snow_man_y)) {
            hitJob();
        }

        //ループを開始
        requestId = window.requestAnimationFrame(renderFrame);
    }

    function isHit(a, ax, ay, b, bx, by) {
        return (
            ((ax <= bx && bx <= ax + a.width) || (bx <= ax && ax <= bx + b.width)) &&
            ((ay <= by && by <= ay + a.height) || (by <= ay && ay <= by + b.height))
        );
    }

    function hitJob() {
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'red';
        ctx.fillText('Hit!!', 5, 24);

        if (!audioPlayed) {
            audio.play();
            audioPlayed = true;
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})();
