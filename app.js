const SERIES = [
  { key: "posts", label: "Posts", field: "postCount", color: "#39c9b4" },
  { key: "reactions", label: "Median reactions", field: "medianReactions", color: "#63e4d1" },
  { key: "comments", label: "Median comments", field: "medianComments", color: "#f0efe6" },
  { key: "shares", label: "Median shares", field: "medianShares", color: "#a6a8a0" },
];

const FORMAT_ORDER = ["text", "image", "carousel", "video", "document", "article"];

const state = {
  data: null,
  on: { posts: true, reactions: true, comments: true, shares: true },
  hover: null,
};

const fmt = new Intl.NumberFormat("en-US");
const fmtDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function $(sel, el = document) {
  return el.querySelector(sel);
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function monthLabel(iso) {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
    new Date(iso + "T12:00:00Z"),
  );
}

function render(data) {
  const p = data.prospect;
  const g = data.glance;
  document.title = `Sample LinkedIn look · ${p.name} · Gemela Media`;

  $("#app").innerHTML = `
    <header class="hero" id="top">
      <div class="wrap hero-glow">
        <span class="lab">Sample 12-month LinkedIn look</span>
        <div class="who">
          <div class="photo-wrap">
            <div class="photo-fallback" aria-hidden="true">${esc(p.firstName).slice(0, 1)}${esc(p.name.split(" ").pop()).slice(0, 1)}</div>
            <img src="${esc(p.photo)}" alt="Headshot of ${esc(p.name)}, a fictional sample prospect" width="800" height="800">
            <span class="li-mark" title="LinkedIn mock" aria-hidden="true">in</span>
          </div>
          <div>
            <h1>${esc(p.name)}</h1>
            <p class="role">${esc(p.role)}, ${esc(p.company)}</p>
            <p class="headline">${esc(p.headline)}</p>
            <div class="who-meta">
              <span><b>${fmt.format(p.followers)}</b> followers</span>
              <span><b>${fmt.format(p.connections)}</b> connections</span>
              <span>${esc(p.location)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section id="glance">
      <div class="wrap">
        <span class="eyebrow">Last 12 months</span>
        <h2 class="h2">At a glance</h2>
        <p class="sub">Original posts only. Quote posts and reposts are excluded from every number on this page.</p>
        <div class="statgrid">
          <article class="stat">
            <div class="k">Total posts</div>
            <div class="fig">${fmt.format(g.totalPosts)}</div>
          </article>
          <article class="stat">
            <div class="k">Average per week</div>
            <div class="fig">${g.averagePostsPerWeek}</div>
          </article>
          <article class="stat">
            <div class="k">Longest gap</div>
            <div class="fig">${g.longestGapDays}<span class="u">days</span></div>
          </article>
          <article class="stat">
            <div class="k">Reactions</div>
            <div class="pair">
              <span><i>Median</i><b>${fmt.format(g.medianReactions)}</b></span>
              <span><i>P75</i><b>${fmt.format(g.p75Reactions)}</b></span>
            </div>
          </article>
          <article class="stat">
            <div class="k">Comments</div>
            <div class="pair">
              <span><i>Median</i><b>${fmt.format(g.medianComments)}</b></span>
              <span><i>P75</i><b>${fmt.format(g.p75Comments)}</b></span>
            </div>
          </article>
          <article class="stat">
            <div class="k">Shares</div>
            <div class="pair">
              <span><i>Median</i><b>${fmt.format(g.medianShares)}</b></span>
              <span><i>P75</i><b>${fmt.format(g.p75Shares)}</b></span>
            </div>
          </article>
        </div>

        <div class="split">
          <div class="panel">
            <span class="lab">Trajectory</span>
            <p class="chart-note" style="margin:10px 0 14px">Weekly averages for the last 12 months. Tap a series to show or hide it. Any mix is fine, including one at a time.</p>
            <div class="toggles" id="toggles"></div>
            <div class="chart-wrap" id="chart"></div>
            <p class="chart-note" id="scale-note"></p>
          </div>
          <div class="panel">
            <span class="lab">Format mix</span>
            <p class="chart-note" style="margin:10px 0 16px">Share of the ${g.totalPosts} original posts.</p>
            <div class="mix" id="mix"></div>
          </div>
        </div>
      </div>
    </section>

    <section id="top-posts">
      <div class="wrap">
        <span class="eyebrow">What landed</span>
        <h2 class="h2">Top five posts</h2>
        <p class="sub">Ranked by reactions. Hook, type, date, and counts only.</p>
        <div class="posts">${data.topFive.map(postCard).join("")}</div>
      </div>
    </section>

    <section id="bottom-posts">
      <div class="wrap">
        <span class="eyebrow">What did not</span>
        <h2 class="h2">Bottom five posts</h2>
        <p class="sub">Ranked by reactions, lowest first. Same fields. No rewrite.</p>
        <div class="posts">${data.bottomFive.map(postCard).join("")}</div>
      </div>
    </section>

    <section id="profile">
      <div class="wrap">
        <span class="eyebrow">Profile health</span>
        <h2 class="h2">What is on the profile</h2>
        <p class="sub">Yes or no. This section reads the profile as it is. It does not rewrite it.</p>
        <div class="health">
          <div class="check">
            ${data.profileHealth.items.map(healthItem).join("")}
          </div>
          <div class="read">
            <article class="panel">
              <span class="lab">AEO read</span>
              <h3>Headline</h3>
              <p>${esc(data.profileHealth.aeo.headline)}</p>
              <h3>About</h3>
              <p>${esc(data.profileHealth.aeo.about)}</p>
            </article>
            <article class="panel">
              <span class="lab">Featured vs what performed</span>
              <h3>The pin board and the feed</h3>
              <p>${esc(data.profileHealth.featuredVsPerformed)}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  `;

  renderToggles();
  renderMix(g.formatMix, g.totalPosts);
  renderChart();
  const photo = $(".photo-wrap img");
  if (photo) {
    photo.addEventListener("error", () => {
      photo.style.display = "none";
    });
  }
}

function postCard(p) {
  return `
    <article class="post">
      <div>
        <p class="hook">${esc(p.hook)}</p>
        <div class="meta">
          <span class="type">${esc(p.type)}</span>
          <span>${fmtDate.format(new Date(p.date + "T12:00:00Z"))}</span>
        </div>
      </div>
      <div class="metrics">
        <span><b>${fmt.format(p.reactions)}</b><i>Reactions</i></span>
        <span><b>${fmt.format(p.comments)}</b><i>Comments</i></span>
        <span><b>${fmt.format(p.shares)}</b><i>Shares</i></span>
      </div>
      <a class="open" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Open post</a>
    </article>
  `;
}

function healthItem(item) {
  const yes = item.present;
  return `
    <article class="item ${yes ? "yes" : "no"}">
      <span class="mark" aria-hidden="true">${yes ? "✓" : "✕"}</span>
      <div>
        <h3>${esc(item.label)}</h3>
        <p>${esc(item.note)}</p>
      </div>
    </article>
  `;
}

function renderToggles() {
  const el = $("#toggles");
  const allOn = SERIES.every((s) => state.on[s.key]);
  el.innerHTML = `
    <button type="button" class="toggle all" data-all="1" aria-pressed="${allOn}">All</button>
    ${SERIES.map(
      (s) => `
      <button type="button" class="toggle" data-key="${s.key}" aria-pressed="${state.on[s.key]}">
        <span class="dot"></span>${s.label}
      </button>
    `,
    ).join("")}
  `;
  el.onclick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.all) {
      const turnOn = !SERIES.every((s) => state.on[s.key]);
      for (const s of SERIES) state.on[s.key] = turnOn;
    } else {
      const key = btn.dataset.key;
      state.on[key] = !state.on[key];
    }
    renderToggles();
    renderChart();
  };
}

function renderMix(mix, total) {
  const max = Math.max(...FORMAT_ORDER.map((k) => mix[k] || 0), 1);
  $("#mix").innerHTML = FORMAT_ORDER.map((k) => {
    const n = mix[k] || 0;
    const pct = total ? Math.round((n / total) * 100) : 0;
    return `
      <div class="mix-row">
        <span class="n">${k}</span>
        <div class="bar ${n === 0 ? "zero" : ""}" title="${n} posts, ${pct}%">
          <i style="width:${(n / max) * 100}%"></i>
        </div>
        <span class="count">${n}</span>
      </div>
    `;
  }).join("");
}

function activeSeries() {
  return SERIES.filter((s) => state.on[s.key]);
}

function seriesMax(field) {
  const vals = state.data.weekly.map((w) => w[field]).filter((v) => v != null);
  return Math.max(0, ...vals, 1);
}

let hideChartTip = () => {};

function renderChart() {
  const weeks = state.data.weekly;
  const wrap = $("#chart");
  const note = $("#scale-note");
  const active = activeSeries();
  const W = 1000;
  const H = 320;
  const pad = { l: 52, r: 16, t: 18, b: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const n = weeks.length;
  const xAt = (i) => pad.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yAt = (field, v) => {
    const max = seriesMax(field);
    const t = v == null ? null : v / max;
    return t == null ? null : pad.t + innerH - t * innerH;
  };

  if (!active.length) {
    wrap.innerHTML = `<p class="chart-note">Turn on at least one series.</p>`;
    note.textContent = "";
    return;
  }

  const single = active.length === 1;
  note.textContent = single
    ? `Scale is ${active[0].label.toLowerCase()}.`
    : "Each series is scaled to its own range so the shapes can sit on one chart.";

  const grid = [];
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (innerH * i) / 4;
    grid.push(`<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`);
  }

  let yLabels = "";
  if (single) {
    const max = seriesMax(active[0].field);
    for (let i = 0; i <= 4; i++) {
      const v = max * (1 - i / 4);
      const y = pad.t + (innerH * i) / 4;
      const label = v >= 10 ? Math.round(v) : Math.round(v * 10) / 10;
      yLabels += `<text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" fill="var(--muted)" font-size="12" font-family="var(--mono)">${label}</text>`;
    }
  }

  const monthTicks = [];
  let last = "";
  let lastX = -999;
  weeks.forEach((w, i) => {
    const m = monthLabel(w.start);
    const x = xAt(i);
    if (m !== last && x - lastX > 54) {
      last = m;
      lastX = x;
      monthTicks.push(
        `<text x="${x}" y="${H - 8}" text-anchor="middle" fill="var(--muted)" font-size="12" font-family="var(--mono)">${m}</text>`,
      );
    }
  });

  const paths = active
    .map((s) => {
      let d = "";
      let drawing = false;
      weeks.forEach((w, i) => {
        const raw = w[s.field];
        const y = yAt(s.field, raw);
        if (y == null) {
          drawing = false;
          return;
        }
        d += `${drawing ? "L" : "M"}${xAt(i).toFixed(1)},${y.toFixed(1)} `;
        drawing = true;
      });
      return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
    })
    .join("");

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Weekly trajectory for posts, reactions, comments, and shares">
      ${grid.join("")}
      ${yLabels}
      ${paths}
      ${monthTicks.join("")}
      <line id="hair" x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${pad.t + innerH}" stroke="var(--accent)" stroke-width="1.2" opacity="0"/>
    </svg>
    <div class="tooltip" id="tip" hidden></div>
  `;

  const svg = $("svg", wrap);
  const hair = $("#hair", wrap);
  const tip = $("#tip", wrap);

  const nearest = (clientX) => {
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    let dist = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(xAt(i) - x);
      if (d < dist) {
        dist = d;
        best = i;
      }
    }
    return best;
  };

  const show = (i, clientX, clientY) => {
    const w = weeks[i];
    const x = xAt(i);
    hair.setAttribute("x1", x);
    hair.setAttribute("x2", x);
    hair.setAttribute("opacity", "0.7");
    const rows = SERIES.map((s) => {
      const off = !state.on[s.key];
      const val = w[s.field];
      const label = val == null ? "none" : fmt.format(val);
      return `<div class="${off ? "off" : ""}"><span>${s.label}</span><span>${label}</span></div>`;
    }).join("");
    tip.innerHTML = `<b>${fmtDate.format(new Date(w.start + "T12:00:00Z"))}</b>${rows}`;
    tip.hidden = false;
    const wrapRect = wrap.getBoundingClientRect();
    let left = clientX - wrapRect.left;
    const maxLeft = wrapRect.width - 20;
    left = Math.max(20, Math.min(left, maxLeft));
    tip.style.left = `${left}px`;
    tip.style.top = `${Math.max(8, clientY - wrapRect.top)}px`;
  };

  const hide = () => {
    hair.setAttribute("opacity", "0");
    tip.hidden = true;
  };

  const onPointer = (e) => {
    if (e.pointerType === "mouse" && e.type === "pointerdown") return;
    const i = nearest(e.clientX);
    show(i, e.clientX, e.clientY);
  };

  svg.addEventListener("pointerdown", (e) => {
    svg.setPointerCapture(e.pointerId);
    onPointer(e);
  });
  svg.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse" || svg.hasPointerCapture(e.pointerId)) onPointer(e);
  });
  svg.addEventListener("pointerup", (e) => {
    if (e.pointerType === "mouse") hide();
  });
  svg.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") hide();
  });
  svg.addEventListener("pointercancel", hide);
  hideChartTip = hide;
}

async function main() {
  try {
    const res = await fetch("./data/sample.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load sample data");
    state.data = await res.json();
    render(state.data);
  } catch (err) {
    $("#app").innerHTML = `<p class="err wrap">Could not load the sample look. Serve the folder over HTTP (see the README) rather than opening the file directly.</p>`;
    console.error(err);
  }
}

main();

document.addEventListener("pointerdown", (e) => {
  const wrap = $("#chart");
  if (wrap && !wrap.contains(e.target)) hideChartTip();
});
