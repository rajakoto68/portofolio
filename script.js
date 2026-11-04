/* =========================================================
   RAJA PORTFOLIO
   FULL JAVASCRIPT
========================================================= */


/* =========================================================
   LOADING SCREEN
========================================================= */

const loadingScreen =
  document.getElementById('loadingScreen');

const loadingProgress =
  document.getElementById('loadingProgress');


function initLoadingScreen() {

  if (
    !loadingScreen ||
    !loadingProgress
  ) {
    return;
  }

  let loadProgress = 0;

  const progressInterval =
    setInterval(() => {

      loadProgress +=
        Math.random() * 30;

      if (
        loadProgress > 90
      ) {
        loadProgress = 90;
      }

      loadingProgress.style.width =
        loadProgress + '%';

    }, 300);


  setTimeout(() => {

    clearInterval(
      progressInterval
    );

    loadingProgress.style.width =
      '100%';


    setTimeout(() => {

      loadingScreen.classList.add(
        'hidden'
      );

    }, 250);

  }, 1800);

}


window.addEventListener(
  'load',
  initLoadingScreen
);


if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initLoadingScreen
  );

} else {

  initLoadingScreen();

}


/* =========================================================
   GLOBAL ELEMENTS
========================================================= */

const space =
  document.querySelector(
    '.scroll-space'
  );

const layers =
  [
    ...document.querySelectorAll(
      '.layer'
    )
  ];

const smoke =
  document.querySelector(
    '.smoke'
  );

const lava =
  document.querySelector(
    '.lava'
  );

const birds =
  document.querySelector(
    '.birds'
  );

const mist =
  document.querySelector(
    '.mist'
  );

const cone =
  document.querySelector(
    '.cone'
  );

const flash =
  document.getElementById(
    'flash'
  );

const heroCopy =
  document.getElementById(
    'heroCopy'
  );

const introPhoto =
  document.getElementById(
    'introPhoto'
  );

const badge =
  document.getElementById(
    'badge'
  );

const badgeCard =
  document.getElementById(
    'badgeCard'
  );

const badgeTip =
  document.getElementById(
    'badgeTip'
  );

const lanyard =
  document.getElementById(
    'lanyard'
  );

const strapText =
  document.querySelector(
    '.strap-print'
  );

const clip =
  document.querySelector(
    '.clip'
  );

const cue =
  document.getElementById(
    'cue'
  );

const nav =
  document.getElementById(
    'nav'
  );

const railItems =
  [
    ...document.querySelectorAll(
      '.rail li'
    )
  ];

const embersCv =
  document.getElementById(
    'embers'
  );

const foto =
  document.getElementById(
    'foto'
  );

const modeBtn =
  document.getElementById(
    'modeBtn'
  );


/* =========================================================
   HELPERS
========================================================= */

const reduced =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


function clamp(
  value,
  min = 0,
  max = 1
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );

}


function lerp(
  a,
  b,
  t
) {

  return (
    a +
    (
      b - a
    ) *
    t
  );

}


function ramp(
  value,
  start,
  end
) {

  const t =
    clamp(
      (
        value -
        start
      ) /
      (
        end -
        start
      )
    );

  return (
    t *
    t *
    (
      3 -
      2 *
      t
    )
  );

}


/* =========================================================
   PHOTO ERROR
========================================================= */

if (foto) {

  foto.addEventListener(
    'error',
    () => {

      foto.classList.add(
        'gagal'
      );

    }
  );

}


/* =========================================================
   HERO SCROLL
========================================================= */

const T = {

  eruptStart:
    0.22,

  eruptPeak:
    0.42,

  settle:
    0.62,

  badgeDrop:
    0.66,

  badgeLand:
    0.82

};


let sceneProgress = 0;

let sceneTarget = 0;


function readScroll() {

  if (!space) {
    return;
  }


  const range =
    space.offsetHeight -
    window.innerHeight;


  sceneTarget =
    range > 0
      ? clamp(
          (
            window.scrollY -
            space.offsetTop
          ) /
          range
        )
      : 0;


  if (nav) {

    nav.classList.toggle(
      'tucked',
      window.scrollY > 40
    );

  }

}


window.addEventListener(
  'scroll',
  readScroll,
  {
    passive: true
  }
);


/* =========================================================
   MOUSE PARALLAX
========================================================= */

let mouseX = 0;

let mouseY = 0;

let targetMouseX = 0;

let targetMouseY = 0;


if (!reduced) {

  window.addEventListener(
    'pointermove',
    event => {

      if (draggingBadge) {
        return;
      }


      targetMouseX =
        (
          event.clientX /
          window.innerWidth -
          0.5
        ) *
        2;


      targetMouseY =
        (
          event.clientY /
          window.innerHeight -
          0.5
        ) *
        2;

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   EMBERS CANVAS
========================================================= */

const ctx =
  embersCv
    ? embersCv.getContext(
        '2d'
      )
    : null;


let sparks = [];

let dpr = 1;


function sizeCanvas() {

  if (!embersCv) {
    return;
  }


  dpr =
    Math.min(
      window.devicePixelRatio ||
      1,
      2
    );


  embersCv.width =
    embersCv.clientWidth *
    dpr;


  embersCv.height =
    embersCv.clientHeight *
    dpr;

}


function spawnSpark(
  width,
  height
) {

  return {

    x:
      width *
      (
        0.5 +
        (
          Math.random() -
          0.5
        ) *
        0.05
      ),

    y:
      height *
      (
        0.42 +
        Math.random() *
        0.04
      ),

    vx:
      (
        Math.random() -
        0.5
      ) *
      1.3,

    vy:
      -(
        1.1 +
        Math.random() *
        2.8
      ),

    r:
      0.7 +
      Math.random() *
      1.8,

    life:
      1

  };

}


function drawEmbers(
  power
) {

  if (
    !embersCv ||
    !ctx
  ) {
    return;
  }


  const width =
    embersCv.width;

  const height =
    embersCv.height;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  if (
    power <=
    0.02
  ) {

    sparks.length = 0;

    return;

  }


  const wanted =
    Math.round(
      power * 90
    );


  while (
    sparks.length <
    wanted
  ) {

    sparks.push(
      spawnSpark(
        width,
        height
      )
    );

  }


  ctx.globalCompositeOperation =
    'lighter';


  for (
    let i =
      sparks.length - 1;
    i >= 0;
    i--
  ) {

    const spark =
      sparks[i];


    spark.x +=
      spark.vx *
      dpr;


    spark.y +=
      spark.vy *
      dpr;


    spark.vy +=
      0.032 *
      dpr;


    spark.vx *=
      0.995;


    spark.life -=
      0.006 +
      Math.random() *
      0.004;


    if (
      spark.life <= 0 ||
      spark.y < -30
    ) {

      if (
        sparks.length >
        wanted
      ) {

        sparks.splice(
          i,
          1
        );

        continue;

      }


      sparks[i] =
        spawnSpark(
          width,
          height
        );

      continue;

    }


    const alpha =
      spark.life *
      power;


    const gradient =
      ctx.createRadialGradient(
        spark.x,
        spark.y,
        0,
        spark.x,
        spark.y,
        spark.r *
        6 *
        dpr
      );


    gradient.addColorStop(
      0,
      `rgba(255,236,180,${alpha})`
    );


    gradient.addColorStop(
      0.4,
      `rgba(255,150,50,${alpha * 0.55})`
    );


    gradient.addColorStop(
      1,
      'rgba(255,90,31,0)'
    );


    ctx.fillStyle =
      gradient;


    ctx.beginPath();


    ctx.arc(
      spark.x,
      spark.y,
      spark.r *
      6 *
      dpr,
      0,
      Math.PI * 2
    );


    ctx.fill();

  }


  ctx.globalCompositeOperation =
    'source-over';

}


/* =========================================================
   BADGE PHYSICS
========================================================= */

let ropeLength = 470;

let badgeRestTop = 0;

let badgeHiddenTop = -1600;


function layoutBadge() {

  if (!badge) {
    return;
  }


  const rootStyle =
    getComputedStyle(
      document.documentElement
    );


  const rootRope =
    parseFloat(
      rootStyle.getPropertyValue(
        '--rope'
      )
    );


  const cardHeight =
    parseFloat(
      rootStyle.getPropertyValue(
        '--card-h'
      )
    );


  if (
    Number.isFinite(
      rootRope
    )
  ) {

    ropeLength =
      rootRope;

  }


  badgeRestTop =
    Math.round(
      window.innerHeight *
      0.56 -
      (
        ropeLength +
        cardHeight / 2
      )
    );


  badgeHiddenTop =
    -(
      ropeLength +
      cardHeight +
      320
    );

}


let badgeOffsetX = 0;

let badgeOffsetY = 0;

let badgeVelocityX = 0;

let badgeVelocityY = 0;

let draggingBadge = false;

let grabbedBadge = false;

let badgeStartX = 0;

let badgeStartY = 0;

let badgeBaseX = 0;

let badgeBaseY = 0;

let badgeLastX = 0;

let badgeLastY = 0;


const BADGE_STIFFNESS =
  0.085;

const BADGE_DAMP =
  0.86;


if (badge) {

  badge.addEventListener(
    'pointerdown',
    event => {

      if (
        sceneProgress <
        T.badgeDrop +
        0.04
      ) {
        return;
      }


      draggingBadge =
        true;


      grabbedBadge =
        true;


      badge.classList.add(
        'dragging'
      );


      badge.setPointerCapture(
        event.pointerId
      );


      badgeStartX =
        badgeLastX =
        event.clientX;


      badgeStartY =
        badgeLastY =
        event.clientY;


      badgeBaseX =
        badgeOffsetX;


      badgeBaseY =
        badgeOffsetY;


      badgeVelocityX = 0;

      badgeVelocityY = 0;


      event.preventDefault();

    }
  );


  badge.addEventListener(
    'pointermove',
    event => {

      if (
        !draggingBadge
      ) {
        return;
      }


      badgeOffsetX =
        clamp(
          badgeBaseX +
          (
            event.clientX -
            badgeStartX
          ),
          -460,
          460
        );


      badgeOffsetY =
        clamp(
          badgeBaseY +
          (
            event.clientY -
            badgeStartY
          ),
          -90,
          460
        );


      badgeVelocityX =
        event.clientX -
        badgeLastX;


      badgeVelocityY =
        event.clientY -
        badgeLastY;


      badgeLastX =
        event.clientX;


      badgeLastY =
        event.clientY;

    }
  );


  function releaseBadge(
    event
  ) {

    if (
      !draggingBadge
    ) {
      return;
    }


    draggingBadge =
      false;


    badge.classList.remove(
      'dragging'
    );


    if (
      event &&
      event.pointerId != null &&
      badge.hasPointerCapture?.(
        event.pointerId
      )
    ) {

      badge.releasePointerCapture(
        event.pointerId
      );

    }

  }


  badge.addEventListener(
    'pointerup',
    releaseBadge
  );


  badge.addEventListener(
    'pointercancel',
    releaseBadge
  );


  badge.tabIndex =
    0;


  badge.addEventListener(
    'keydown',
    event => {

      if (
        event.key ===
        'ArrowLeft'
      ) {

        badgeVelocityX -=
          26;

        grabbedBadge =
          true;

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        badgeVelocityX +=
          26;

        grabbedBadge =
          true;

      }


      if (
        event.key ===
        'ArrowDown'
      ) {

        badgeVelocityY +=
          26;

        grabbedBadge =
          true;

      }

    }
  );

}


/* =========================================================
   MAIN HERO ANIMATION
========================================================= */

let sceneClock = 0;


function frame() {

  sceneClock +=
    0.016;


  sceneProgress =
    lerp(
      sceneProgress,
      sceneTarget,
      0.09
    );


  const progress =
    sceneProgress;


  const eruption =
    ramp(
      progress,
      T.eruptStart,
      T.eruptPeak
    );


  const calm =
    ramp(
      progress,
      T.eruptPeak,
      T.settle
    );


  const eruptionPower =
    clamp(
      eruption *
      (
        1 -
        calm *
        0.94
      )
    );


  mouseX =
    lerp(
      mouseX,
      targetMouseX,
      0.06
    );


  mouseY =
    lerp(
      mouseY,
      targetMouseY,
      0.06
    );


  const shake =
    eruptionPower >
      0.15 &&
    !reduced

      ? Math.sin(
          sceneClock *
          26
        ) *
        3 *
        eruptionPower

      : 0;


  layers.forEach(
    layer => {

      const depth =
        Number(
          layer.dataset.depth ||
          0
        );


      const near =
        depth +
        1;


      const translateY =
        -progress *
        (
          24 +
          near *
          130
        );


      const translateX =
        mouseX *
        near *
        14 +
        shake;


      const mouseTranslateY =
        mouseY *
        near *
        8;


      const scale =
        1 +
        near *
        0.035 *
        progress;


      layer._pose =
        `translate3d(${translateX.toFixed(1)}px, ${(translateY + mouseTranslateY).toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;


      layer.style.transform =
        layer._pose;

    }
  );


  if (smoke) {

    smoke.style.opacity =
      eruptionPower *
      0.95;


    smoke.style.transform =
      `${smoke._pose} translateY(${(
        -eruptionPower *
        90 -
        calm *
        70
      ).toFixed(1)}px) scale(${
        1 +
        eruptionPower *
        0.35 +
        calm *
        0.3
      })`;

  }


  if (lava) {

    lava.style.opacity =
      eruptionPower;


    lava.style.transform =
      `${lava._pose} translateY(${(
        -eruptionPower *
        18
      ).toFixed(1)}px) scale(${
        1 +
        eruptionPower *
        0.14
      })`;

  }


  if (cone) {

    cone.style.filter =
      eruptionPower >
      0.02

        ? `brightness(${
            1 +
            eruptionPower *
            0.2
          }) saturate(${
            1 +
            eruptionPower *
            0.28
          })`

        : 'none';

  }


  if (mist) {

    mist.style.opacity =
      0.45 -
      progress *
      0.25 +
      calm *
      0.2;

  }


  if (flash) {

    const burst =
      ramp(
        progress,
        T.eruptStart,
        T.eruptStart +
        0.035
      ) *
      (
        1 -
        ramp(
          progress,
          T.eruptStart +
          0.035,
          T.eruptStart +
          0.1
        )
      );


    flash.style.opacity =
      burst *
      0.7;

  }


  if (birds) {

    const flee =
      ramp(
        progress,
        T.eruptStart -
        0.04,
        T.eruptStart +
        0.16
      );


    birds.style.opacity =
      (
        0.7 -
        flee *
        0.7
      ).toFixed(3);


    birds.style.transform =
      `${birds._pose} translate(${flee * 380}px, ${
        -flee *
        140 +
        Math.sin(
          sceneClock *
          1.4
        ) *
        7
      }px)`;

  }


  if (embersCv) {

    embersCv.style.opacity =
      eruptionPower;

  }


  if (!reduced) {

    drawEmbers(
      eruptionPower
    );

  }


  if (introPhoto) {

    const rotateX =
      clamp(
        -mouseY *
        6,
        -8,
        8
      );


    const rotateY =
      clamp(
        mouseX *
        9,
        -11,
        11
      );


    const floating =
      !reduced

        ? Math.sin(
            sceneClock *
            0.6
          ) *
          3

        : 0;


    introPhoto.style.transform =
      `translateY(${floating.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

  }


  if (heroCopy) {

    const gone =
      ramp(
        progress,
        0.14,
        0.28
      );


    heroCopy.style.opacity =
      1 -
      gone;


    heroCopy.style.transform =
      `translate(-50%, ${
        -gone *
        60
      }px)`;

  }


  if (cue) {

    cue.style.opacity =
      1 -
      ramp(
        progress,
        0.02,
        0.1
      );

  }


  /* =======================================================
     BADGE DROP
  ======================================================= */

  if (badge) {

    if (
      progress <
      T.badgeDrop
    ) {

      badge.style.opacity =
        '0';


      badge.style.top =
        `${badgeHiddenTop}px`;


      badgeOffsetX = 0;

      badgeOffsetY = 0;

      badgeVelocityX = 0;

      badgeVelocityY = 0;

      grabbedBadge = false;


      if (badgeTip) {

        badgeTip.style.opacity =
          '0';

      }

    } else {

      badge.style.opacity =
        '1';


      const drop =
        ramp(
          progress,
          T.badgeDrop,
          T.badgeLand
        );


      badge.style.top =
        `${lerp(
          badgeHiddenTop,
          badgeRestTop,
          drop
        )}px`;


      if (
        drop < 1 &&
        !grabbedBadge
      ) {

        badgeOffsetX =
          Math.sin(
            drop *
            Math.PI *
            2.4
          ) *
          26 *
          (
            1 -
            drop
          );


        badgeOffsetY =
          Math.abs(
            Math.sin(
              drop *
              Math.PI *
              3.2
            )
          ) *
          20 *
          (
            1 -
            drop
          );

      }


      if (badgeTip) {

        badgeTip.style.opacity =
          drop >
          0.96
            ? '1'
            : '0';

      }

    }

  }


  /* =======================================================
     BADGE PHYSICS
  ======================================================= */

  if (
    !draggingBadge &&
    grabbedBadge
  ) {

    badgeVelocityX =
      (
        badgeVelocityX -
        badgeOffsetX *
        BADGE_STIFFNESS
      ) *
      BADGE_DAMP;


    badgeVelocityY =
      (
        badgeVelocityY -
        badgeOffsetY *
        BADGE_STIFFNESS
      ) *
      BADGE_DAMP;


    badgeOffsetX +=
      badgeVelocityX;


    badgeOffsetY +=
      badgeVelocityY;


    if (
      Math.abs(
        badgeOffsetX
      ) < 0.05 &&

      Math.abs(
        badgeOffsetY
      ) < 0.05 &&

      Math.abs(
        badgeVelocityX
      ) < 0.05 &&

      Math.abs(
        badgeVelocityY
      ) < 0.05
    ) {

      badgeOffsetX = 0;

      badgeOffsetY = 0;

      badgeVelocityX = 0;

      badgeVelocityY = 0;

    }

  }


  if (
    lanyard &&
    strapText &&
    clip &&
    badgeCard
  ) {

    const reach =
      ropeLength +
      badgeOffsetY;


    const distance =
      Math.hypot(
        badgeOffsetX,
        reach
      );


    const angle =
      Math.atan2(
        badgeOffsetX,
        reach
      ) *
      180 /
      Math.PI;


    const stretch =
      clamp(
        distance /
        ropeLength,
        0.7,
        2.4
      );


    const ropePose =
      `rotate(${angle.toFixed(2)}deg) scaleY(${stretch.toFixed(3)})`;


    lanyard.style.transform =
      ropePose;


    strapText.style.transform =
      ropePose;


    const hanging =
      (
        distance -
        ropeLength
      ).toFixed(1);


    clip.style.transform =
      `rotate(${angle.toFixed(2)}deg) translateY(${hanging}px)`;


    const spin =
      clamp(
        badgeVelocityX *
        2.6 +
        badgeOffsetX *
        0.09,
        -42,
        42
      );


    badgeCard.style.transform =
      `rotate(${angle.toFixed(2)}deg) translateY(${hanging}px) rotateY(${spin.toFixed(2)}deg)`;

  }


  railItems.forEach(
    (
      item,
      index
    ) => {

      const points = [
        0,
        T.eruptStart,
        T.eruptPeak,
        T.badgeDrop
      ];


      item.classList.toggle(
        'on',
        progress >=
        (
          points[index] ||
          0
        )
      );

    }
  );


  requestAnimationFrame(
    frame
  );

}


/* =========================================================
   NAVIGATION
========================================================= */

const sections = [

  '#home',

  '#about',

  '#tentang',

  '#journey',

  '#achievements',

  '#project',

  '#contact',

  '#fav-song'

]
  .map(
    id =>
      document.querySelector(
        id
      )
  )
  .filter(Boolean);


if (
  'IntersectionObserver' in
  window
) {

  const sectionObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            document
              .querySelectorAll(
                '.nav-links a'
              )
              .forEach(
                link => {

                  link.classList.toggle(
                    'is-here',
                    link.getAttribute(
                      'href'
                    ) ===
                    '#' +
                    entry.target.id
                  );

                }
              );

          }
        );

      },
      {
        rootMargin:
          '-45% 0px -50% 0px'
      }
    );


  sections.forEach(
    section => {

      sectionObserver.observe(
        section
      );

    }
  );

}


document
  .querySelectorAll(
    '.nav-links a'
  )
  .forEach(
    link => {

      link.addEventListener(
        'click',
        event => {

          const target =
            document.querySelector(
              link.getAttribute(
                'href'
              )
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          window.scrollTo({

            top:
              target.offsetTop,

            behavior:
              reduced
                ? 'auto'
                : 'smooth'

          });

        }
      );

    }
  );


/* =========================================================
   ABOUT ME — 9 FOTO CAROUSEL
   3 kategori × 3 foto
   Klik gambar = slide berikutnya
   Swipe HP = next / previous
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const carouselItems = document.querySelectorAll(
    ".favorite-image[data-carousel]"
  );

  carouselItems.forEach((carousel) => {

    const slides = carousel.querySelectorAll(
      ".favorite-slide"
    );

    if (!slides.length) return;

    let currentIndex = 0;
    let isAnimating = false;

    /* -----------------------------------------
       PASTIKAN FOTO PERTAMA AKTIF
    ----------------------------------------- */

    slides.forEach((slide, index) => {

      slide.classList.toggle(
        "is-active",
        index === 0
      );

    });


    /* -----------------------------------------
       PRELOAD 3 FOTO
    ----------------------------------------- */

    slides.forEach((slide) => {

      const preload = new Image();

      preload.src = slide.src;

    });


    /* -----------------------------------------
       GANTI FOTO
    ----------------------------------------- */

    function changeSlide(direction = 1) {

      if (
        isAnimating ||
        slides.length <= 1
      ) {
        return;
      }

      isAnimating = true;


      const oldIndex =
        currentIndex;


      let nextIndex =
        currentIndex + direction;


      /* LOOP */

      if (
        nextIndex >= slides.length
      ) {
        nextIndex = 0;
      }


      if (
        nextIndex < 0
      ) {
        nextIndex =
          slides.length - 1;
      }


      const oldSlide =
        slides[oldIndex];


      const nextSlide =
        slides[nextIndex];


      /* -------------------------------------
         RESET POSITION
      ------------------------------------- */

      slides.forEach((slide) => {

        slide.classList.remove(
          "is-active",
          "is-leaving",
          "is-entering"
        );

      });


      /*
        Arah slide:

        next:
        foto lama keluar ke kiri
        foto baru masuk dari kanan

        previous:
        foto lama keluar ke kanan
        foto baru masuk dari kiri
      */

      if (direction === 1) {

        nextSlide.classList.add(
          "slide-from-right"
        );

        oldSlide.classList.add(
          "slide-to-left"
        );

      } else {

        nextSlide.classList.add(
          "slide-from-left"
        );

        oldSlide.classList.add(
          "slide-to-right"
        );

      }


      /* -------------------------------------
         FORCE REFLOW
      ------------------------------------- */

      void nextSlide.offsetWidth;


      /* -------------------------------------
         AKTIFKAN ANIMASI
      ------------------------------------- */

      nextSlide.classList.add(
        "is-active"
      );


      oldSlide.classList.remove(
        "is-active"
      );


      currentIndex =
        nextIndex;


      /* -------------------------------------
         SELESAI ANIMASI
      ------------------------------------- */

      setTimeout(() => {

        slides.forEach((slide) => {

          slide.classList.remove(
            "slide-from-right",
            "slide-from-left",
            "slide-to-left",
            "slide-to-right"
          );

        });

        isAnimating = false;

      }, 700);

    }


    /* -----------------------------------------
       KLIK DI FOTO
    ----------------------------------------- */

    carousel.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        changeSlide(1);

      }
    );


    /* -----------------------------------------
       KEYBOARD
    ----------------------------------------- */

    carousel.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          changeSlide(1);

        }


        if (
          event.key === "ArrowRight"
        ) {

          event.preventDefault();

          changeSlide(1);

        }


        if (
          event.key === "ArrowLeft"
        ) {

          event.preventDefault();

          changeSlide(-1);

        }

      }
    );


    /* -----------------------------------------
       SWIPE HP
    ----------------------------------------- */

    let touchStartX = 0;
    let touchStartY = 0;


    carousel.addEventListener(
      "touchstart",
      (event) => {

        const touch =
          event.touches[0];

        touchStartX =
          touch.clientX;

        touchStartY =
          touch.clientY;

      },
      {
        passive: true
      }
    );


    carousel.addEventListener(
      "touchend",
      (event) => {

        const touch =
          event.changedTouches[0];

        const deltaX =
          touch.clientX -
          touchStartX;

        const deltaY =
          touch.clientY -
          touchStartY;


        /*
          Swipe horizontal
        */

        if (
          Math.abs(deltaX) > 45 &&
          Math.abs(deltaX) >
          Math.abs(deltaY)
        ) {

          if (deltaX < 0) {

            /*
              Swipe kiri
              → foto berikutnya
            */

            changeSlide(1);

          } else {

            /*
              Swipe kanan
              → foto sebelumnya
            */

            changeSlide(-1);

          }

        }

      },
      {
        passive: true
      }
    );


    /* -----------------------------------------
       MOUSE POINTER
    ----------------------------------------- */

    carousel.style.cursor =
      "pointer";


    carousel.setAttribute(
      "tabindex",
      "0"
    );


    carousel.setAttribute(
      "role",
      "button"
    );


    /* -----------------------------------------
       DATA INDEX
    ----------------------------------------- */

    carousel.dataset.current =
      "0";

  });

});
/* =========================================================
   EXPERIENCE CAROUSEL
========================================================= */

const experienceCards =
  [
    ...
    document.querySelectorAll(
      '.experience-card'
    )
  ];


const experiencePrev =
  document.getElementById(
    'experiencePrev'
  );


const experienceNext =
  document.getElementById(
    'experienceNext'
  );


const experienceDots =
  [
    ...
    document.querySelectorAll(
      '#experienceDots button'
    )
  ];


const experienceCarousel =
  document.getElementById(
    'experienceCarousel'
  );


let experienceIndex =
  0;

let experienceTimer =
  null;


function experienceModulo(
  value,
  length
) {

  return (
    (
      value %
      length
    ) +
    length
  ) %
  length;

}


function renderExperienceCarousel() {

  if (
    !experienceCards.length
  ) {
    return;
  }


  const total =
    experienceCards.length;


  experienceCards.forEach(
    (
      card,
      index
    ) => {

      card.classList.remove(
        'is-prev',
        'is-active',
        'is-next',
        'is-hidden-slide'
      );


      const difference =
        experienceModulo(
          index -
          experienceIndex,
          total
        );


      if (
        difference ===
        0
      ) {

        card.classList.add(
          'is-active'
        );

      }

      else if (
        difference ===
        1
      ) {

        card.classList.add(
          'is-next'
        );

      }

      else if (
        difference ===
        total - 1
      ) {

        card.classList.add(
          'is-prev'
        );

      }

      else {

        card.classList.add(
          'is-hidden-slide'
        );

      }

    }
  );


  experienceDots.forEach(
    (
      dot,
      index
    ) => {

      dot.classList.toggle(
        'is-active',
        index ===
        experienceIndex
      );

    }
  );

}


function nextExperience() {

  if (
    !experienceCards.length
  ) {
    return;
  }


  experienceIndex =
    experienceModulo(
      experienceIndex + 1,
      experienceCards.length
    );


  renderExperienceCarousel();

}


function prevExperience() {

  if (
    !experienceCards.length
  ) {
    return;
  }


  experienceIndex =
    experienceModulo(
      experienceIndex - 1,
      experienceCards.length
    );


  renderExperienceCarousel();

}


function stopExperienceAutoPlay() {

  if (
    experienceTimer
  ) {

    clearInterval(
      experienceTimer
    );


    experienceTimer =
      null;

  }

}


function startExperienceAutoPlay() {

  if (
    reduced ||
    experienceCards.length <
    2
  ) {
    return;
  }


  stopExperienceAutoPlay();


  experienceTimer =
    setInterval(
      nextExperience,
      4300
    );

}


if (
  experienceCards.length
) {

  renderExperienceCarousel();


  if (
    experienceNext
  ) {

    experienceNext.addEventListener(
      'click',
      () => {

        nextExperience();

        startExperienceAutoPlay();

      }
    );

  }


  if (
    experiencePrev
  ) {

    experiencePrev.addEventListener(
      'click',
      () => {

        prevExperience();

        startExperienceAutoPlay();

      }
    );

  }


  experienceDots.forEach(
    dot => {

      dot.addEventListener(
        'click',
        () => {

          experienceIndex =
            Number(
              dot.dataset.slide
            ) ||
            0;


          renderExperienceCarousel();

          startExperienceAutoPlay();

        }
      );

    }
  );


  if (
    experienceCarousel
  ) {

    experienceCarousel.addEventListener(
      'mouseenter',
      stopExperienceAutoPlay
    );


    experienceCarousel.addEventListener(
      'mouseleave',
      startExperienceAutoPlay
    );


    experienceCarousel.addEventListener(
      'focusin',
      stopExperienceAutoPlay
    );


    experienceCarousel.addEventListener(
      'focusout',
      startExperienceAutoPlay
    );

  }


  startExperienceAutoPlay();

}


/* =========================================================
   TYPEWRITER
========================================================= */

const typedText =
  document.getElementById(
    'experienceTypedText'
  );


const typewriterWords = [

  'M.RAJA SIYO',

  'PENCINTA ALAM',

  'DUNIA GYM',

  'WEB DEVELOPER'

];


let typeWordIndex =
  0;

let typeCharIndex =
  0;

let typeDeleting =
  false;


function typeExperienceText() {

  if (
    !typedText
  ) {
    return;
  }


  if (reduced) {

    typedText.textContent =
      'M.RAJA SIYO';

    return;

  }


  const word =
    typewriterWords[
      typeWordIndex
    ];


  if (
    !typeDeleting
  ) {

    typeCharIndex++;


    typedText.textContent =
      word.slice(
        0,
        typeCharIndex
      );


    if (
      typeCharIndex >=
      word.length
    ) {

      typeDeleting =
        true;


      setTimeout(
        typeExperienceText,
        1250
      );


      return;

    }


    setTimeout(
      typeExperienceText,
      105
    );


    return;

  }


  typeCharIndex--;


  typedText.textContent =
    word.slice(
      0,
      typeCharIndex
    );


  if (
    typeCharIndex <=
    0
  ) {

    typeDeleting =
      false;


    typeWordIndex =
      (
        typeWordIndex +
        1
      ) %
      typewriterWords.length;


    setTimeout(
      typeExperienceText,
      350
    );


    return;

  }


  setTimeout(
    typeExperienceText,
    58
  );

}


if (
  typedText
) {

  typeExperienceText();

}


/* =========================================================
   PROJECT IMAGE SLIDER
========================================================= */

(function () {

  const sliders =
    [
      ...
      document.querySelectorAll(
        '.project-preview-slider'
      )
    ];


  sliders.forEach(
    slider => {

      const slides =
        [
          ...
          slider.querySelectorAll(
            '.project-slide'
          )
        ];


      const counter =
        slider.querySelector(
          '.project-photo-count .current'
        );


      if (
        slides.length <
        2
      ) {
        return;
      }


      let currentSlide =
        0;


      let sliderTimer =
        null;


      let animating =
        false;


      slides.forEach(
        (
          slide,
          index
        ) => {

          slide.classList.remove(
            'is-active',
            'is-entering'
          );


          if (
            index ===
            0
          ) {

            slide.classList.add(
              'is-active'
            );

          }

        }
      );


      function updateCounter() {

        if (!counter) {
          return;
        }


        counter.textContent =
          String(
            currentSlide +
            1
          ).padStart(
            2,
            '0'
          );

      }


      function nextProjectPhoto() {

        if (
          animating
        ) {
          return;
        }


        animating =
          true;


        const oldSlide =
          slides[
            currentSlide
          ];


        const nextIndex =
          (
            currentSlide +
            1
          ) %
          slides.length;


        const nextSlide =
          slides[
            nextIndex
          ];


        nextSlide.style.transition =
          'none';


        nextSlide.style.opacity =
          '0';


        nextSlide.style.transform =
          'translateX(35px) scale(1.035)';


        nextSlide.classList.add(
          'is-entering'
        );


        void nextSlide.offsetWidth;


        nextSlide.style.transition =
          'opacity .8s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)';


        oldSlide.style.transition =
          'opacity .8s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)';


        oldSlide.style.opacity =
          '0';


        oldSlide.style.transform =
          'translateX(-35px) scale(1.035)';


        nextSlide.style.opacity =
          '1';


        nextSlide.style.transform =
          'translateX(0) scale(1)';


        currentSlide =
          nextIndex;


        updateCounter();


        setTimeout(
          () => {

            oldSlide.classList.remove(
              'is-active'
            );


            oldSlide.style.opacity =
              '0';


            oldSlide.style.transform =
              'translateX(35px) scale(1.035)';


            nextSlide.classList.remove(
              'is-entering'
            );


            nextSlide.classList.add(
              'is-active'
            );


            animating =
              false;

          },
          900
        );

      }


      function startSlider() {

        clearInterval(
          sliderTimer
        );


        sliderTimer =
          setInterval(
            nextProjectPhoto,
            3000
          );

      }


      slider.addEventListener(
        'mouseenter',
        () => {

          clearInterval(
            sliderTimer
          );

        }
      );


      slider.addEventListener(
        'mouseleave',
        startSlider
      );


      updateCounter();

      startSlider();

    }
  );

})();


/* =========================================================
   ACHIEVEMENT / CERTIFICATE
========================================================= */

(function () {

  const section =
    document.getElementById(
      'achievements'
    );


  if (
    !section
  ) {
    return;
  }


  const cards =
    [
      ...
      section.querySelectorAll(
        '.achievement-card'
      )
    ];


  const openButtons =
    [
      ...
      section.querySelectorAll(
        '.achievement-open'
      )
    ];


  const modal =
    document.getElementById(
      'certificateModal'
    );


  const modalImage =
    document.getElementById(
      'certificateViewerImage'
    );


  const modalTitle =
    document.getElementById(
      'certificateViewerTitle'
    );


  const modalNumber =
    document.getElementById(
      'certificateViewerNumber'
    );


  const closeButton =
    document.getElementById(
      'certificateClose'
    );


  const prevButton =
    document.getElementById(
      'certificatePrev'
    );


  const nextButton =
    document.getElementById(
      'certificateNext'
    );


  if (
    !modal
  ) {
    return;
  }


  const certificates = [

    {
      image:
        'img/sertifikat-01.jpg',

      title:
        'Prestasi Pertama'
    },

    {
      image:
        'img/sertifikat-02.jpg',

      title:
        'Prestasi Kedua'
    },

    {
      image:
        'img/sertifikat-03.jpg',

      title:
        'Prestasi Ketiga'
    }

  ];


  let certificateIndex =
    0;


  function openCertificate(
    index
  ) {

    certificateIndex =
      (
        index +
        certificates.length
      ) %
      certificates.length;


    const certificate =
      certificates[
        certificateIndex
      ];


    if (
      modalImage
    ) {

      modalImage.src =
        certificate.image;


      modalImage.alt =
        certificate.title;

    }


    if (
      modalTitle
    ) {

      modalTitle.textContent =
        certificate.title;

    }


    if (
      modalNumber
    ) {

      modalNumber.textContent =
        `${String(
          certificateIndex +
          1
        ).padStart(
          2,
          '0'
        )} / 03`;

    }


    modal.classList.add(
      'is-open'
    );


    modal.setAttribute(
      'aria-hidden',
      'false'
    );


    document.body.style.overflow =
      'hidden';

  }


  function closeCertificate() {

    modal.classList.remove(
      'is-open'
    );


    modal.setAttribute(
      'aria-hidden',
      'true'
    );


    document.body.style.overflow =
      '';

  }


  openButtons.forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          openCertificate(
            Number(
              button.dataset.index
            )
          );

        }
      );

    }
  );


  cards.forEach(
    (
      card,
      index
    ) => {

      const image =
        card.querySelector(
          '.achievement-image'
        );


      if (!image) {
        return;
      }


      image.style.cursor =
        'zoom-in';


      image.addEventListener(
        'click',
        () => {

          openCertificate(
            Number(
              card.dataset.index
            ) ||
            index
          );

        }
      );

    }
  );


  if (
    nextButton
  ) {

    nextButton.addEventListener(
      'click',
      () => {

        openCertificate(
          certificateIndex +
          1
        );

      }
    );

  }


  if (
    prevButton
  ) {

    prevButton.addEventListener(
      'click',
      () => {

        openCertificate(
          certificateIndex -
          1
        );

      }
    );

  }


  if (
    closeButton
  ) {

    closeButton.addEventListener(
      'click',
      closeCertificate
    );

  }


  modal.addEventListener(
    'click',
    event => {

      if (
        event.target.matches(
          '[data-close-certificate]'
        )
      ) {

        closeCertificate();

      }

    }
  );


  document.addEventListener(
    'keydown',
    event => {

      if (
        !modal.classList.contains(
          'is-open'
        )
      ) {
        return;
      }


      if (
        event.key ===
        'Escape'
      ) {

        closeCertificate();

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        openCertificate(
          certificateIndex +
          1
        );

      }


      if (
        event.key ===
        'ArrowLeft'
      ) {

        openCertificate(
          certificateIndex -
          1
        );

      }

    }
  );


  if (
    !reduced
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                'is-visible'
              );

            }
          );

        },
        {
          threshold:
            0.18
        }
      );


    cards.forEach(
      card => {

        observer.observe(
          card
        );

      }
    );

  } else {

    cards.forEach(
      card => {

        card.classList.add(
          'is-visible'
        );

      }
    );

  }


  if (
    !reduced
  ) {

    cards.forEach(
      card => {

        card.addEventListener(
          'pointermove',
          event => {

            const rect =
              card.getBoundingClientRect();


            const x =
              (
                event.clientX -
                rect.left
              ) /
              rect.width;


            const y =
              (
                event.clientY -
                rect.top
              ) /
              rect.height;


            const rotateY =
              (
                x -
                0.5
              ) *
              5;


            const rotateX =
              (
                0.5 -
                y
              ) *
              5;


            if (
              window.innerWidth >
              850
            ) {

              if (
                card.classList.contains(
                  'achievement-card-two'
                )
              ) {

                card.style.transform =
                  `translateX(-50%) translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(2deg)`;

              } else {

                card.style.transform =
                  `translateY(-7px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

              }

            }

          }
        );


        card.addEventListener(
          'pointerleave',
          () => {

            if (
              window.innerWidth <=
              850
            ) {
              return;
            }


            if (
              card.classList.contains(
                'achievement-card-two'
              )
            ) {

              card.style.transform =
                'translateX(-50%) rotate(2deg)';

            } else {

              card.style.transform =
                'rotate(-2deg)';

            }

          }
        );

      }
    );

  }


  const achievementProgress =
    section.querySelector(
      '.achievement-progress i'
    );


  function updateAchievementProgress() {

    if (
      !achievementProgress
    ) {
      return;
    }


    const rect =
      section.getBoundingClientRect();


    const total =
      section.offsetHeight -
      window.innerHeight;


    const value =
      total > 0

        ? clamp(
            -rect.top /
            total
          )

        : 0;


    achievementProgress.style.width =
      `${Math.max(
        8,
        value *
        100
      )}%`;

  }


  window.addEventListener(
    'scroll',
    updateAchievementProgress,
    {
      passive: true
    }
  );


  updateAchievementProgress();

})();


/* =========================================================
   CONTACT MOVING
========================================================= */

(function () {

  const contact =
    document.querySelector(
      '.contact-moving'
    );


  const marquee =
    document.querySelector(
      '.contact-marquee'
    );


  const track =
    document.querySelector(
      '.contact-marquee-track'
    );


  const cards =
    [
      ...
      document.querySelectorAll(
        '.moving-card'
      )
    ];


  if (
    !contact ||
    !marquee ||
    !track
  ) {

    return;

  }


  marquee.addEventListener(
    'pointerenter',
    () => {

      track.style.animationPlayState =
        'paused';

    }
  );


  marquee.addEventListener(
    'pointerleave',
    () => {

      track.style.animationPlayState =
        'running';

    }
  );


  cards.forEach(
    card => {

      card.addEventListener(
        'pointermove',
        event => {

          if (
            reduced
          ) {
            return;
          }


          const rect =
            card.getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            ) /
            rect.width;


          const y =
            (
              event.clientY -
              rect.top
            ) /
            rect.height;


          const rotateY =
            (
              x -
              0.5
            ) *
            5;


          const rotateX =
            (
              0.5 -
              y
            ) *
            5;


          card.style.transform =
            `
              translateY(-10px)
              scale(1.025)
              perspective(900px)
              rotateX(${rotateX}deg)
              rotateY(${rotateY}deg)
            `;

        }
      );


      card.addEventListener(
        'pointerleave',
        () => {

          card.style.transform =
            '';

        }
      );

    }
  );


  if (
    'IntersectionObserver' in
    window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              contact.classList.add(
                'is-visible'
              );


              observer.unobserve(
                contact
              );

            }
          );

        },
        {
          threshold:
            0.15
        }
      );


    observer.observe(
      contact
    );

  }

})();


/* =========================================================
   MY FAV SONG
   REAL AUDIO PLAYER
========================================================= */

(function () {

  const section =
    document.getElementById(
      'fav-song'
    );


  if (
    !section
  ) {

    return;

  }


  /* =======================================================
     ELEMENT
  ======================================================= */

  const songTitle =
    document.getElementById(
      'songTitle'
    );


  const songArtist =
    document.getElementById(
      'songArtist'
    );


  const songCover =
    document.getElementById(
      'songCover'
    );


  const playerCover =
    document.getElementById(
      'playerCover'
    );


  const playerTitle =
    document.getElementById(
      'playerTitle'
    );


  const playerArtist =
    document.getElementById(
      'playerArtist'
    );


  const songCurrent =
    document.getElementById(
      'songCurrent'
    );


  const songDuration =
    document.getElementById(
      'songDuration'
    );


  const songProgressFill =
    document.getElementById(
      'songProgressFill'
    );


  const songProgress =
    document.getElementById(
      'songProgress'
    );


  const songPlay =
    document.getElementById(
      'songPlay'
    );


  const songPlayIcon =
    document.getElementById(
      'songPlayIcon'
    );


  const songHeart =
    document.getElementById(
      'songHeart'
    );


  const songPrev =
    document.getElementById(
      'songPrev'
    );


  const songNext =
    document.getElementById(
      'songNext'
    );


  const songShuffle =
    document.getElementById(
      'songShuffle'
    );


  const songCards =
    [
      ...
      section.querySelectorAll(
        '.song-orbit-card'
      )
    ];


  const songCenter =
    document.getElementById(
      'songCenter'
    );


  const songOrbit =
    section.querySelector(
      '.song-orbit'
    );


  /* =======================================================
     AUDIO
  ======================================================= */

  const audio =
    new Audio();


  audio.preload =
    'metadata';


  audio.volume =
    0.8;


  audio.controls =
    false;


  /* =======================================================
     SONG LIST
     
     UNTUK SAAT INI:
     ABOUT YOU PASTI BISA DITES
     karena file itu sudah ada di folder kamu.
  ======================================================= */

  const songs = [

    {
      title:
        'About You',

      artist:
        'The 1975',

      cover:
        'img/song-about-you.jpg',

      audio:
        'music/about-you.mp3',

      duration:
        '5:26'
    },


    {
      title:
        'Rahasia Hati',

      artist:
        'Nidji',

      cover:
        'img/song-rahasia-hati.jpg',

      audio:
        'music/rahasia-hati.mp3',

      duration:
        '4:17'
    },


    {
      title:
        'beanie',

      artist:
        'Chezile',

      cover:
        'img/song-beanie.jpg',

      audio:
        'music/beanie.mp3',

      duration:
        '3:34'
    },


    {
      title:
        'Chasing Yesterday Morning',

      artist:
        'Favorite Song',

      cover:
        'img/song-chasing-yesterday.jpg',

      audio:
        'music/chasing-yesterday-morning.mp3',

      duration:
        '4:38'
    }

  ];


  let activeSong =
    0;


  let isPlaying =
    false;


  let isLiked =
    false;


  let isShuffle =
    false;


  let touchStartX =
    null;


  /* =======================================================
     TIME FORMAT
  ======================================================= */

  function formatSongTime(
    seconds
  ) {

    if (
      !Number.isFinite(
        seconds
      ) ||
      seconds < 0
    ) {

      return '0:00';

    }


    const minutes =
      Math.floor(
        seconds /
        60
      );


    const secondsPart =
      Math.floor(
        seconds %
        60
      )
        .toString()
        .padStart(
          2,
          '0'
        );


    return (
      minutes +
      ':' +
      secondsPart
    );

  }


  /* =======================================================
     PLAY BUTTON
  ======================================================= */

  function updateSongPlayButton() {

    if (
      songPlayIcon
    ) {

      songPlayIcon.textContent =
        isPlaying
          ? 'Ⅱ'
          : '▶';

    }


    if (
      songPlay
    ) {

      songPlay.setAttribute(
        'aria-label',
        isPlaying
          ? 'Pause'
          : 'Play'
      );

    }

  }


  /* =======================================================
     PROGRESS
  ======================================================= */

  function updateSongProgress() {

    const validDuration =
      Number.isFinite(
        audio.duration
      ) &&
      audio.duration >
      0;


    let percent =
      0;


    if (
      validDuration
    ) {

      percent =
        (
          audio.currentTime /
          audio.duration
        ) *
        100;

    }


    percent =
      Math.max(
        0,
        Math.min(
          100,
          percent
        )
      );


    if (
      songProgressFill
    ) {

      songProgressFill.style.width =
        percent +
        '%';

    }


    if (
      songCurrent
    ) {

      songCurrent.textContent =
        formatSongTime(
          audio.currentTime ||
          0
        );

    }


    if (
      songDuration
    ) {

      songDuration.textContent =
        validDuration

          ? formatSongTime(
              audio.duration
            )

          : songs[
              activeSong
            ].duration;

    }

  }


  /* =======================================================
     IMAGE
  ======================================================= */

  function loadSongImage(
    element,
    source
  ) {

    if (
      !element
    ) {
      return;
    }


    element.classList.remove(
      'image-missing'
    );


    element.src =
      source;


    element.onerror =
      () => {

        element.classList.add(
          'image-missing'
        );


        console.warn(
          '[MUSIC] Cover tidak ditemukan:',
          source
        );

      };

  }


  /* =======================================================
     ORBIT
  ======================================================= */

  function updateSongOrbit() {

    songCards.forEach(
      card => {

        const index =
          Number(
            card.dataset.index
          );


        if (
          !Number.isInteger(
            index
          )
        ) {
          return;
        }


        const distance =
          (
            index -
            activeSong +
            songs.length
          ) %
          songs.length;


        card.classList.toggle(
          'is-active',
          distance ===
          0
        );


        card.setAttribute(
          'aria-current',
          distance ===
          0
            ? 'true'
            : 'false'
        );


        if (
          distance ===
          0
        ) {

          card.style.opacity =
            '0';

          card.style.pointerEvents =
            'none';

        }

        else if (
          distance ===
          1
        ) {

          card.style.opacity =
            '1';

          card.style.pointerEvents =
            'auto';

          card.style.transform =
            'translateY(0) rotate(-4deg) scale(1.04)';

        }

        else if (
          distance ===
          2
        ) {

          card.style.opacity =
            '1';

          card.style.pointerEvents =
            'auto';

          card.style.transform =
            'translateY(0) rotate(4deg) scale(1.04)';

        }

        else {

          card.style.opacity =
            '0.35';

          card.style.pointerEvents =
            'auto';

          card.style.transform =
            'translateY(0) rotate(2deg) scale(.9)';

        }

      }
    );

  }


  /* =======================================================
     LOAD SONG
  ======================================================= */

  function loadSong(
    index,
    autoplay = false
  ) {

    if (
      index < 0 ||
      index >= songs.length
    ) {
      return;
    }


    activeSong =
      index;


    const song =
      songs[
        activeSong
      ];


    /*
      STOP AUDIO LAMA
    */

    audio.pause();


    isPlaying =
      false;


    updateSongPlayButton();


    /*
      RESET SOURCE
    */

    audio.removeAttribute(
      'src'
    );


    audio.load();


    /*
      SET SOURCE BARU
    */

    audio.src =
      song.audio;


    audio.preload =
      'metadata';


    /*
      TEXT
    */

    if (
      songTitle
    ) {

      songTitle.textContent =
        song.title;

    }


    if (
      songArtist
    ) {

      songArtist.textContent =
        song.artist;

    }


    if (
      playerTitle
    ) {

      playerTitle.textContent =
        song.title;

    }


    if (
      playerArtist
    ) {

      playerArtist.textContent =
        song.artist;

    }


    /*
      COVER
    */

    loadSongImage(
      songCover,
      song.cover
    );


    loadSongImage(
      playerCover,
      song.cover
    );


    /*
      RESET PROGRESS
    */

    if (
      songCurrent
    ) {

      songCurrent.textContent =
        '0:00';

    }


    if (
      songDuration
    ) {

      songDuration.textContent =
        song.duration;

    }


    if (
      songProgressFill
    ) {

      songProgressFill.style.width =
        '0%';

    }


    /*
      PAKSA BROWSER MEMBACA MP3
    */

    audio.load();


    console.log(
      '[MUSIC] Memuat:',
      song.audio
    );


    /*
      AUTOPLAY HANYA KALAU
      USER SUDAH SEDANG PLAY
    */

    if (
      autoplay
    ) {

      playCurrentSong();

    }


    updateSongOrbit();

  }


  /* =======================================================
     PLAY CURRENT SONG
  ======================================================= */

  function playCurrentSong() {

    if (
      !audio.src
    ) {

      loadSong(
        activeSong,
        false
      );

    }


    const playPromise =
      audio.play();


    if (
      playPromise &&
      typeof playPromise.then ===
      'function'
    ) {

      playPromise
        .then(
          () => {

            isPlaying =
              true;


            updateSongPlayButton();


            console.log(
              '[MUSIC] PLAY:',
              songs[
                activeSong
              ].title
            );

          }
        )
        .catch(
          error => {

            isPlaying =
              false;


            updateSongPlayButton();


            console.error(
              '[MUSIC] Gagal memutar:',
              error
            );


            console.error(
              '[MUSIC] File:',
              songs[
                activeSong
              ].audio
            );

          }
        );

    }

  }


  /* =======================================================
     PLAY / PAUSE
  ======================================================= */

  function toggleSong() {

    if (
      audio.paused
    ) {

      playCurrentSong();

    }

    else {

      audio.pause();

    }

  }


  /* =======================================================
     NEXT
  ======================================================= */

  function nextSong() {

    let nextIndex;


    if (
      isShuffle &&
      songs.length >
      1
    ) {

      nextIndex =
        activeSong;


      while (
        nextIndex ===
        activeSong
      ) {

        nextIndex =
          Math.floor(
            Math.random() *
            songs.length
          );

      }

    }

    else {

      nextIndex =
        (
          activeSong +
          1
        ) %
        songs.length;

    }


    const wasPlaying =
      isPlaying;


    loadSong(
      nextIndex,
      wasPlaying
    );

  }


  /* =======================================================
     PREVIOUS
  ======================================================= */

  function previousSong() {

    const previousIndex =
      (
        activeSong -
        1 +
        songs.length
      ) %
      songs.length;


    const wasPlaying =
      isPlaying;


    loadSong(
      previousIndex,
      wasPlaying
    );

  }


  /* =======================================================
     PLAY BUTTON
  ======================================================= */

  if (
    songPlay
  ) {

    songPlay.addEventListener(
      'click',
      event => {

        event.preventDefault();

        toggleSong();

      }
    );

  }


  /* =======================================================
     NEXT BUTTON
  ======================================================= */

  if (
    songNext
  ) {

    songNext.addEventListener(
      'click',
      nextSong
    );

  }


  /* =======================================================
     PREVIOUS BUTTON
  ======================================================= */

  if (
    songPrev
  ) {

    songPrev.addEventListener(
      'click',
      previousSong
    );

  }


  /* =======================================================
     SHUFFLE
  ======================================================= */

  if (
    songShuffle
  ) {

    songShuffle.addEventListener(
      'click',
      () => {

        isShuffle =
          !isShuffle;


        songShuffle.classList.toggle(
          'is-liked',
          isShuffle
        );


        songShuffle.setAttribute(
          'aria-pressed',
          String(
            isShuffle
          )
        );

      }
    );

  }


  /* =======================================================
     FAVORITE
  ======================================================= */

  if (
    songHeart
  ) {

    songHeart.addEventListener(
      'click',
      () => {

        isLiked =
          !isLiked;


        songHeart.textContent =
          isLiked
            ? '♥'
            : '♡';


        songHeart.classList.toggle(
          'is-liked',
          isLiked
        );


        songHeart.setAttribute(
          'aria-pressed',
          String(
            isLiked
          )
        );

      }
    );

  }


  /* =======================================================
     CLICK PROGRESS BAR
  ======================================================= */

  if (
    songProgress
  ) {

    songProgress.addEventListener(
      'click',
      event => {

        if (
          !Number.isFinite(
            audio.duration
          ) ||
          audio.duration <=
          0
        ) {

          return;

        }


        const rect =
          songProgress.getBoundingClientRect();


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


        updateSongProgress();

      }
    );

  }


  /* =======================================================
     AUDIO METADATA
  ======================================================= */

  audio.addEventListener(
    'loadedmetadata',
    () => {

      updateSongProgress();


      console.log(
        '[MUSIC] Metadata berhasil.'
      );


      console.log(
        '[MUSIC] Durasi:',
        formatSongTime(
          audio.duration
        )
      );

    }
  );


  /* =======================================================
     AUDIO CAN PLAY
  ======================================================= */

  audio.addEventListener(
    'canplay',
    () => {

      console.log(
        '[MUSIC] Audio siap dimainkan.'
      );

    }
  );


  /* =======================================================
     TIME UPDATE
  ======================================================= */

  audio.addEventListener(
    'timeupdate',
    () => {

      updateSongProgress();

    }
  );


  /* =======================================================
     PLAY EVENT
  ======================================================= */

  audio.addEventListener(
    'play',
    () => {

      isPlaying =
        true;


      updateSongPlayButton();

    }
  );


  /* =======================================================
     PAUSE EVENT
  ======================================================= */

  audio.addEventListener(
    'pause',
    () => {

      isPlaying =
        false;


      updateSongPlayButton();

    }
  );


  /* =======================================================
     END EVENT
  ======================================================= */

  audio.addEventListener(
    'ended',
    () => {

      isPlaying =
        false;


      updateSongPlayButton();


      /*
        OTOMATIS NEXT
      */

      nextSong();

    }
  );


  /* =======================================================
     ERROR EVENT
  ======================================================= */

  audio.addEventListener(
    'error',
    () => {

      isPlaying =
        false;


      updateSongPlayButton();


      const errorCode =
        audio.error
          ? audio.error.code
          : 'unknown';


      console.error(
        '================================'
      );


      console.error(
        '[MUSIC] AUDIO ERROR:',
        errorCode
      );


      console.error(
        '[MUSIC] File:',
        songs[
          activeSong
        ].audio
      );


      console.error(
        '================================'
      );

    }
  );


  /* =======================================================
     CLICK CARD
  ======================================================= */

  songCards.forEach(
    card => {

      card.addEventListener(
        'click',
        () => {

          const index =
            Number(
              card.dataset.index
            );


          if (
            !Number.isInteger(
              index
            )
          ) {
            return;
          }


          const wasPlaying =
            isPlaying;


          loadSong(
            index,
            wasPlaying
          );

        }
      );

    }
  );


  /* =======================================================
     3D CENTER
  ======================================================= */

  if (
    songCenter &&
    !reduced
  ) {

    songCenter.addEventListener(
      'pointermove',
      event => {

        if (
          event.pointerType &&
          event.pointerType !==
          'mouse'
        ) {

          return;

        }


        const rect =
          songCenter.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          ) /
          rect.width -
          0.5;


        const y =
          (
            event.clientY -
            rect.top
          ) /
          rect.height -
          0.5;


        songCenter.style.transform =
          `translate(-50%, -50%) rotateX(${(
            -y *
            5
          ).toFixed(2)}deg) rotateY(${(
            x *
            7
          ).toFixed(2)}deg)`;

      }
    );


    songCenter.addEventListener(
      'pointerleave',
      () => {

        songCenter.style.transform =
          'translate(-50%, -50%)';

      }
    );

  }


  /* =======================================================
     SWIPE HP
  ======================================================= */

  if (
    songOrbit
  ) {

    songOrbit.addEventListener(
      'pointerdown',
      event => {

        if (
          event.pointerType ===
          'mouse'
        ) {
          return;
        }


        touchStartX =
          event.clientX;

      }
    );


    songOrbit.addEventListener(
      'pointerup',
      event => {

        if (
          touchStartX ===
          null
        ) {

          return;

        }


        const difference =
          event.clientX -
          touchStartX;


        touchStartX =
          null;


        if (
          Math.abs(
            difference
          ) <
          45
        ) {

          return;

        }


        if (
          difference <
          0
        ) {

          nextSong();

        }

        else {

          previousSong();

        }

      }
    );


    songOrbit.addEventListener(
      'pointercancel',
      () => {

        touchStartX =
          null;

      }
    );

  }


  /* =======================================================
     KEYBOARD
  ======================================================= */

  document.addEventListener(
    'keydown',
    event => {

      const activeElement =
        document.activeElement;


      const isTyping =
        activeElement &&
        (
          activeElement.tagName ===
          'INPUT' ||

          activeElement.tagName ===
          'TEXTAREA'
        );


      if (
        isTyping
      ) {
        return;
      }


      const rect =
        section.getBoundingClientRect();


      const visible =
        rect.top <
        window.innerHeight &&
        rect.bottom >
        0;


      if (
        !visible
      ) {
        return;
      }


      if (
        event.key ===
        'ArrowLeft'
      ) {

        previousSong();

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        nextSong();

      }


      if (
        event.code ===
        'Space'
      ) {

        event.preventDefault();

        toggleSong();

      }

    }
  );


  /* =======================================================
     INITIAL SONG
  ======================================================= */

  loadSong(
    0,
    false
  );


  updateSongPlayButton();


  console.log(
    '===================================='
  );


  console.log(
    '[MY FAV SONG] PLAYER AKTIF'
  );


  console.log(
    '[MY FAV SONG] Lagu:',
    songs[
      activeSong
    ].title
  );


  console.log(
    '[MY FAV SONG] Audio:',
    songs[
      activeSong
    ].audio
  );


  console.log(
    '===================================='
  );

})();


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
  'resize',
  () => {

    sizeCanvas();

    layoutBadge();

    readScroll();

  },
  {
    passive: true
  }
);


/* =========================================================
   INITIALIZE HERO
========================================================= */

sizeCanvas();

layoutBadge();

readScroll();

sceneProgress =
  sceneTarget;


requestAnimationFrame(
  frame
);


/* =========================================================
   ABOUT ME — KARTU CLICK / SWIPE
   Klik kartu depan → keluar seperti kartu,
   kartu berikutnya maju. Setelah 3 klik kembali ke awal.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const aboutStack = document.getElementById("aboutPhotos");
  const aboutContent = document.querySelector(".about-content");

  if (!aboutStack) return;

  const cards = Array.from(
    aboutStack.querySelectorAll(".about-photo-card")
  );

  if (cards.length !== 3) return;

  let order = [0, 1, 2];
  let busy = false;
  let cycleCount = 0;

  const applyCardPositions = (withReturnAnimation = false) => {

    cards.forEach((card, index) => {

      card.classList.remove(
        "card-top",
        "card-middle",
        "card-back",
        "is-hidden",
        "is-shuffling",
        "is-returning"
      );

      const position = order.indexOf(index);

      if (position === 0) {
        card.classList.add("card-top");
      } else if (position === 1) {
        card.classList.add("card-middle");
      } else {
        card.classList.add("card-back");
      }

      if (withReturnAnimation) {
        card.classList.add("is-returning");

        setTimeout(() => {
          card.classList.remove("is-returning");
        }, 680);
      }

    });

  };

  applyCardPositions();


  const animateAboutText = () => {

    if (!aboutContent) return;

    aboutContent.classList.remove("about-card-changing");

    void aboutContent.offsetWidth;

    aboutContent.classList.add("about-card-changing");

    setTimeout(() => {
      aboutContent.classList.remove("about-card-changing");
    }, 520);

  };


  const animateAboutPhoto = () => {

    aboutStack.classList.remove("about-card-changing");

    void aboutStack.offsetWidth;

    aboutStack.classList.add("about-card-changing");

    setTimeout(() => {
      aboutStack.classList.remove("about-card-changing");
    }, 520);

  };


  const moveTopCard = () => {

    if (busy) return;

    busy = true;

    const topIndex = order[0];
    const topCard = cards[topIndex];

    if (!topCard) {
      busy = false;
      return;
    }

    animateAboutText();
    animateAboutPhoto();

    topCard.classList.remove(
      "card-top",
      "card-middle",
      "card-back"
    );

    topCard.classList.add("is-shuffling");


    setTimeout(() => {

      order = [
        order[1],
        order[2],
        order[0]
      ];

      cycleCount += 1;

      /* Setelah semua 3 kartu dipencet,
         susunan otomatis kembali ke awal. */
      const shouldCelebrateReset =
        cycleCount % cards.length === 0;

      applyCardPositions(shouldCelebrateReset);

      busy = false;

    }, 470);

  };


  cards.forEach((card) => {

    card.addEventListener("click", (event) => {

      event.preventDefault();

      const cardIndex = cards.indexOf(card);

      /* Hanya kartu yang sedang paling depan
         yang dipindahkan. */
      if (order[0] !== cardIndex) {

        /* Kartu belakang diberi sedikit respons,
           tapi tidak mengubah susunan. */
        card.animate(
          [
            {
              transform: "scale(1)"
            },
            {
              transform: "scale(.97)"
            },
            {
              transform: "scale(1)"
            }
          ],
          {
            duration: 260,
            easing: "ease-out"
          }
        );

        return;
      }

      moveTopCard();

    });

  });


  /* Swipe pada area kartu */
  let touchStartX = 0;
  let touchStartY = 0;

  aboutStack.addEventListener(
    "touchstart",
    (event) => {

      const touch = event.touches[0];

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

    },
    {
      passive: true
    }
  );


  aboutStack.addEventListener(
    "touchend",
    (event) => {

      const touch = event.changedTouches[0];

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (
        Math.abs(dx) > 55 &&
        Math.abs(dx) > Math.abs(dy)
      ) {
        moveTopCard();
      }

    },
    {
      passive: true
    }
  );

});


/* =========================================================
   MOBILE NAVBAR — FINAL
   ========================================================= */

(() => {

  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("navMenuBtn");

  if (!nav || !menuBtn) return;

  const closeMenu = () => {

    nav.classList.remove("nav-open");

    menuBtn.setAttribute(
      "aria-expanded",
      "false"
    );

    menuBtn.setAttribute(
      "aria-label",
      "Buka menu navigasi"
    );

  };


  menuBtn.addEventListener(
    "click",
    (event) => {

      event.preventDefault();
      event.stopPropagation();

      const opened =
        nav.classList.toggle("nav-open");

      menuBtn.setAttribute(
        "aria-expanded",
        String(opened)
      );

      menuBtn.setAttribute(
        "aria-label",
        opened
          ? "Tutup menu navigasi"
          : "Buka menu navigasi"
      );

    }
  );


  nav
    .querySelectorAll(".nav-links a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {
          closeMenu();
        }
      );

    });


  document.addEventListener(
    "click",
    (event) => {

      if (!nav.contains(event.target)) {
        closeMenu();
      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 760) {
        closeMenu();
      }

    }
  );

})();


/* =========================================================
   MODE — DEFAULT PAGI
   Pencet tombol navbar → malam / pagi.
   ========================================================= */

(() => {

  const modeButton =
    document.getElementById("modeBtn");

  if (!modeButton) return;

  const modeLabel =
    modeButton.querySelector(".mode-label");


  const applyMode = (mode) => {

    document.body.dataset.mode = mode;

    modeButton.setAttribute(
      "aria-pressed",
      String(mode === "night")
    );

    if (modeLabel) {
      modeLabel.textContent =
        mode === "night"
          ? "Malam"
          : "Pagi";
    }

    modeButton.title =
      mode === "night"
        ? "Ganti ke pagi"
        : "Ganti ke malam";

    try {
      localStorage.setItem(
        "raja-mode",
        mode
      );
    } catch (error) {}

  };


  let savedMode = "day";

  try {

    savedMode =
      localStorage.getItem("raja-mode")
      || "day";

  } catch (error) {
    savedMode = "day";
  }


  applyMode(savedMode);


  modeButton.addEventListener(
    "click",
    () => {

      const nextMode =
        document.body.dataset.mode === "day"
          ? "night"
          : "day";

      applyMode(nextMode);

    }
  );

})();
