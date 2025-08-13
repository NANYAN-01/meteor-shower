document.addEventListener('DOMContentLoaded', function () {
    // 画布设置
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // 调整画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ===================== 流星雨 =====================
    const meteors = [];
    const meteorCount = 20;

    function createMeteor() {
        return {
            x: Math.random() * canvas.width,
            y: 0,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 5 + 2,
            tailLength: Math.random() * 100 + 50,
            color: `hsla(${Math.random() * 60 + 200}, 100%, 70%, 1)`
        };
    }

    for (let i = 0; i < meteorCount; i++) {
        const m = createMeteor();
        m.y = Math.random() * canvas.height; // 随机起始位置
        meteors.push(m);
    }

    function drawMeteor(meteor) {
        const gradient = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.tailLength, meteor.y + meteor.tailLength
        );
        gradient.addColorStop(0, meteor.color);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.tailLength, meteor.y + meteor.tailLength);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.size;
        ctx.stroke();

        // 星点头部
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    function updateMeteors() {
        for (let i = 0; i < meteors.length; i++) {
            meteors[i].x -= meteors[i].speed;
            meteors[i].y += meteors[i].speed;
            if (meteors[i].x < 0 || meteors[i].y > canvas.height) {
                meteors[i] = createMeteor();
            }
        }
    }

    // ===================== 星空背景 =====================
    const stars = [];
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            blinkSpeed: Math.random() * 0.05,
            brightness: Math.random()
        });
    }

    function drawStars() {
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.brightness += s.blinkSpeed;
            if (s.brightness > 1 || s.brightness < 0) s.blinkSpeed = -s.blinkSpeed;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.5 + s.brightness * 0.5})`;
            ctx.fill();
        }
    }

    // ===================== 巨蟹座星盘 =====================

    /**
     * 绘制巨蟹座（Cancer）星盘
     */
    function drawCancer() {
        // 画布中心（在画面稍上方，以免被文字遮挡）
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 3;
        const scale = Math.min(canvas.width, canvas.height) * 0.22; // 适配大小

        // ------------ 主要恒星（相对坐标，范围 -1 ~ 1） ------------
        // 下面的坐标是 **手工调校**，目的是让星座形状与真实星图相近
        // 参考星表：α Cancri (Acubens)、β Cancri (Altarf)、γ Cancri (Asellus Borealis)、δ Cancri (Asellus Australis)…
        const stars = [
            //   x      y      名称          半径（像素）
            {x: -0.55, y: -0.75, name: "α Cancri\nAcubens", size: 3.6},
            {x: -0.40, y: -0.55, name: "β Cancri\nAltarf", size: 3.2},
            {x: -0.20, y: -0.35, name: "γ Cancri\nAsellus Borealis", size: 3.2},
            {x:  0.00, y: -0.15, name: "", size: 2.5},
            {x:  0.20, y: -0.05, name: "δ Cancri\nAsellus Australis", size: 3.2},
            {x:  0.40, y: -0.15, name: "ε Cancri", size: 2.8},
            {x:  0.55, y: -0.30, name: "ζ Cancri", size: 2.6},
            {x:  0.70, y: -0.45, name: "η Cancri", size: 2.5},
            // 下面两颗是“蟹螯”部分（比较散）
            {x: -0.25, y: 0.30, name: "", size: 2.2},
            {x:  0.25, y: 0.40, name: "", size: 2.2}
        ];

        // ------------ 连接线（星座的轮廓） ------------
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], // 主体“C”形
            [2, 8], [4, 9] // 螯的两根短线
        ];

        // ------------ 绘制星光光晕 ------------
        stars.forEach(star => {
            const x = centerX + star.x * scale;
            const y = centerY + star.y * scale;

            // 光晕（使用柔和的橙红渐变）
            const halo = ctx.createRadialGradient(x, y, 0, x, y, star.size * 6);
            halo.addColorStop(0, 'rgba(255,165,100,0.8)');   // 橙
            halo.addColorStop(0.5, 'rgba(255,165,100,0.3)');
            halo.addColorStop(1, 'rgba(255,165,100,0)');

            ctx.beginPath();
            ctx.fillStyle = halo;
            ctx.arc(x, y, star.size * 6, 0, Math.PI * 2);
            ctx.fill();

            // 恒星本体（白色稍带透明）
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // 星名（如有）
            if (star.name) {
                ctx.font = '13px Arial';
                ctx.fillStyle = 'rgba(255,165,100,0.9)';
                ctx.textAlign = 'left';
                ctx.fillText(star.name, x + star.size + 3, y - star.size - 3);
            }
        });

        // ------------ 绘制连线 ------------
        ctx.strokeStyle = 'rgba(255,165,100,0.4)';
        ctx.lineWidth = 1.6;
        connections.forEach(pair => {
            const [i, j] = pair;
            const si = stars[i];
            const sj = stars[j];
            ctx.beginPath();
            ctx.moveTo(centerX + si.x * scale, centerY + si.y * scale);
            ctx.lineTo(centerX + sj.x * scale, centerY + sj.y * scale);
            ctx.stroke();
        });

        // ------------ 星座标题 ------------
        ctx.font = 'bold 22px Arial';
        ctx.fillStyle = 'rgba(255,165,100,0.8)';
        ctx.textAlign = 'center';
        ctx.fillText('Cancer', centerX, centerY + scale + 35);

        // ------------ 随机闪烁（小星星） ------------
        stars.forEach(star => {
            if (Math.random() > 0.985) { // 稍微低频率的闪烁
                const x = centerX + star.x * scale;
                const y = centerY + star.y * scale;
                ctx.beginPath();
                ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,1)';
                ctx.fill();
            }
        });
    }

    // ===================== 动画循环 =====================
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景星空
        drawStars();

        // 巨蟹座星盘
        drawCancer();

        // 流星雨
        meteors.forEach(drawMeteor);
        updateMeteors();

        requestAnimationFrame(animate);
    }
    animate();

    // ===================== 文字逐字显现 =====================
    const messages = [
        "没想到我会以这种方式发消息给你吧，\n我想你啦",
        "是不是也是看上流星雨啦\n而且，还是独属于你的流星雨！",
        "祝愿小乖天天开心\n天天哈哈哈哈哈哈hahaha",
        "最后呢，\n一句话，\n小乖请开心！\n有我在呢！"
    ];
    let currentMessageIndex = 0;
    const messageElement = document.getElementById('message');

    function typeMessage(text, idx = 0) {
        if (idx < text.length) {
            messageElement.textContent = text.substring(0, idx + 1);
            setTimeout(() => typeMessage(text, idx + 1), 100);
        } else {
            setTimeout(() => {
                currentMessageIndex = (currentMessageIndex + 1) % messages.length;
                messageElement.textContent = '';
                typeMessage(messages[currentMessageIndex]);
            }, 3000);
        }
    }
    typeMessage(messages[0]);
});
