(() => {

    /* =====================================================
       HELPER
    ===================================================== */

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];

    const cl = (v, a, b) =>
        Math.max(a, Math.min(b, v));

    const pad = (n) =>
        String(n).padStart(2, "0");


    /* =====================================================
       ELEMENT
    ===================================================== */

    const intro = $("#intro");
    const scene = $("#scene");
    const cv = $("#cv");

    if (!intro || !scene || !cv) return;

    const g = cv.getContext("2d");

    const nav = $("#nav");

    const eyebrow = $("#eyebrow");
    const title = $("#heroTitle");
    const desc = $("#heroDesc");
    const caption = $("#sceneCaption");

    const count = $("#sceneCount");
    const bar = $("#progressBar");
    const stage = $("#scrollStage");

    const burger = $("#burger");


    /* =====================================================
       SCENE DATA
    ===================================================== */

    const S = [

        [
            "01 · Pertama Kali",
            "Pertama kali aku<br><em>mengenal alam.</em>",
            "Semua bermula dari rasa penasaran. Dari satu perjalanan, aku mulai menikmati jalur, udara dingin, suara air, dan suasana yang jauh dari ramai.",
            "Awal cerita · Rasa penasaran"
        ],

        [
            "02 · Dua Warna",
            "Air Terjun<br><em>Dua Warna.</em>",
            "Dari atas tebing, air jatuh menuju telaga biru. Di sini perjalanan tentang alam terasa semakin nyata.",
            "Sibolangit · Sumatera Utara"
        ],

        [
            "03 · Sibayak",
            "Gunung<br><em>Sibayak.</em>",
            "Naik perlahan, menikmati jalur, kabut, udara dingin, dan pemandangan dari ketinggian.",
            "Karo · Perjalanan"
        ],

        [
            "04 · Sibuatan",
            "Gunung<br><em>Sibuatan.</em>",
            "Perjalanan bersama kawan, langkah yang panjang, obrolan sepanjang jalur, dan cerita yang akhirnya jadi kenangan.",
            "Sumatera Utara · Bersama kawan"
        ],

        [
            "05 · Ikan",
            "Ada kehidupan<br><em>di bawah air.</em>",
            "Air tidak pernah benar-benar diam. Ada riak, percikan, dan kehidupan kecil yang bergerak di bawahnya.",
            "Kolam · Loncatan"
        ],

        [
            "06 · Pulang",
            "Cerita alam<br><em>belum selesai.</em>",
            "Enam langkah selesai. Scroll sekali lagi untuk membuka seluruh cerita, foto, video, tempat, dan wishlist perjalanan.",
            "Perjalanan · Lanjut ke bawah"
        ]

    ];


    const N = S.length;
    const LAST = N - 1;


    /* =====================================================
       RANDOM
    ===================================================== */

    let seed = 11;

    const R = () => {

        seed =
            seed * 16807 %
            2147483647;

        return seed / 2147483647;

    };


    /* =====================================================
       VARIABLES
    ===================================================== */

    let W;
    let H;
    let D;

    let WH;
    let FT;
    let FB;
    let PS;
    let FW;
    let CX;

    let mx = 0;

    let t = 0;

    let cur = 0;
    let target = 0;

    let shown = -1;

    /*
       locked = true
       berarti animasi air terjun sedang aktif.

       locked = false
       berarti user sudah masuk ke content biasa.
    */

    let locked = true;

    let cool = 0;

    let acc = 0;
    let accTimer;

    let ty = null;

    let nextRing = 0;


    /* =====================================================
       OBJECTS
    ===================================================== */

    let trees = [];
    let edgeL = [];
    let edgeR = [];
    let streaks = [];
    let flies = [];
    let rocks = [];

    const parts = [];
    const rings = [];


/* =====================================================
   FISH SCHOOL

   Setiap ikan hanya lompat SATU KALI.
   Setelah masuk kembali ke air,
   ikan akan berenang terus dan tidak lompat lagi.
===================================================== */
/* =====================================================
   FISH SCHOOL
   =====================================================

   3 ikan.

   Urutan:
   1. Menunggu
   2. Lompat satu kali
   3. Masuk kembali ke air
   4. Berenang terus

   Tidak ada lompatan kedua.
===================================================== */

const fishSchool = [

    {
        x: 0,
        y: 0,

        scale: .46,
        flip: 1,

        baseX: .30,

        /* kedalaman ikan di bawah permukaan */
        swimY: .16,

        swimSpeed: 42,

        /* waktu mulai lompat */
        jumpDelay: .20,

        /* durasi satu lompatan */
        jumpDuration: 1.15,

        /* tinggi lompatan */
        jumpHeight: .23,

        state: "waiting",

        jumpTime: 0,
        swimTime: 0
    },

    {
        x: 0,
        y: 0,

        scale: .39,
        flip: -1,

        baseX: .67,

        swimY: .24,

        swimSpeed: 34,

        jumpDelay: 1.15,
        jumpDuration: 1.25,
        jumpHeight: .19,

        state: "waiting",

        jumpTime: 0,
        swimTime: 0
    },

    {
        x: 0,
        y: 0,

        scale: .33,
        flip: 1,

        baseX: .48,

        swimY: .31,

        swimSpeed: 28,

        jumpDelay: 2.25,
        jumpDuration: 1.20,
        jumpHeight: .16,

        state: "waiting",

        jumpTime: 0,
        swimTime: 0
    }

];


/*
   Status keseluruhan ikan.

   Akan dimulai ketika scene ikan
   mulai terlihat.
*/

let fishSceneStarted = false;

let fishSceneTime = 0;

    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        D =
            Math.min(
                window.devicePixelRatio || 1,
                1.75
            );

        W = scene.clientWidth;
        H = scene.clientHeight;

        cv.width = W * D;
        cv.height = H * D;

        WH = H * 2.3;

        FT = H * .44;

        FB = H * 1.66;

        PS =
            FB +
            (WH - FB) * .55;

        FW =
            Math.max(
                W * .13,
                110
            );


        seed = 11;

        trees = [];
        edgeL = [];
        edgeR = [];
        rocks = [];


        for (
            let x = -20;
            x < W + 40;
            x += 16 + R() * 22
        ) {

            trees.push([
                x,
                .6 + R() * .9
            ]);

        }


        for (
            let y = FT - H * .06;
            y < WH;
            y += 26
        ) {

            edgeL.push(R());
            edgeR.push(R());

        }


        streaks =
            Array.from(
                {
                    length: 150
                },
                () => ({

                    o: R() * 2 - 1,

                    sp:
                        280 +
                        R() * 380,

                    len:
                        30 +
                        R() * 110,

                    ph:
                        R() * 3000,

                    a:
                        .25 +
                        R() * .55,

                    w:
                        .8 +
                        R() * 2.2

                })
            );


        flies =
            Array.from(
                {
                    length: 24
                },
                () => ({

                    x: R(),

                    y: R(),

                    p:
                        R() *
                        Math.PI *
                        2,

                    s:
                        .3 +
                        R()

                })
            );


        for (
            let i = 0;
            i < 18;
            i++
        ) {

            let x =
                R() * W;


            if (
                Math.abs(
                    x - W / 2
                ) < FW
            ) {

                x +=
                    (
                        x < W / 2
                            ? -1
                            : 1
                    ) *
                    FW *
                    1.2;

            }


            rocks.push({

                x,

                y:
                    FB +
                    R() * 34,

                w:
                    34 +
                    R() * 90,

                h:
                    16 +
                    R() * 34

            });

        }

    }


    /* =====================================================
       WATERFALL WIDTH
    ===================================================== */

    const hw = (y, tt) => {

        const u =
            cl(
                (y - FT) /
                (FB - FT),
                0,
                1
            );

        return (

            FW / 2 *
            (
                1 +
                .32 *
                u *
                u
            )

        )
        +
        Math.sin(
            y * .03 +
            tt * 2
        ) *
        2;

    };


    /* =====================================================
       MOUNTAIN RIDGE
    ===================================================== */

    const ridge =
        (x, k, f) => {

            const u =
                x / W * f;

            return (

                .5 +

                .28 *
                Math.sin(
                    u * 2.1 + k
                ) +

                .16 *
                Math.sin(
                    u * 5.3 +
                    k * 2.7
                ) +

                .06 *
                Math.sin(
                    u * 13 +
                    k * 4
                )

            );

        };


    /* =====================================================
       PINE TREE
    ===================================================== */

    function pine(
        x,
        y,
        h,
        c
    ) {

        const w =
            h * .28;

        g.fillStyle = c;


        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const ty =
                y -
                h *
                (
                    .12 +
                    i * .15
                );

            const tw =
                w *
                (
                    1 -
                    i * .14
                );


            g.beginPath();

            g.moveTo(
                x,
                ty - h * .2
            );

            g.lineTo(
                x + tw,
                ty
            );

            g.lineTo(
                x - tw,
                ty
            );

            g.fill();

        }


        g.fillRect(
            x - 2,
            y - h * .12,
            4,
            h * .12
        );

    }


    /* =====================================================
       SKY
    ===================================================== */

    function sky(cam) {

        const sk =
            g.createLinearGradient(
                0,
                0,
                0,
                H
            );


        sk.addColorStop(
            0,
            "#0a2626"
        );

        sk.addColorStop(
            .5,
            "#1c5750"
        );

        sk.addColorStop(
            1,
            "#2f7a6c"
        );


        g.fillStyle = sk;

        g.fillRect(
            0,
            0,
            W,
            H
        );


        const my =
            H * .2 -
            cam * .1;

        const r =
            Math.max(
                W * .2,
                200
            );


        const mg =
            g.createRadialGradient(
                W / 2,
                my,
                0,
                W / 2,
                my,
                r
            );


        mg.addColorStop(
            0,
            "rgba(240,235,190,.95)"
        );

        mg.addColorStop(
            .12,
            "rgba(226,232,190,.55)"
        );

        mg.addColorStop(
            1,
            "rgba(120,200,170,0)"
        );


        g.fillStyle = mg;

        g.fillRect(
            0,
            0,
            W,
            H
        );

    }


    /* =====================================================
       MOUNTAINS
    ===================================================== */

    function mountains(cam) {

        const L = [

            [
                .2,
                .5,
                .3,
                1,
                1.6,
                "#4c8f86",
                "#1d5a52"
            ],

            [
                .32,
                .58,
                .24,
                3.1,
                2.4,
                "#2c6d63",
                "#123f38"
            ]

        ];


        L.forEach(
            (
                [
                    pf,
                    b,
                    a,
                    k,
                    f,
                    c1,
                    c2
                ],
                li
            ) => {

                g.save();


                g.translate(
                    -mx * pf * 40,
                    -cam * pf
                );


                const gr =
                    g.createLinearGradient(
                        0,
                        H * (b - a),
                        0,
                        H * (b + .25)
                    );


                gr.addColorStop(
                    0,
                    c1
                );

                gr.addColorStop(
                    1,
                    c2
                );


                g.fillStyle = gr;

                g.beginPath();

                g.moveTo(
                    -40,
                    H * 1.6
                );


                for (
                    let x = -40;
                    x <= W + 40;
                    x += 14
                ) {

                    g.lineTo(
                        x,
                        H * b -
                        H * a *
                        ridge(
                            x,
                            k,
                            f
                        )
                    );

                }


                g.lineTo(
                    W + 40,
                    H * 1.6
                );

                g.fill();


                if (li === 1) {

                    for (
                        const [x, s]
                        of trees
                    ) {

                        pine(
                            x,
                            H * b -
                            H * a *
                            ridge(
                                x,
                                k,
                                f
                            ) +
                            8,
                            30 *
                            s *
                            H / 800,
                            "#0d3630"
                        );

                    }

                }


                const hz =
                    g.createLinearGradient(
                        0,
                        H * (
                            b -
                            a * .3
                        ),
                        0,
                        H * (
                            b + .12
                        )
                    );


                hz.addColorStop(
                    0,
                    "rgba(160,220,200,0)"
                );

                hz.addColorStop(
                    1,
                    "rgba(160,220,200,.22)"
                );


                g.fillStyle = hz;

                g.fillRect(
                    -40,
                    H * (
                        b -
                        a * .3
                    ),
                    W + 80,
                    H * (
                        a * .3 +
                        .12
                    )
                );


                g.restore();

            }
        );

    }


    /* =====================================================
       RIVER
    ===================================================== */

    function river() {

        const h =
            H * .18;

        const top =
            FT - h;


        const gr =
            g.createLinearGradient(
                0,
                top,
                0,
                FT
            );


        gr.addColorStop(
            0,
            "rgba(120,200,185,0)"
        );

        gr.addColorStop(
            1,
            "rgba(190,240,225,.85)"
        );


        g.fillStyle = gr;

        g.beginPath();

        g.moveTo(
            CX - W * .2,
            top
        );

        g.lineTo(
            CX + W * .2,
            top
        );

        g.lineTo(
            CX + hw(FT, t),
            FT
        );

        g.lineTo(
            CX - hw(FT, t),
            FT
        );

        g.fill();


        g.lineCap = "round";


        for (
            let i = 0;
            i < 30;
            i++
        ) {

            const u =
                (
                    t *
                    .32 *
                    (
                        1 +
                        i % 3 *
                        .25
                    ) +
                    i * .137
                ) % 1;


            const o =
                (
                    (
                        i *
                        .618
                    ) % 1
                ) *
                2 -
                1;


            const y =
                top +
                h * u;


            const x =
                CX +
                o *
                (
                    FW * .48 +
                    (
                        1 - u
                    ) *
                    W * .17
                );


            g.strokeStyle =
                `rgba(
                    230,
                    255,
                    246,
                    ${Math.sin(u * Math.PI) * .6}
                )`;


            g.lineWidth =
                1 +
                u * 2;


            g.beginPath();

            g.moveTo(
                x,
                y
            );

            g.lineTo(
                x -
                o * 2 * u,
                y +
                8 +
                u * 30
            );

            g.stroke();

        }

    }


    /* =====================================================
       RAVINE
    ===================================================== */

    function ravine() {

        const gr =
            g.createLinearGradient(
                0,
                FT,
                0,
                FB
            );


        gr.addColorStop(
            0,
            "#0a2723"
        );

        gr.addColorStop(
            1,
            "#173f38"
        );


        g.fillStyle = gr;


        g.fillRect(
            CX - FW * .95,
            FT - 6,
            FW * 1.9,
            FB - FT + 10
        );

    }


    /* =====================================================
       WATERFALL
    ===================================================== */

    function fall() {

        const L =
            FB - FT;


        const gr =
            g.createLinearGradient(
                0,
                FT,
                0,
                FB
            );


        gr.addColorStop(
            0,
            "rgba(170,235,215,.88)"
        );

        gr.addColorStop(
            .5,
            "rgba(215,250,238,.84)"
        );

        gr.addColorStop(
            1,
            "rgba(255,255,255,.95)"
        );


        g.fillStyle = gr;

        g.beginPath();


        for (
            let y = FT;
            y <= FB;
            y += 14
        ) {

            g.lineTo(
                CX -
                hw(y, t),
                y
            );

        }


        for (
            let y = FB;
            y >= FT;
            y -= 14
        ) {

            g.lineTo(
                CX +
                hw(y, t),
                y
            );

        }


        g.closePath();

        g.fill();


        g.save();

        g.clip();

        g.lineCap =
            "round";


        streaks.forEach(
            (
                s,
                i
            ) => {

                const y =
                    FT +
                    (
                        (
                            s.ph +
                            t * s.sp
                        ) %
                        (
                            L +
                            s.len
                        )
                    ) -
                    s.len;


                const x =
                    CX +
                    s.o *
                    hw(
                        y +
                        s.len / 2,
                        t
                    ) *
                    .95;


                g.strokeStyle =
                    i % 3
                        ? `rgba(
                            255,
                            255,
                            255,
                            ${s.a}
                        )`
                        : `rgba(
                            50,
                            140,
                            125,
                            ${s.a * .45}
                        )`;


                g.lineWidth =
                    s.w;


                g.beginPath();

                g.moveTo(
                    x,
                    y
                );

                g.lineTo(
                    x,
                    y + s.len
                );

                g.stroke();

            }
        );


        for (
            let k = 0;
            k < 8;
            k++
        ) {

            const yb =
                FT +
                (
                    (
                        t *
                        (
                            180 +
                            k * 35
                        ) +
                        k *
                        L /
                        8
                    ) %
                    L
                );


            const w =
                hw(
                    yb,
                    t
                );


            g.fillStyle =
                "rgba(255,255,255,.2)";


            g.beginPath();

            g.ellipse(
                CX,
                yb,
                w,
                5 +
                Math.sin(
                    t * 3 + k
                ) * 2,
                0,
                0,
                6.3
            );

            g.fill();

        }


        g.restore();


        g.strokeStyle =
            "rgba(255,255,255,.5)";

        g.lineWidth = 3;


        g.beginPath();


        for (
            let y = FT;
            y <= FB;
            y += 14
        ) {

            g.lineTo(
                CX -
                hw(y, t),
                y
            );

        }


        g.stroke();


        g.beginPath();


        for (
            let y = FT;
            y <= FB;
            y += 14
        ) {

            g.lineTo(
                CX +
                hw(y, t),
                y
            );

        }


        g.stroke();

    }


    /* =====================================================
       CLIFFS
    ===================================================== */

    function cliffs() {

        const top =
            FT -
            H * .05;


        for (
            const s
            of [-1, 1]
        ) {

            const e =
                s < 0
                    ? edgeL
                    : edgeR;


            const x0 =
                s < 0
                    ? -20
                    : W + 20;


            const xi =
                CX +
                s *
                (
                    hw(
                        FT,
                        t
                    ) +
                    14
                );


            const gr =
                g.createLinearGradient(
                    x0,
                    0,
                    xi,
                    0
                );


            gr.addColorStop(
                0,
                "#061a17"
            );

            gr.addColorStop(
                .75,
                "#123a33"
            );

            gr.addColorStop(
                1,
                "#2f6357"
            );


            g.fillStyle = gr;

            g.beginPath();

            g.moveTo(
                x0,
                top - 30
            );

            g.lineTo(
                xi,
                top
            );


            const pts = [];


            e.forEach(
                (
                    r,
                    i
                ) => {

                    const y =
                        top +
                        i * 26;


                    pts.push([
                        CX +
                        s *
                        (
                            hw(
                                y,
                                t
                            ) +
                            10 +
                            r * 30
                        ),
                        y
                    ]);

                }
            );


            pts.forEach(
                (p) =>
                    g.lineTo(
                        p[0],
                        p[1]
                    )
            );


            g.lineTo(
                x0,
                WH
            );

            g.fill();


            g.strokeStyle =
                "rgba(190,240,220,.28)";

            g.lineWidth = 2;

            g.beginPath();


            pts.forEach(
                (
                    p,
                    i
                ) => {

                    if (i) {

                        g.lineTo(
                            p[0],
                            p[1]
                        );

                    } else {

                        g.moveTo(
                            p[0],
                            p[1]
                        );

                    }

                }
            );


            g.stroke();


            g.strokeStyle =
                "rgba(0,0,0,.25)";

            g.lineWidth = 1;


            for (
                let i = 3;
                i < pts.length - 1;
                i += 3
            ) {

                const p =
                    pts[i];


                g.beginPath();

                g.moveTo(
                    p[0] +
                    s * 8,
                    p[1]
                );

                g.lineTo(
                    p[0] +
                    s *
                    (
                        50 +
                        e[i] * 90
                    ),
                    p[1] + 5
                );

                g.stroke();

            }


            const mg =
                g.createLinearGradient(
                    0,
                    top - 30,
                    0,
                    top + 50
                );


            mg.addColorStop(
                0,
                "#3f7d5f"
            );

            mg.addColorStop(
                1,
                "rgba(63,125,95,0)"
            );


            g.fillStyle = mg;


            g.fillRect(
                s < 0
                    ? x0
                    : xi,
                top - 30,
                s < 0
                    ? xi - x0
                    : W - xi + 20,
                80
            );


            for (
                const [x, sc]
                of trees
            ) {

                if (
                    (
                        s < 0 &&
                        x < CX - FW
                    ) ||
                    (
                        s > 0 &&
                        x > CX + FW
                    )
                ) {

                    pine(
                        x,
                        top + 8,
                        46 *
                        sc *
                        H / 800,
                        "#08251f"
                    );

                }

            }

        }

    }


    /* =====================================================
       POOL
    ===================================================== */

    function pool() {

        const top =
            FB - 6;


        const gr =
            g.createLinearGradient(
                0,
                top,
                0,
                WH
            );


        gr.addColorStop(
            0,
            "#2f8f84"
        );

        gr.addColorStop(
            .25,
            "#146058"
        );

        gr.addColorStop(
            1,
            "#04201d"
        );


        g.fillStyle = gr;


        g.fillRect(
            -10,
            top,
            W + 20,
            WH - top + 10
        );


        g.lineWidth = 1.2;


        for (
            let i = 0;
            i < 16;
            i++
        ) {

            const k =
                i / 15;


            const y =
                FB +
                20 +
                (
                    WH -
                    FB -
                    20
                ) *
                Math.pow(
                    k,
                    1.4
                );


            g.strokeStyle =
                `rgba(
                    200,
                    245,
                    235,
                    ${.05 + .1 * (1 - k)}
                )`;


            g.beginPath();


            for (
                let x = -10;
                x <= W + 10;
                x += 18
            ) {

                g.lineTo(
                    x,
                    y +
                    Math.sin(
                        x *
                        .02 *
                        (
                            1 + k
                        ) +
                        t *
                        (
                            1 + k
                        ) +
                        i
                    ) *
                    (
                        2 +
                        6 * k
                    )
                );

            }


            g.stroke();

        }


        const rg =
            g.createLinearGradient(
                0,
                FB,
                0,
                FB +
                H * .4
            );


        rg.addColorStop(
            0,
            "rgba(230,255,246,.55)"
        );

        rg.addColorStop(
            1,
            "rgba(230,255,246,0)"
        );


        g.fillStyle = rg;


        g.fillRect(
            CX - FW * .6,
            FB,
            FW * 1.2,
            H * .4
        );


        const fg =
            g.createRadialGradient(
                CX,
                FB + 8,
                0,
                CX,
                FB + 8,
                FW * 1.4
            );


        fg.addColorStop(
            0,
            "rgba(255,255,255,.85)"
        );

        fg.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );


        g.save();


        g.translate(
            CX,
            FB + 8
        );

        g.scale(
            1,
            .3
        );

        g.translate(
            -CX,
            -FB - 8
        );


        g.fillStyle = fg;


        g.fillRect(
            CX - FW * 1.4,
            FB - FW,
            FW * 2.8,
            FW * 2
        );


        g.restore();


        for (
            const r
            of rocks
        ) {

            const rgr =
                g.createLinearGradient(
                    0,
                    r.y - r.h,
                    0,
                    r.y
                );


            rgr.addColorStop(
                0,
                "#41766a"
            );

            rgr.addColorStop(
                1,
                "#0b2a25"
            );


            g.fillStyle = rgr;


            g.beginPath();


            g.ellipse(
                r.x,
                r.y,
                r.w,
                r.h,
                0,
                Math.PI,
                6.283
            );


            g.fill();


            g.strokeStyle =
                "rgba(210,255,240,.3)";

            g.lineWidth = 1.5;


            g.beginPath();


            g.ellipse(
                r.x,
                r.y,
                r.w,
                r.h,
                0,
                Math.PI * 1.1,
                Math.PI * 1.6
            );


            g.stroke();


            g.fillStyle =
                "rgba(220,255,245,.22)";


            g.beginPath();


            g.ellipse(
                r.x,
                r.y + 2,
                r.w * 1.05,
                4,
                0,
                0,
                6.283
            );


            g.fill();

        }

    }


    /* =====================================================
       WATER RINGS
    ===================================================== */

    function drawRings(dt) {

        if (
            t >
            nextRing
        ) {

            rings.push({

                x:
                    CX +
                    (
                        R() -
                        .5
                    ) *
                    FW,

                y:
                    FB + 22,

                r: 10,

                a: .5,

                gr: 60

            });


            nextRing =
                t + .5;

        }


        for (
            let i =
                rings.length - 1;
            i >= 0;
            i--
        ) {

            const r =
                rings[i];


            r.r +=
                r.gr *
                dt;


            r.a -=
                .32 *
                dt;


            if (
                r.a <= 0
            ) {

                rings.splice(
                    i,
                    1
                );

                continue;

            }


            g.strokeStyle =
                `rgba(
                    220,
                    255,
                    245,
                    ${r.a}
                )`;


            g.lineWidth = 1.5;


            g.beginPath();


            g.ellipse(
                r.x,
                r.y,
                r.r,
                r.r * .25,
                0,
                0,
                6.283
            );


            g.stroke();

        }

    }


    /* =====================================================
       SPLASH
    ===================================================== */

    function splash(
        x,
        y,
        n
    ) {

        for (
            let i = 0;
            i < n;
            i++
        ) {

            parts.push({

                x:
                    x +
                    (
                        R() -
                        .5
                    ) *
                    20,

                y,

                vx:
                    (
                        R() -
                        .5
                    ) *
                    260,

                vy:
                    -(
                        120 +
                        R() *
                        380
                    ),

                age: 0,

                life:
                    .7 +
                    R() * .6,

                r:
                    1.5 +
                    R() * 3.5

            });

        }


        rings.push(
            {
                x,
                y,
                r: 8,
                a: .75,
                gr: 120
            },
            {
                x,
                y,
                r: 4,
                a: .55,
                gr: 70
            }
        );

    }


    /* =====================================================
       FISH
    ===================================================== */

    function drawFish(
        x,
        y,
        ang,
        flip,
        a,
        sc,
        fl
    ) {

        g.save();

        g.translate(
            x,
            y
        );

        g.scale(
            flip * sc,
            sc
        );

        g.rotate(ang);

        g.globalAlpha = a;


        g.save();

        g.translate(
            -32,
            0
        );

        g.rotate(fl);

        g.fillStyle =
            "#ff6a2d";


        g.beginPath();

        g.moveTo(
            2,
            0
        );

        g.quadraticCurveTo(
            -18,
            -20,
            -30,
            -22
        );

        g.quadraticCurveTo(
            -22,
            0,
            -30,
            22
        );

        g.quadraticCurveTo(
            -18,
            20,
            2,
            0
        );

        g.fill();

        g.restore();


        g.fillStyle =
            "#ff7a35";


        g.beginPath();

        g.moveTo(
            -6,
            -12
        );

        g.quadraticCurveTo(
            4,
            -30,
            18,
            -13
        );

        g.fill();


        const gr =
            g.createLinearGradient(
                -30,
                -14,
                30,
                14
            );


        gr.addColorStop(
            0,
            "#ff8a3d"
        );

        gr.addColorStop(
            .55,
            "#ffb45e"
        );

        gr.addColorStop(
            1,
            "#fff1d6"
        );


        g.fillStyle = gr;


        g.beginPath();

        g.moveTo(
            42,
            0
        );

        g.bezierCurveTo(
            30,
            -18,
            -6,
            -20,
            -34,
            -3
        );

        g.lineTo(
            -34,
            3
        );

        g.bezierCurveTo(
            -6,
            20,
            30,
            18,
            42,
            0
        );

        g.fill();


        g.fillStyle =
            "rgba(200,40,20,.75)";


        g.beginPath();

        g.ellipse(
            4,
            -6,
            9,
            5,
            0,
            0,
            6.3
        );

        g.fill();


        g.beginPath();

        g.ellipse(
            -14,
            4,
            7,
            4,
            0,
            0,
            6.3
        );

        g.fill();


        g.strokeStyle =
            "rgba(255,255,255,.55)";

        g.lineWidth = 2;


        g.beginPath();

        g.moveTo(
            -12,
            -9
        );

        g.quadraticCurveTo(
            10,
            -14,
            26,
            -3
        );

        g.stroke();


        g.restore();

    }


    /* =====================================================
       FISH UPDATE
    ===================================================== */

  /* =====================================================
   FISH UPDATE

   Tiga ikan:
   - ikan pertama berenang normal
   - ikan kedua melompat tinggi
   - ikan ketiga melompat dengan timing berbeda
===================================================== */

/* =====================================================
   FISH UPDATE
   =====================================================

   Ikan hanya aktif pada scene 05.

   Setiap ikan:

   WAITING
       ↓
   JUMP
       ↓
   SWIM

   Setelah SWIM tidak akan pernah kembali
   ke JUMP.
===================================================== */

function fishStep(dt, cam, prog) {

    /*
       Posisi scene.

       0 = scene 01
       1 = scene 02
       2 = scene 03
       3 = scene 04
       4 = scene 05
       5 = scene 06
    */

    const scenePosition =
        prog * LAST;


    /*
       Ikan mulai muncul ketika mendekati
       scene 05.

       Jadi ikan tidak muncul di Sibayak,
       Sibuatan, atau scene lainnya.
    */

    const fishSceneStart = 3.55;

    const fishSceneEnd = 5.25;


    if (
        scenePosition < fishSceneStart ||
        scenePosition > fishSceneEnd
    ) {

        return;

    }


    /*
       Scene ikan baru dimulai.
    */

    if (!fishSceneStarted) {

        fishSceneStarted = true;

        fishSceneTime = 0;


        fishSchool.forEach(
            (fish) => {

                fish.state = "waiting";

                fish.jumpTime = 0;

                fish.swimTime = 0;

            }
        );

    }


    fishSceneTime += dt;


    /*
       PENTING:

       Jangan menggunakan:

       FB - cam

       karena canvas sudah berada di dalam:

       g.translate(0, -cam)

       Jadi posisi air harus tetap
       menggunakan koordinat WORLD.
    */

    const waterY =
        FB +
        H * .015;


    fishSchool.forEach(
        (fish, i) => {


            /* =================================================
               1. WAITING
               ================================================= */

            if (
                fish.state === "waiting"
            ) {


                /*
                   Belum waktunya lompat.

                   Selama menunggu ikan berada
                   DI DALAM air.
                */

                if (
                    fishSceneTime <
                    fish.jumpDelay
                ) {

                    drawSwimmingFish(
                        fish,
                        i,
                        waterY,
                        dt
                    );

                    return;

                }


                /*
                   Waktu lompat sudah tiba.
                */

                fish.state = "jump";

                fish.jumpTime = 0;

            }


            /* =================================================
               2. JUMP
               ================================================= */

            if (
                fish.state === "jump"
            ) {

                fish.jumpTime += dt;


                /*
                   0 → 1
                */

                const p =
                    cl(
                        fish.jumpTime /
                        fish.jumpDuration,
                        0,
                        1
                    );


                /*
                   Kurva parabola.

                   0   = mulai keluar air
                   .5  = titik tertinggi
                   1   = masuk kembali
                */

                const arc =
                    Math.sin(
                        p * Math.PI
                    );


                /*
                   Gerakan horizontal
                   sedikit ketika melompat.
                */

                const x =
                    W * fish.baseX +

                    (
                        p - .5
                    ) *

                    W *
                    .12 *

                    fish.flip;


                /*
                   Posisi vertikal.

                   Mulai dari permukaan air,
                   naik,
                   kemudian kembali ke air.
                */

                const y =
                    waterY -

                    arc *
                    H *
                    fish.jumpHeight;


                /*
                   Ikan mengarah ke atas
                   ketika naik dan menukik
                   ketika turun.
                */

                const angle =
                    (
                        .5 - p
                    ) *

                    .75 *

                    fish.flip;


                /*
                   Gerakan sirip.
                */

                const flap =
                    Math.sin(
                        t * 18 +
                        i * 2
                    ) *

                    .15;


                drawFish(
                    x,
                    y,
                    angle,
                    fish.flip,
                    1,
                    fish.scale,
                    flap
                );


                /*
                   Percikan hanya ketika ikan
                   keluar atau masuk air.
                */

                if (
                    fish.jumpTime < .16 ||

                    fish.jumpTime >
                    fish.jumpDuration - .16
                ) {

                    if (
                        Math.random() < .55
                    ) {

                        splash(
                            x,
                            waterY,
                            2 +
                            Math.floor(
                                R() * 3
                            )
                        );

                    }

                }


                /*
                   LOMPAT SELESAI.

                   Sekarang ikan berubah
                   permanen menjadi SWIM.
                */

                if (
                    fish.jumpTime >=
                    fish.jumpDuration
                ) {

                    fish.state = "swim";

                    fish.swimTime = 0;


                    /*
                       Riak ketika masuk air.
                    */

                    rings.push({

                        x: x,

                        y: waterY,

                        r: 7,

                        a: .65,

                        gr: 90

                    });

                }


                return;

            }


            /* =================================================
               3. SWIMMING
               =================================================

               Setelah masuk air:

               TIDAK LOMPAT LAGI.

               Ikan terus berenang.
            */

            if (
                fish.state === "swim"
            ) {

                fish.swimTime += dt;


                /*
                   Kedalaman ikan.

                   Semakin besar swimY,
                   semakin dalam ikan.
                */

                const depth =
                    H *
                    fish.swimY;


                const direction =
                    fish.flip;


                /*
                   Gerakan horizontal.
                */

                const xRaw =

                    W *
                    fish.baseX +

                    direction *
                    fish.swimTime *
                    fish.swimSpeed;


                /*
                   Bikin ikan keluar
                   dari sisi kanan/kiri lalu
                   muncul lagi dari sisi lainnya.
                */

                const x =
                    (
                        xRaw %
                        (W + 100)
                    );


                const wrappedX =
                    x < -50
                        ? x + W + 100
                        : x - 50;


                /*
                   POSISI IKAN DI DALAM AIR.

                   Ini bagian penting.

                   FB = permukaan air.

                   Kemudian ikan ditaruh
                   beberapa persen di bawahnya.
                */

                const y =

                    FB +

                    depth +

                    Math.sin(
                        t * 2.1 +
                        i * 1.8
                    ) *

                    5;


                /*
                   Gerakan kecil naik turun
                   saat berenang.
                */

                const angle =

                    Math.sin(
                        t * 1.7 +
                        i
                    ) *

                    .035;


                /*
                   Gerakan ekor.
                */

                const flap =

                    Math.sin(
                        t * 14 +
                        i * 2
                    ) *

                    .12;


                /*
                   Alpha dibuat sedikit transparan
                   agar terlihat berada DI DALAM air.
                */

                drawFish(

                    wrappedX,

                    y,

                    angle,

                    direction,

                    .58,

                    fish.scale,

                    flap

                );

            }

        }
    );

}
/* =====================================================
   FISH WAITING / SWIMMING
   ===================================================== */

function drawSwimmingFish(
    fish,
    i,
    waterY,
    dt
) {

    /*
       Ikan tetap berada
       DI BAWAH permukaan.
    */

    const y =

        FB +

        H *
        fish.swimY +

        Math.sin(
            t * 2 +
            i
        ) *

        4;


    /*
       Gerakan kiri-kanan kecil
       ketika masih menunggu.
    */

    const x =

        W *
        fish.baseX +

        Math.sin(
            t * .8 +
            i * 1.7
        ) *

        W *
        .07;


    drawFish(

        x,

        y,

        Math.sin(
            t * 1.5 +
            i
        ) *

        .025,

        fish.flip,

        .48,

        fish.scale,

        Math.sin(
            t * 13 +
            i
        ) *

        .1

    );

}
    /* =====================================================
       SPRAY
    ===================================================== */

    function spray(dt) {

        if (
            Math.random() <
            .25
        ) {

            splash(
                CX +
                (
                    Math.random() -
                    .5
                ) *
                FW *
                .5,

                FB,

                2 +
                Math.floor(
                    Math.random() * 4
                )
            );

        }


        for (
            let i =
                parts.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                parts[i];


            p.age += dt;


            p.x +=
                p.vx *
                dt;

            p.y +=
                p.vy *
                dt;


            p.vy +=
                600 *
                dt;


            if (
                p.age >
                p.life
            ) {

                parts.splice(
                    i,
                    1
                );

                continue;

            }


            const alpha =
                1 -
                p.age /
                p.life;


            g.fillStyle =
                `rgba(
                    255,
                    255,
                    255,
                    ${alpha}
                )`;


            g.beginPath();


            g.arc(
                p.x,
                p.y,
                p.r,
                0,
                Math.PI * 2
            );


            g.fill();

        }

    }


    /* =====================================================
       MIST
    ===================================================== */

    function mist() {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const x =
                CX +
                Math.sin(
                    t * .35 +
                    i
                ) *
                FW *
                .7;


            const y =
                FB -
                10 +
                Math.sin(
                    t * .5 +
                    i * 2
                ) *
                20;


            const r =
                30 +
                i * 7;


            const mg =
                g.createRadialGradient(
                    x,
                    y,
                    0,
                    x,
                    y,
                    r
                );


            mg.addColorStop(
                0,
                "rgba(230,255,246,.12)"
            );

            mg.addColorStop(
                1,
                "rgba(230,255,246,0)"
            );


            g.fillStyle = mg;


            g.fillRect(
                x - r,
                y - r,
                r * 2,
                r * 2
            );

        }

    }


    /* =====================================================
       LIGHT RAYS
    ===================================================== */

    function rays(prog) {

        const alpha =
            .05 +
            prog * .05;


        g.save();

        g.globalAlpha =
            alpha;


        g.fillStyle =
            "#ffffff";


        g.beginPath();


        g.moveTo(
            W * .25,
            0
        );

        g.lineTo(
            W * .5,
            0
        );

        g.lineTo(
            W * .72,
            H
        );

        g.lineTo(
            W * .58,
            H
        );

        g.closePath();

        g.fill();


        g.restore();

    }


    /* =====================================================
       FOREGROUND
    ===================================================== */

    function foreground(prog) {

        const by =
            H * 1.04 -
            prog * H * .06;


        const sw =
            Math.sin(
                t * .7
            ) *
            2;


        for (
            const s
            of [-1, 1]
        ) {

            [
                [.02, .62],
                [.09, .42],
                [.15, .3]
            ].forEach(
                (
                    [a, h],
                    i
                ) => {

                    pine(
                        s < 0
                            ? W * a + sw
                            : W * (1 - a) - sw,

                        by,

                        H * h,

                        i
                            ? "#04150f"
                            : "#020d0a"
                    );

                }
            );


            const bx =
                s < 0
                    ? W * .05
                    : W * .95;


            const gr =
                g.createLinearGradient(
                    0,
                    H * .92,
                    0,
                    H * 1.1
                );


            gr.addColorStop(
                0,
                "#2a5a4f"
            );

            gr.addColorStop(
                .3,
                "#0a241f"
            );

            gr.addColorStop(
                1,
                "#020c0a"
            );


            g.fillStyle = gr;


            g.beginPath();


            g.ellipse(
                bx,
                H * 1.04,
                W * .14,
                H * .1,
                0,
                Math.PI,
                6.283
            );


            g.fill();

        }

    }


    /* =====================================================
       MAIN DRAW
    ===================================================== */

    function draw(
        dt,
        cam,
        prog
    ) {

        g.setTransform(
            D,
            0,
            0,
            D,
            0,
            0
        );


        CX =
            W * .5 +
            mx * W * .012;


        sky(cam);

        mountains(cam);


        g.save();

        g.translate(
            0,
            -cam
        );


        river();

        ravine();

        fall();

        cliffs();

   pool();


/*
   IKAN DIGAMBAR SETELAH AIR
   TETAPI SEBELUM RIak AIR.

   Jadi ikan berada di dalam
   badan air, sementara riak
   bisa tampil di atas ikan.
*/

fishStep(
    dt,
    cam,
    prog
);


drawRings(dt);


mist();


spray(dt);


        g.restore();


        rays(prog);

        foreground(prog);

    }


    /* =====================================================
       CHANGE TEXT
    ===================================================== */

    function setText(n) {

        if (
            n === shown
        ) return;


        shown = n;


        const s =
            S[n];


        const els = [
            eyebrow,
            title,
            desc,
            caption
        ];


        els.forEach(
            (e) => {

                if (e)
                    e.style.opacity = 0;

            }
        );


        setTimeout(
            () => {

                if (
                    shown !== n
                ) return;


                if (eyebrow) {

                    eyebrow.textContent =
                        `${pad(n + 1)} — ${s[0]}`;

                }


                if (title) {

                    title.innerHTML =
                        s[1];

                }


                if (desc) {

                    desc.textContent =
                        s[2];

                }


                if (caption) {

                    caption.textContent =
                        s[3];

                }


                if (count) {

                    count.textContent =
                        pad(n + 1);

                }


                if (stage) {

                    stage.textContent =
                        `${pad(n + 1)} / ${N}`;

                }


                els.forEach(
                    (e) => {

                        if (e)
                            e.style.opacity = 1;

                    }
                );


            },
            170
        );


        if (bar) {

            bar.style.width =
                `${
                    (n + 1) /
                    N *
                    100
                }%`;

        }

    }


    /* =====================================================
       ANIMATION LOOP
    ===================================================== */

    let last =
        performance.now();


    function frame(now) {

        requestAnimationFrame(
            frame
        );


        const dt =
            Math.min(
                (
                    now -
                    last
                ) / 1000,
                .05
            );


        last = now;


        /*
           Jangan berhentikan animasi
           ketika content sudah dibuka.
        */

        t += dt;


        cur +=
            (
                target -
                cur
            ) *
            (
                1 -
                Math.exp(
                    -dt * 3.4
                )
            );


        if (
            Math.abs(
                target -
                cur
            ) < .001
        ) {

            cur = target;

        }


        setText(
            Math.round(cur)
        );


        const prog =
            cur /
            LAST;


        draw(
            dt,

            prog *
            (
                WH -
                H
            ) +
            Math.sin(
                t * .4
            ) *
            4,

            prog
        );

    }


    /* =====================================================
       MASUK KE CONTENT
    ===================================================== */

    function unlock(id) {

        locked = false;

        intro.classList.add(
            "done"
        );

        document.body.classList.remove(
            "locked"
        );


        setTimeout(
            () => {

                const targetEl =
                    id
                        ? $(id)
                        : $("#content");


                if (targetEl) {

                    targetEl.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            },
            400
        );

    }


    /* =====================================================
       MASUK KEMBALI KE SCENE
       DARI CONTENT
    ===================================================== */

    function enterReverseMode() {

        locked = true;

        intro.classList.remove(
            "done"
        );

        document.body.classList.add(
            "locked"
        );


        /*
           PENTING:

           Jangan langsung reset ke 01.

           Kita masuk dari scene terakhir
           sehingga user bisa scroll ke atas:

           06 → 05 → 04 → 03 → 02 → 01
        */

        target = LAST;

        cur = LAST;

        shown = -1;



        if (nav) {

            nav.classList.remove(
                "open"
            );

        }


        if (burger) {

            burger.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        setText(
            LAST
        );

    }


    /* =====================================================
       KEMBALI KE SCENE 01
       DARI BRAND
    ===================================================== */

    function relock() {

        locked = true;

        target = 0;

        cur = 0;

        shown = -1;


        intro.classList.remove(
            "done"
        );


        document.body.classList.add(
            "locked"
        );


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        if (nav) {

            nav.classList.remove(
                "light",
                "open"
            );

        }


        if (burger) {

            burger.setAttribute(
                "aria-expanded",
                "false"
            );

        }


    

        setText(0);

    }


    /* =====================================================
       SCENE STEP
    ===================================================== */

    function step(d) {

        if (
            !locked
        ) return;


        if (
            performance.now() <
            cool
        ) return;


        /*
           SCROLL KE ATAS

           06 → 05
           05 → 04
           04 → 03
           dst
        */

        if (
            d < 0 &&
            target <= 0
        ) {

            return;

        }


        /*
           SCROLL KE BAWAH

           Kalau sudah scene 06,
           buka content.
        */

        if (
            d > 0 &&
            target >= LAST
        ) {

            if (
                cur >
                LAST - .15
            ) {

                unlock();

            }

            return;

        }


        target =
            cl(
                Math.round(
                    target
                ) + d,
                0,
                LAST
            );


        cool =
            performance.now() +
            420;

    }


    /* =====================================================
       WHEEL
    ===================================================== */

    window.addEventListener(
        "wheel",
        (e) => {

            /*
               Kalau sudah di CONTENT
               dan user scroll ke ATAS
               sampai mentok paling atas,
               aktifkan kembali scene.
            */

            if (!locked) {

                if (
                    e.deltaY < 0 &&
                    window.scrollY <= 8
                ) {

                    e.preventDefault();

                    enterReverseMode();

                }

                return;

            }


            /*
               Saat scene aktif,
               tahan scroll browser.
            */

            e.preventDefault();


            acc += e.deltaY;


            clearTimeout(
                accTimer
            );


            accTimer =
                setTimeout(
                    () => {
                        acc = 0;
                    },
                    120
                );


            if (
                Math.abs(acc) >= 28
            ) {

                step(
                    Math.sign(acc)
                );

                acc = 0;

            }

        },
        {
            passive: false
        }
    );


    /* =====================================================
       TOUCH START
    ===================================================== */

    window.addEventListener(
        "touchstart",
        (e) => {

            ty =
                e.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH MOVE
    ===================================================== */

    window.addEventListener(
        "touchmove",
        (e) => {

            if (
                !locked ||
                ty === null
            ) return;


            const dy =
                ty -
                e.touches[0].clientY;


            if (
                Math.abs(dy) > 46
            ) {

                step(
                    Math.sign(dy)
                );


                ty =
                    e.touches[0].clientY;

            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH END
    ===================================================== */

    window.addEventListener(
        "touchend",
        () => {

            ty = null;

        },
        {
            passive: true
        }
    );


    /* =====================================================
       MOUSE PARALLAX
    ===================================================== */

    window.addEventListener(
        "mousemove",
        (e) => {

            mx =
                e.clientX /
                window.innerWidth -
                .5;

        }
    );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    window.addEventListener(
        "keydown",
        (e) => {

            if (!locked)
                return;


            if (
                [
                    "ArrowDown",
                    "PageDown",
                    " "
                ].includes(
                    e.key
                )
            ) {

                e.preventDefault();

                step(1);

            }


            if (
                [
                    "ArrowUp",
                    "PageUp"
                ].includes(
                    e.key
                )
            ) {

                e.preventDefault();

                step(-1);

            }

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        resize
    );


    /* =====================================================
       NAVBAR
    ===================================================== */

    $$("[data-nav]")
        .forEach(
            (a) => {

                a.addEventListener(
                    "click",
                    (e) => {

                        e.preventDefault();


                        if (nav) {

                            nav.classList.remove(
                                "open"
                            );

                        }


                        if (burger) {

                            burger.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }


                        const href =
                            a.getAttribute(
                                "href"
                            );


                        /*
                           Kalau masih di scene,
                           buka content lalu menuju
                           section yang dipilih.
                        */

                        if (locked) {

                            unlock(
                                href
                            );

                        } else {

                            const targetEl =
                                $(href);


                            if (targetEl) {

                                targetEl.scrollIntoView({
                                    behavior:
                                        "smooth"
                                });

                            }

                        }

                    }
                );

            }
        );


    /* =====================================================
       BRAND
    ===================================================== */

    $$("[data-home]")
        .forEach(
            (a) => {

                a.addEventListener(
                    "click",
                    (e) => {

                        e.preventDefault();

                        relock();

                    }
                );

            }
        );


    /* =====================================================
       TOMBOL KEMBALI
       MENUJU index.html
    ===================================================== */

    $$("[data-back]")
        .forEach(
            (a) => {

                a.addEventListener(
                    "click",
                    (e) => {

                        e.preventDefault();


                        /*
                           Karena index.html
                           satu folder dengan
                           halaman ini.

                           Saat hosting juga tetap aman.
                        */

                        window.location.href =
                            "index.html";

                    }
                );

            }
        );


    /* =====================================================
       BURGER MOBILE
    ===================================================== */

    if (burger) {

        burger.addEventListener(
            "click",
            () => {

                const open =
                    nav.classList.toggle(
                        "open"
                    );


                burger.setAttribute(
                    "aria-expanded",
                    open
                );

            }
        );

    }


    /* =====================================================
       NAVBAR ACTIVE STATE
    ===================================================== */

    function navState() {

        if (!nav)
            return;


        nav.classList.toggle(
            "light",
            !locked &&
            window.scrollY >
            window.innerHeight * .7
        );


        let active =
            null;


        $$("[data-nav]")
            .forEach(
                (a) => {

                    const href =
                        a.getAttribute(
                            "href"
                        );


                    const section =
                        $(href);


                    if (
                        section &&
                        section.getBoundingClientRect()
                            .top <
                        window.innerHeight *
                        .4
                    ) {

                        active = a;

                    }

                }
            );


        $$("[data-nav]")
            .forEach(
                (a) => {

                    a.classList.toggle(
                        "on",
                        a === active
                    );

                }
            );

    }


    window.addEventListener(
        "scroll",
        navState,
        {
            passive: true
        }
    );


    /* =====================================================
       ABOUT SECTION
    ===================================================== */

    const aboutSection =
        document.querySelector(
            ".about"
        );


    if (
        aboutSection
    ) {

        const aboutObserver =
            new IntersectionObserver(
                (
                    entries
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                aboutSection.classList.add(
                                    "about-visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .28
                }
            );


        aboutObserver.observe(
            aboutSection
        );

    }


    /* =====================================================
       ABOUT COLLAGE
    ===================================================== */

    (() => {

        const about =
            document.querySelector(
                ".about-new"
            );


        if (!about)
            return;


        /* =============================================
           INTERSECTION REVEAL
        ============================================= */

        const observer =
            new IntersectionObserver(
                (
                    entries
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                about.classList.add(
                                    "about-visible"
                                );


                                observer.unobserve(
                                    about
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .18
                }
            );


        observer.observe(
            about
        );


        /* =============================================
           MOUSE PARALLAX
        ============================================= */

        const photos =
            about.querySelectorAll(
                ".about-photo, .about-video"
            );


        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;


        about.addEventListener(
            "mousemove",
            (e) => {

                const rect =
                    about.getBoundingClientRect();


                mouseX =
                    (
                        e.clientX -
                        rect.left
                    ) /
                    rect.width -
                    .5;


                mouseY =
                    (
                        e.clientY -
                        rect.top
                    ) /
                    rect.height -
                    .5;

            }
        );


        about.addEventListener(
            "mouseleave",
            () => {

                mouseX = 0;
                mouseY = 0;

            }
        );


        function parallax() {

            currentX +=
                (
                    mouseX -
                    currentX
                ) *
                .045;


            currentY +=
                (
                    mouseY -
                    currentY
                ) *
                .045;


            photos.forEach(
                (item) => {

                    const speed =
                        parseFloat(
                            item.dataset.speed ||
                            1
                        );


                    const x =
                        currentX *
                        16 *
                        speed;


                    const y =
                        currentY *
                        12 *
                        speed;


                    item.style.setProperty(
                        "--parallax-x",
                        `${x}px`
                    );


                    item.style.setProperty(
                        "--parallax-y",
                        `${y}px`
                    );

                }
            );


            requestAnimationFrame(
                parallax
            );

        }


        parallax();


        /* =============================================
           VIDEO PLAY BUTTON
        ============================================= */

        const videoCards =
            about.querySelectorAll(
                ".about-video"
            );


        videoCards.forEach(
            (card) => {

                const video =
                    card.querySelector(
                        "video"
                    );


                const button =
                    card.querySelector(
                        ".video-play"
                    );


                if (
                    !video ||
                    !button
                ) return;


                button.addEventListener(
                    "click",
                    (e) => {

                        e.stopPropagation();


                        if (
                            video.paused
                        ) {

                            video.play();

                            button.innerHTML =
                                "<span>❚❚</span>";

                        } else {

                            video.pause();

                            button.innerHTML =
                                "<span>▶</span>";

                        }

                    }
                );


                video.addEventListener(
                    "ended",
                    () => {

                        button.innerHTML =
                            "<span>▶</span>";

                    }
                );


                card.addEventListener(
                    "mouseenter",
                    () => {

                        if (
                            video.readyState >= 2 &&
                            video.paused
                        ) {

                            video
                                .play()
                                .catch(
                                    () => {}
                                );

                        }

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        if (
                            !video.dataset.manual
                        ) {

                            video.pause();

                        }

                    }
                );


                button.addEventListener(
                    "click",
                    () => {

                        video.dataset.manual =
                            "true";

                    }
                );

            }
        );

    })();


    /* =====================================================
       INITIALIZE
    ===================================================== */

    resize();

    document.body.classList.add(
        "locked"
    );


    /*
       Scene mulai dari 01.
    */

    target = 0;

    cur = 0;

    setText(0);


    requestAnimationFrame(
        frame
    );


})();
/* =========================================================
   SIBAYAK — TYPING KEYBOARD ANIMATION
========================================================= */

const sibayakTyping = document.querySelector(
    "#sibayakTyping"
);

const sibayakTitle = document.querySelector(
    ".sibayak-title"
);


if (
    sibayakTyping &&
    sibayakTitle
){

    const text =
        "Sibayak";

    let index = 0;

    let deleting = false;

    let pause = false;


    function sibayakType(){

        /* =========================================
           JEDA
        ========================================= */

        if(pause){

            setTimeout(
                sibayakType,
                900
            );

            pause = false;

            return;

        }


        /* =========================================
           MENGETIK
        ========================================= */

        if(!deleting){

            index++;

            sibayakTyping.textContent =
                text.substring(
                    0,
                    index
                );


            sibayakTitle.classList.remove(
                "typing-backward"
            );

            sibayakTitle.classList.add(
                "typing-forward"
            );


            if(index >= text.length){

                pause = true;

                sibayakTitle.classList.remove(
                    "typing-forward"
                );

                sibayakTitle.classList.add(
                    "typing-complete"
                );


                deleting = true;

            }

        }


        /* =========================================
           MENGHAPUS
        ========================================= */

        else{

            index--;

            sibayakTyping.textContent =
                text.substring(
                    0,
                    index
                );


            sibayakTitle.classList.remove(
                "typing-complete"
            );

            sibayakTitle.classList.remove(
                "typing-forward"
            );

            sibayakTitle.classList.add(
                "typing-backward"
            );


            if(index <= 0){

                deleting = false;

                sibayakTitle.classList.remove(
                    "typing-backward"
                );

            }

        }


        /* =========================================
           KECEPATAN
        ========================================= */

        const speed =
            deleting
                ? 95
                : 155;


        setTimeout(
            sibayakType,
            speed
        );

    }


    /* mulai */

    sibayakTyping.textContent = "";

    setTimeout(
        sibayakType,
        700
    );

}
/* =========================================================
   SIBAYAK MUSIC PLAYER
========================================================= */

(() => {

    const audio = document.querySelector("#sibayakAudio");

    const playBtn = document.querySelector("#sibayakPlay");

    const prevBtn = document.querySelector("#sibayakPrev");

    const nextBtn = document.querySelector("#sibayakNext");

    const progress = document.querySelector("#sibayakProgress");

    const progressFill =
        document.querySelector("#sibayakProgressFill");

    const currentTime =
        document.querySelector("#sibayakCurrent");

    const duration =
        document.querySelector("#sibayakDuration");

    const volumeBar =
        document.querySelector("#sibayakVolumeBar");

    const volumeFill =
        document.querySelector("#sibayakVolumeFill");


    if (!audio) {

        console.warn(
            "[MUSIC] #sibayakAudio tidak ditemukan."
        );

        return;

    }


    /* =====================================================
       FORMAT WAKTU
    ===================================================== */

    function formatTime(seconds) {

        if (
            !Number.isFinite(seconds) ||
            seconds < 0
        ) {

            return "0:00";

        }


        const minutes =
            Math.floor(seconds / 60);

        const secs =
            Math.floor(seconds % 60);


        return (
            minutes +
            ":" +
            String(secs).padStart(2, "0")
        );

    }


    /* =====================================================
       UPDATE PROGRESS
    ===================================================== */

    function updateProgress() {

        if (
            !Number.isFinite(audio.duration) ||
            audio.duration <= 0
        ) {

            return;

        }


        const percent =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        if (progressFill) {

            progressFill.style.width =
                `${percent}%`;

        }


        if (currentTime) {

            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );

        }


        if (duration) {

            duration.textContent =
                formatTime(
                    audio.duration
                );

        }

    }


    /* =====================================================
       UPDATE PLAY BUTTON
    ===================================================== */

    function updatePlayButton() {

        if (!playBtn) return;


        if (audio.paused) {

            playBtn.innerHTML = "▶";

            playBtn.classList.remove(
                "is-playing"
            );

        } else {

            playBtn.innerHTML = "❚❚";

            playBtn.classList.add(
                "is-playing"
            );

        }

    }


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    if (playBtn) {

        playBtn.addEventListener(
            "click",
            async () => {

                try {

                    if (audio.paused) {

                        await audio.play();

                    } else {

                        audio.pause();

                    }

                } catch (error) {

                    console.error(
                        "[MUSIC] Gagal memutar:",
                        error
                    );

                }

            }
        );

    }


    /* =====================================================
       PROGRESS BAR
    ===================================================== */

    if (progress) {

        progress.addEventListener(
            "click",
            (event) => {

                if (
                    !Number.isFinite(
                        audio.duration
                    ) ||
                    audio.duration <= 0
                ) {

                    return;

                }


                const rect =
                    progress.getBoundingClientRect();


                const ratio =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        )
                    );


                audio.currentTime =
                    ratio *
                    audio.duration;


                updateProgress();

            }
        );

    }


    /* =====================================================
       VOLUME
    ===================================================== */

    audio.volume = 0.8;


    if (volumeBar) {

        volumeBar.addEventListener(
            "click",
            (event) => {

                const rect =
                    volumeBar.getBoundingClientRect();


                const volume =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width
                        )
                    );


                audio.volume =
                    volume;


                if (volumeFill) {

                    volumeFill.style.width =
                        `${volume * 100}%`;

                }

            }
        );

    }


    /* =====================================================
       PREVIOUS
    ===================================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => {

                audio.currentTime = 0;

                updateProgress();

            }
        );

    }


    /* =====================================================
       NEXT
    ===================================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => {

                audio.currentTime =
                    audio.duration || 0;

                updateProgress();

            }
        );

    }


    /* =====================================================
       AUDIO EVENTS
    ===================================================== */

    audio.addEventListener(
        "loadedmetadata",
        () => {

            updateProgress();

        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            updateProgress();

        }
    );


    audio.addEventListener(
        "play",
        () => {

            updatePlayButton();

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            updatePlayButton();

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            updatePlayButton();

            updateProgress();

        }
    );


    audio.addEventListener(
        "error",
        () => {

            console.error(
                "[MUSIC] Audio error:",
                audio.error
            );

        }
    );


    /* =====================================================
       INITIAL
    ===================================================== */

    updatePlayButton();

    updateProgress();


    console.log(
        "[MUSIC] Music player aktif."
    );

})();