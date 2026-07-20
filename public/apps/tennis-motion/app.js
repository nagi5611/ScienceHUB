/**
 * テニスボール運動解析 — クライアントサイドのみ
 */

const APP_SLUG = "tennis-motion";
const APP_PATH = `/apps/${APP_SLUG}/`;

/** アクセス権を確認 */
async function checkAccess() {
  const response = await fetch(`/api/apps/${APP_SLUG}/access`, {
    credentials: "same-origin",
  });

  if (response.status === 401) {
    window.location.href = "/login/?next=" + encodeURIComponent(APP_PATH);
    return false;
  }

  if (!response.ok) {
    document.getElementById("access-denied").hidden = false;
    return false;
  }

  document.getElementById("app-main").hidden = false;
  return true;
}

/** アプリ本体を初期化 */
function initApp() {
  const $ = (s) => document.querySelector(s);
  const video = $("#video");
  const ov = $("#overlay");
  const ctx = ov.getContext("2d");
  const st = $("#strobe");
  const sctx = st.getContext("2d");

  const S = {
    url: null,
    name: null,
    fps: 30,
    points: [],
    origin: null,
    scaleA: null,
    scaleB: null,
    horizA: null,
    horizB: null,
    analysis: [],
    metrics: null,
    bg: null,
  };

  const fi = () => Math.round(video.currentTime * S.fps);
  const stepT = () => Number($("#step").value || 1) / S.fps;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function status(m, ok = false) {
    $("#status").textContent = m;
    $("#status").className = "tm-alert" + (ok ? " tm-alert--ok" : "");
  }

  function metrics() {
    $("#count").textContent = S.points.length;
    $("#tm").textContent = (video.currentTime || 0).toFixed(3) + " s";
  }

  function resize() {
    if (!video.videoWidth) return;
    const w = Math.round(
      Math.min(1100, $(".tm-stagewrap").clientWidth - 16, video.videoWidth)
    );
    const h = Math.round((w * video.videoHeight) / video.videoWidth);
    video.style.width = w + "px";
    video.style.height = h + "px";
    ov.width = w;
    ov.height = h;
    draw();
  }

  function disp(p) {
    return {
      x: (p.x * ov.width) / video.videoWidth,
      y: (p.y * ov.height) / video.videoHeight,
    };
  }

  function mark(p, c, r = 5) {
    const q = disp(p);
    ctx.beginPath();
    ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
    ctx.fillStyle = c;
    ctx.fill();
    ctx.strokeStyle = "#111827";
    ctx.stroke();
  }

  function line(a, b, c, w) {
    const p = disp(a);
    const q = disp(b);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, ov.width, ov.height);
    const f = fi();
    S.points.forEach((p) =>
      mark(p, p.frame === f ? "#ff3b1f" : "#ffe000", p.frame === f ? 6 : 4)
    );
    if (S.origin) {
      const q = disp(S.origin);
      ctx.strokeStyle = "#0ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(q.x - 12, q.y);
      ctx.lineTo(q.x + 12, q.y);
      ctx.moveTo(q.x, q.y - 12);
      ctx.lineTo(q.x, q.y + 12);
      ctx.stroke();
    }
    [
      ["scaleA", "#38d26a"],
      ["scaleB", "#38d26a"],
      ["horizA", "#4ca6ff"],
      ["horizB", "#4ca6ff"],
    ].forEach(([k, c]) => S[k] && mark(S[k], c, 6));
    if (S.scaleA && S.scaleB) line(S.scaleA, S.scaleB, "#38d26a", 4);
    if (S.horizA && S.horizB) line(S.horizA, S.horizB, "#4ca6ff", 3);
  }

  $("#drop").onclick = () => $("#file").click();
  $("#file").onchange = (e) => e.target.files[0] && load(e.target.files[0]);
  ["dragenter", "dragover"].forEach((x) =>
    $("#drop").addEventListener(x, (e) => {
      e.preventDefault();
      $("#drop").classList.add("is-dragover");
    })
  );
  ["dragleave", "drop"].forEach((x) =>
    $("#drop").addEventListener(x, (e) => {
      e.preventDefault();
      $("#drop").classList.remove("is-dragover");
    })
  );
  $("#drop").addEventListener(
    "drop",
    (e) => e.dataTransfer.files[0] && load(e.dataTransfer.files[0])
  );

  function load(f) {
    if (S.url) URL.revokeObjectURL(S.url);
    S.url = URL.createObjectURL(f);
    S.name = f.name;
    video.src = S.url;
    video.load();
    $("#info").textContent = `${f.name} / ${(f.size / 1048576).toFixed(1)} MB`;
    status("動画情報を読み込んでいます…");
  }

  video.onloadedmetadata = () => {
    $("#seek").max = video.duration;
    $("#dur").textContent = video.duration.toFixed(3) + " s";
    resize();
    status("原点と縮尺を設定してください。", true);
  };
  video.onloadeddata = captureBg;
  video.ontimeupdate = () => {
    $("#seek").value = video.currentTime;
    $("#now").textContent = video.currentTime.toFixed(3) + " s";
    metrics();
    draw();
  };
  video.onseeked = draw;
  window.onresize = resize;
  $("#seek").oninput = (e) => (video.currentTime = Number(e.target.value));
  $("#fps").onchange = (e) => (S.fps = Math.max(1, Number(e.target.value) || 30));
  $("#prev").onclick = () =>
    (video.currentTime = clamp(video.currentTime - stepT(), 0, video.duration || 0));
  $("#next").onclick = () =>
    (video.currentTime = clamp(video.currentTime + stepT(), 0, video.duration || 0));
  $("#play").onclick = () => (video.paused ? video.play() : video.pause());
  video.onplay = () => ($("#play").textContent = "⏸ 一時停止");
  video.onpause = () => ($("#play").textContent = "▶ 再生");

  ov.onclick = (e) => {
    if (!video.videoWidth) return;
    const r = ov.getBoundingClientRect();
    const p = {
      x: ((e.clientX - r.left) * video.videoWidth) / r.width,
      y: ((e.clientY - r.top) * video.videoHeight) / r.height,
    };
    const m = $("#mode").value;
    if (m === "track") {
      const f = fi();
      const q = { frame: f, time: video.currentTime, x: p.x, y: p.y };
      const i = S.points.findIndex((z) => z.frame === f);
      if (i >= 0) S.points[i] = q;
      else S.points.push(q);
      S.points.sort((a, b) => a.frame - b.frame);
      video.currentTime = clamp(video.currentTime + stepT(), 0, video.duration);
    } else {
      S[m] = p;
    }
    metrics();
    draw();
    updateAS();
  };

  $("#del").onclick = () => {
    const i = S.points.findIndex((p) => p.frame === fi());
    if (i >= 0) S.points.splice(i, 1);
    metrics();
    draw();
    updateAS();
  };
  $("#clearPts").onclick = () => {
    S.points = [];
    S.analysis = [];
    metrics();
    draw();
    updateAS();
  };
  $("#clearAll").onclick = () => {
    S.points = [];
    S.analysis = [];
    S.origin = S.scaleA = S.scaleB = S.horizA = S.horizB = null;
    metrics();
    draw();
    updateAS();
  };

  document.querySelector(".tm-tabs").querySelectorAll("button").forEach((b) => {
    b.onclick = () => {
      document.querySelector(".tm-tabs").querySelectorAll("button").forEach((x) => x.classList.remove("is-active"));
      document.querySelectorAll(".tm-panel").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      $("#" + b.dataset.tab).classList.add("is-active");
      if (b.dataset.tab === "graphTab") analyze();
    };
  });

  const ready = () =>
    S.origin && S.scaleA && S.scaleB && Number($("#scaleLen").value) > 0;

  function ppm() {
    return (
      Math.hypot(S.scaleB.x - S.scaleA.x, S.scaleB.y - S.scaleA.y) /
      Number($("#scaleLen").value)
    );
  }

  function theta() {
    return S.horizA && S.horizB
      ? Math.atan2(S.horizB.y - S.horizA.y, S.horizB.x - S.horizA.x)
      : 0;
  }

  function updateAS() {
    const ok = ready() && S.points.length >= 3;
    $("#analysisStatus").textContent = ok
      ? "解析できます。"
      : "較正と3点以上の追跡が必要です。";
    $("#analysisStatus").className = "tm-alert" + (ok ? " tm-alert--ok" : "");
  }

  function avg(a, w) {
    w = Math.max(1, Math.floor(w));
    if (w % 2 === 0) w++;
    const h = (w - 1) / 2;
    return a.map((_, i) => {
      let s = 0;
      let n = 0;
      for (let j = Math.max(0, i - h); j <= Math.min(a.length - 1, i + h); j++) {
        s += a[j];
        n++;
      }
      return s / n;
    });
  }

  function grad(y, t) {
    return y.map((_, i) =>
      i === 0
        ? (y[1] - y[0]) / (t[1] - t[0])
        : i === y.length - 1
          ? (y[i] - y[i - 1]) / (t[i] - t[i - 1])
          : (y[i + 1] - y[i - 1]) / (t[i + 1] - t[i - 1])
    );
  }

  function solve(A, b) {
    const M = A.map((r, i) => [...r, b[i]]);
    for (let i = 0; i < 3; i++) {
      let m = i;
      for (let j = i + 1; j < 3; j++)
        if (Math.abs(M[j][i]) > Math.abs(M[m][i])) m = j;
      [M[i], M[m]] = [M[m], M[i]];
      const p = M[i][i];
      if (Math.abs(p) < 1e-12) return [NaN, NaN, NaN];
      for (let k = i; k < 4; k++) M[i][k] /= p;
      for (let j = 0; j < 3; j++) {
        if (j === i) continue;
        const f = M[j][i];
        for (let k = i; k < 4; k++) M[j][k] -= f * M[i][k];
      }
    }
    return [M[0][3], M[1][3], M[2][3]];
  }

  function qfit(t, y) {
    let s0 = t.length;
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;
    let s4 = 0;
    let sy = 0;
    let sty = 0;
    let st2y = 0;
    t.forEach((x, i) => {
      const x2 = x * x;
      s1 += x;
      s2 += x2;
      s3 += x2 * x;
      s4 += x2 * x2;
      sy += y[i];
      sty += x * y[i];
      st2y += x2 * y[i];
    });
    const [c, b, a] = solve(
      [
        [s0, s1, s2],
        [s1, s2, s3],
        [s2, s3, s4],
      ],
      [sy, sty, st2y]
    );
    return { a, b, c, p: t.map((x) => a * x * x + b * x + c) };
  }

  function analyze() {
    updateAS();
    if (!ready() || S.points.length < 3) return;
    const P = ppm();
    const th = theta();
    const c = Math.cos(th);
    const s = Math.sin(th);
    const t0 = S.points[0].time;
    let R = S.points.map((p) => {
      const dx = p.x - S.origin.x;
      const dy = p.y - S.origin.y;
      return {
        frame: p.frame,
        time: p.time - t0,
        x: (c * dx + s * dy) / P,
        y: (s * dx - c * dy) / P,
      };
    });
    const t = R.map((r) => r.time);
    const xs = avg(R.map((r) => r.x), Number($("#smooth").value) || 1);
    const ys = avg(R.map((r) => r.y), Number($("#smooth").value) || 1);
    const vx = grad(xs, t);
    const vy = grad(ys, t);
    const ax = grad(vx, t);
    const ay = grad(vy, t);
    const fx = qfit(
      t,
      R.map((r) => r.x)
    );
    const fy = qfit(
      t,
      R.map((r) => r.y)
    );
    R = R.map((r, i) => ({
      ...r,
      vx: vx[i],
      vy: vy[i],
      speed: Math.hypot(vx[i], vy[i]),
      ax: ax[i],
      ay: ay[i],
      xFit: fx.p[i],
      yFit: fy.p[i],
    }));
    S.analysis = R;
    S.metrics = {
      v0: Math.hypot(fx.b, fy.b),
      angle: (Math.atan2(fy.b, fx.b) * 180) / Math.PI,
      ax: 2 * fx.a,
      ay: 2 * fy.a,
    };
    $("#v0").textContent = S.metrics.v0.toFixed(3) + " m/s";
    $("#ang").textContent = S.metrics.angle.toFixed(2) + "°";
    $("#axfit").textContent = S.metrics.ax.toFixed(3) + " m/s²";
    $("#ayfit").textContent = S.metrics.ay.toFixed(3) + " m/s²";
    plot(
      $("#px"),
      t,
      [R.map((r) => r.x), R.map((r) => r.xFit)],
      ["測定", "フィット"],
      "x-t グラフ",
      "x (m)"
    );
    plot(
      $("#py"),
      t,
      [R.map((r) => r.y), R.map((r) => r.yFit)],
      ["測定", "フィット"],
      "y-t グラフ",
      "y (m)"
    );
    plot(
      $("#pv"),
      t,
      [vx, vy, R.map((r) => r.speed)],
      ["vx", "vy", "速さ"],
      "v-t グラフ",
      "v (m/s)"
    );
    plot(
      $("#pa"),
      t,
      [ax, ay],
      ["ax", "ay"],
      "a-t グラフ",
      "a (m/s²)"
    );
    render(R);
  }

  $("#analyze").onclick = analyze;

  function plot(cv, x, Ss, L, title, yl) {
    const d = devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    cv.width = w * d;
    cv.height = h * d;
    const c = cv.getContext("2d");
    c.scale(d, d);
    c.fillStyle = "#fff";
    c.fillRect(0, 0, w, h);
    const all = Ss.flat().filter(Number.isFinite);
    const xmin = Math.min(...x);
    const xmax = Math.max(...x);
    const ymin = Math.min(...all);
    const ymax = Math.max(...all);
    const l = 58;
    const r = 20;
    const t = 42;
    const b = 46;
    const dx = xmax - xmin || 1;
    const dy = ymax - ymin || 1;
    const X = (v) => l + ((v - xmin) / dx) * (w - l - r);
    const Y = (v) => h - b - ((v - ymin) / dy) * (h - t - b);
    c.strokeStyle = "#cbd5e1";
    c.strokeRect(l, t, w - l - r, h - t - b);
    c.font = "12px sans-serif";
    c.fillStyle = "#334155";
    for (let i = 0; i <= 5; i++) {
      const xv = xmin + (dx * i) / 5;
      const yv = ymin + (dy * i) / 5;
      c.fillText(xv.toFixed(2), X(xv) - 12, h - 23);
      c.fillText(yv.toFixed(2), 5, Y(yv) + 4);
    }
    const C = ["#f38020", "#dc2626", "#0f766e"];
    Ss.forEach((a, k) => {
      c.beginPath();
      a.forEach((v, i) => (i ? c.lineTo(X(x[i]), Y(v)) : c.moveTo(X(x[i]), Y(v))));
      c.strokeStyle = C[k];
      c.lineWidth = 2;
      c.stroke();
    });
    c.font = "bold 15px sans-serif";
    c.fillStyle = "#0f172a";
    c.fillText(title, 12, 22);
    c.font = "12px sans-serif";
    c.fillText("t (s)", w / 2, h - 5);
    c.save();
    c.translate(12, h / 2);
    c.rotate(-Math.PI / 2);
    c.fillText(yl, 0, 0);
    c.restore();
    let lx = l;
    L.forEach((q, k) => {
      c.fillStyle = C[k];
      c.fillRect(lx, t - 17, 16, 3);
      c.fillStyle = "#334155";
      c.fillText(q, lx + 21, t - 12);
      lx += 72;
    });
  }

  function render(R) {
    const K = [
      ["frame", "frame"],
      ["time", "time_s"],
      ["x", "x_m"],
      ["y", "y_m"],
      ["vx", "vx_m_s"],
      ["vy", "vy_m_s"],
      ["speed", "speed_m_s"],
      ["ax", "ax_m_s2"],
      ["ay", "ay_m_s2"],
    ];
    $("#table").innerHTML =
      "<thead><tr>" +
      K.map((x) => `<th>${x[1]}</th>`).join("") +
      "</tr></thead><tbody>" +
      R.map(
        (r) =>
          "<tr>" +
          K.map(
            ([k]) =>
              `<td>${k === "frame" ? r[k] : Number(r[k]).toFixed(5)}</td>`
          ).join("") +
          "</tr>"
      ).join("") +
      "</tbody>";
  }

  function captureBg() {
    if (!video.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext("2d").drawImage(video, 0, 0);
    S.bg = c;
  }

  $("#mkStrobe").onclick = () => {
    if (!S.points.length) return alert("追跡点がありません");
    if (!S.bg) captureBg();
    st.width = video.videoWidth;
    st.height = video.videoHeight;
    sctx.drawImage(S.bg, 0, 0);
    const e = Math.max(1, Number($("#every").value) || 1);
    const P = S.points.filter((_, i) => i % e === 0);
    if ($("#showPath").value === "yes" && P.length > 1) {
      sctx.beginPath();
      P.forEach((p, i) => (i ? sctx.lineTo(p.x, p.y) : sctx.moveTo(p.x, p.y)));
      sctx.strokeStyle = "rgba(255,60,30,.9)";
      sctx.lineWidth = Math.max(3, video.videoWidth / 400);
      sctx.stroke();
    }
    const r = Math.max(8, video.videoWidth / 90);
    const t0 = P[0].time;
    P.forEach((p) => {
      sctx.beginPath();
      sctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      sctx.fillStyle = "rgba(255,225,0,.72)";
      sctx.fill();
      sctx.strokeStyle = "#ff321e";
      sctx.lineWidth = Math.max(2, r / 4);
      sctx.stroke();
      if ($("#showTime").value === "yes") {
        sctx.font = `${Math.max(16, video.videoWidth / 60)}px sans-serif`;
        sctx.lineWidth = 4;
        sctx.strokeStyle = "#000";
        sctx.fillStyle = "#fff";
        const x = p.x + r + 5;
        const y = p.y - r;
        const txt = (p.time - t0).toFixed(3) + " s";
        sctx.strokeText(txt, x, y);
        sctx.fillText(txt, x, y);
      }
    });
    $("#saveStrobe").disabled = false;
  };

  function dl(blob, n) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = n;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  $("#saveStrobe").onclick = () => st.toBlob((b) => dl(b, "strobe.png"));
  $("#csv").onclick = () => {
    analyze();
    if (!S.analysis.length) return alert("解析データがありません");
    const h =
      "frame,time_s,x_m,y_m,vx_m_s,vy_m_s,speed_m_s,ax_m_s2,ay_m_s2\n";
    const b = S.analysis
      .map((r) =>
        [r.frame, r.time, r.x, r.y, r.vx, r.vy, r.speed, r.ax, r.ay].join(",")
      )
      .join("\n");
    dl(new Blob(["\uFEFF" + h + b], { type: "text/csv;charset=utf-8" }), "motion_analysis.csv");
  };
  $("#project").onclick = () => {
    const d = {
      app: "tennis_motion_browser",
      version: 1,
      fileName: S.name,
      fps: S.fps,
      points: S.points,
      origin: S.origin,
      scaleA: S.scaleA,
      scaleB: S.scaleB,
      horizA: S.horizA,
      horizB: S.horizB,
      scaleLength: Number($("#scaleLen").value),
      frameStep: Number($("#step").value),
    };
    dl(
      new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }),
      "motion_project.json"
    );
  };
  $("#projectIn").onchange = async (e) => {
    try {
      const d = JSON.parse(await e.target.files[0].text());
      if (d.app !== "tennis_motion_browser") throw Error("形式が違います");
      S.fps = d.fps || 30;
      $("#fps").value = S.fps;
      S.points = d.points || [];
      S.origin = d.origin;
      S.scaleA = d.scaleA;
      S.scaleB = d.scaleB;
      S.horizA = d.horizA;
      S.horizB = d.horizB;
      $("#scaleLen").value = d.scaleLength || 1;
      $("#step").value = d.frameStep || 1;
      draw();
      metrics();
      updateAS();
      alert("読み込みました");
    } catch (x) {
      alert("読込失敗: " + x.message);
    }
  };

  updateAS();
}

const allowed = await checkAccess();
if (allowed) initApp();
