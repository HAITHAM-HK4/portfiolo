/* ================================================================
   cv.js — السكريبت الموحد للموقع
   يشمل: المؤشر، السكرول، الربط مع API، تبديل اللغة، الجسيمات
   ================================================================ */

// 1. CUSTOM CURSOR
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, input, textarea, .bento-card, .skill-card')) {
        dot.style.transform  = 'translate(-50%,-50%) scale(1.5)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
        ring.style.borderColor = '#b026ff';
    }
});
document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, input, textarea, .bento-card, .skill-card')) {
        dot.style.transform  = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor = 'rgba(168,85,247,0.6)';
    }
});

// 2. SCROLL & ACTIVE LINKS
window.addEventListener('scroll', () => {
    let prog = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scrollProgress').style.width = prog + '%';

    document.querySelector('.header').classList.toggle('sticky', window.scrollY > 100);

    let sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        let top    = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id     = sec.getAttribute('id');
        let navMap = { home:'nav-home', about:'nav-about', skills:'nav-skills', portfolio:'nav-projects', education:'nav-edu', contact:'nav-contact' };
        if (top >= offset && top < offset + height && navMap[id]) {
            document.querySelectorAll('header nav a').forEach(a => a.classList.remove('active'));
            let navEl = document.getElementById(navMap[id]);
            if (navEl) navEl.classList.add('active');
        }
    });
});

// ================================================================
// 3. API INTEGRATION — يجلب البيانات من Netlify Functions
// ================================================================
var isAr = false;

/* cache محلي للبيانات بعد الجلب */
var _cachedDb = null;

/* جلب البيانات من API مرة واحدة ثم تخزينها */
async function fetchPortfolioData() {
    if (_cachedDb) return _cachedDb;
    try {
        var res  = await fetch('/.netlify/functions/data');
        var data = await res.json();
        _cachedDb = data;
        return data;
    } catch (e) {
        console.warn('CV API error, using empty data:', e);
        _cachedDb = {};
        return {};
    }
}

var T = {
    'nav-home':               { en:'Home',                  ar:'الرئيسية' },
    'nav-about':              { en:'About',                 ar:'عني' },
    'nav-skills':             { en:'Skills',                ar:'المهارات' },
    'nav-projects':           { en:'Projects',              ar:'المشاريع' },
    'nav-edu':                { en:'Education',             ar:'التعليم' },
    'nav-contact':            { en:'Contact',               ar:'تواصل' },
    'about-heading':          { en:'About <span>Me</span>', ar:'عن <span>نفسي</span>' },
    'skills-heading':         { en:'Skills &amp; <span>Tools</span>', ar:'المهارات &amp; <span>الأدوات</span>' },
    'projects-heading':       { en:'Latest <span>Projects</span>',    ar:'أحدث <span>المشاريع</span>' },
    'edu-heading':            { en:'My <span>Education</span>',       ar:'تعليمي <span>الأكاديمي</span>' },
    'contact-heading':        { en:'Contact <span>Me!</span>',        ar:'تواصل <span>معي!</span>' },
    'about-btn-download':     { en:'Download CV',           ar:'تحميل السيرة' },
    'about-btn-view':         { en:'View CV',               ar:'عرض السيرة' },
    'cv-btn':                 { en:'Hire Me',               ar:'وظّفني' },
    'skills-label':           { en:'Technologies & Strengths', ar:'التقنيات والمهارات' },
    'lbl-name-title':         { en:'Name',                  ar:'الاسم' },
    'lbl-title-title':        { en:'Title',                 ar:'المسمى' },
    'lbl-email-title':        { en:'Email',                 ar:'البريد' },
    'lbl-loc-title':          { en:'Location',              ar:'الموقع' },
    'lbl-contact-email-title':    { en:'Email',             ar:'البريد الإلكتروني' },
    'lbl-contact-phone-title':    { en:'Phone',             ar:'رقم الهاتف' },
    'lbl-contact-loc-title':      { en:'Location',          ar:'الموقع الحالي' },
    'lbl-contact-linkedin-title': { en:'LinkedIn',          ar:'لينكد إن' },
    'lbl-contact-coding-title':   { en:'Current Coding',    ar:'الترميز الحالي' },
    'home-hello':             { en:"Hello, It's Me",        ar:'مرحباً، أنا' }
};

/* يُعيد رسم المحتوى بناءً على البيانات المخزّنة + اللغة الحالية */
function renderDynamicContent(db) {
    if (!db) db = _cachedDb;
    if (!db) return;

    var lang = isAr ? 'ar' : 'en';

    var map = {
        'home-desc':   db.home   && db.home['desc_'   + lang],
        'about-desc':  db.about  && db.about['desc_'  + lang],
        'lbl-name':    db.about  && db.about['name_'  + lang],
        'lbl-title':   db.about  && db.about['title_' + lang],
        'lbl-loc':     db.about  && db.about['loc_'   + lang],
        'lbl-email':   db.about  && db.about.email,
        'edu-desc':    db.edu    && db.edu['desc_'    + lang]
    };
    Object.keys(map).forEach(function(id) {
        var el = document.getElementById(id);
        if (el && map[id]) el.textContent = map[id];
    });

    if (db.contact) {
        var cEmail = document.getElementById('contact-email');
        if (cEmail && db.contact.email) {
            cEmail.textContent = db.contact.email;
            cEmail.href = 'mailto:' + db.contact.email;
        }
        var cPhone = document.getElementById('contact-phone');
        if (cPhone && db.contact.phone) cPhone.textContent = db.contact.phone;

        var cLoc = document.getElementById('contact-loc');
        if (cLoc && db.contact['loc_' + lang]) cLoc.textContent = db.contact['loc_' + lang];

        var cLi = document.getElementById('contact-linkedin');
        if (cLi) {
            cLi.textContent = isAr ? 'عرض الحساب الشخصي' : 'View Profile';
            cLi.href = db.contact.linkedin || '#';
        }

        var cCoding = document.getElementById('contact-coding');
        if (cCoding && db.contact['coding_' + lang]) cCoding.textContent = db.contact['coding_' + lang];
    }

    var sw = document.getElementById('skills-wrapper');
    if (sw && db.skills && db.skills.length > 0) {
        sw.innerHTML = db.skills.map(function(s) {
            var tagsHtml = (s.tags || '').split(',')
                .filter(function(t) { return t.trim(); })
                .map(function(t) { return '<span class="skill-tag">' + t.trim() + '</span>'; })
                .join('');
            return '<div class="skill-card">'
                + '<div class="skill-card-title">'
                + '<i class="fa-solid fa-microchip" style="font-size:2rem;color:var(--purple);margin-bottom:.8rem;display:block;"></i>'
                + (s['name_' + lang] || '') + '</div>'
                + '<div class="skill-card-desc">' + (s['desc_' + lang] || '') + '</div>'
                + '<div class="skill-tags">' + tagsHtml + '</div>'
                + '</div>';
        }).join('');
    }

    var pw = document.getElementById('projects-wrapper');
    if (pw && db.projects && db.projects.length > 0) {
        var visitText  = isAr ? 'زيارة الموقع' : 'Visit Site';
        var detailText = isAr ? 'تفاصيل' : 'Details';
        pw.innerHTML = db.projects.map(function(p) {
            var tagsHtml = (p.tags || '').split(',')
                .filter(function(t) { return t.trim(); })
                .map(function(t) { return '<span class="bento-tag">' + t.trim() + '</span>'; })
                .join('');

            var name = (p['name_' + lang] || '').replace(/'/g, "\\'").replace(/\n/g, ' ').replace(/\r/g, '');
            var full = (p['full_' + lang] || '').replace(/'/g, "\\'").replace(/\n/g, '<br>').replace(/\r/g, '');

            return '<div class="bento-card reveal">'
                + '<div class="bento-img-area">'
                + '<img src="' + (p.img || 'https://placehold.co/400x250/0b0025/a855f7?text=Project') + '" alt="Project">'
                + '</div>'
                + '<div class="bento-body">'
                + '<div class="bento-name">' + (p['name_' + lang] || '') + '</div>'
                + '<div class="bento-tags">' + tagsHtml + '</div>'
                + '<div class="bento-desc">' + (p['short_' + lang] || '') + '</div>'
                + '<div class="bento-actions">'
                + '<a href="' + (p.link || '#') + '" target="_blank" class="bento-btn-visit"><i class="fa-solid fa-link"></i> ' + visitText + '</a>'
                + '<button class="bento-btn-desc" onclick="openDescPopup(\'' + name + '\',\'' + full + '\')">'
                + '<i class="fa-solid fa-circle-info"></i> ' + detailText + '</button>'
                + '</div></div></div>';
        }).join('');
    }

    if (typeof observer !== 'undefined') {
        document.querySelectorAll('.reveal, .slide-left, .slide-right').forEach(function(el) {
            observer.observe(el);
        });
    }
}

// 4. LANGUAGE TOGGLE
function toggleLang() {
    isAr = !isAr;
    var lang = isAr ? 'ar' : 'en';
    document.documentElement.setAttribute('dir',  isAr ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', isAr ? 'ar'  : 'en');
    document.getElementById('lang-label-nav').textContent = isAr ? 'EN' : 'AR';

    Object.keys(T).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = T[id][lang];
    });

    renderDynamicContent();
}

// 5. POPUP للمشاريع
function openDescPopup(title, text) {
    var overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = '<div class="popup-content">'
        + '<button class="close-popup" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">&times;</button>'
        + '<h3 style="color:#a855f7;margin-bottom:1rem;">' + title + '</h3>'
        + '<div class="popup-scroll" style="color:#e9d5ff;line-height:1.8;">' + text + '</div>'
        + '</div>';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem;';
    overlay.querySelector('.popup-content').style.cssText = 'background:#0b0025;border:1px solid #4c1d95;border-radius:1rem;padding:2rem;max-width:600px;width:100%;position:relative;max-height:80vh;overflow-y:auto;';
    document.body.appendChild(overlay);
    overlay.querySelector('.close-popup').onclick = function() { overlay.remove(); };
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// 6. CONTACT FORM
var form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn  = form.querySelector('button[type="submit"]');
        var orig = btn.innerHTML;
        btn.textContent = isAr ? 'جاري الإرسال...' : 'Sending...';

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function(response) {
            if (response.ok) {
                btn.textContent = isAr ? 'تم الإرسال ✓' : 'Sent Successfully ✓';
                btn.style.background = 'linear-gradient(135deg,#4c1d95,#7c3aed)';
                form.reset();
            } else {
                btn.textContent = isAr ? 'حدث خطأ ✗' : 'Error ✗';
                btn.style.background = '#f43f5e';
            }
            setTimeout(function() { btn.innerHTML = orig; btn.style.background = ''; }, 3000);
        }).catch(function() {
            btn.textContent = isAr ? 'حدث خطأ ✗' : 'Error ✗';
            btn.style.background = '#f43f5e';
            setTimeout(function() { btn.innerHTML = orig; btn.style.background = ''; }, 3000);
        });
    });
}

// 7. REVEAL ON SCROLL
var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.12 });

// 8. PARTICLE BACKGROUND
(function() {
    var canvas = document.getElementById('constellation');
    if (!canvas) return;

    if (typeof THREE !== 'undefined') {
        var scene    = new THREE.Scene();
        var camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        var geo   = new THREE.BufferGeometry();
        var count = 3500;
        var pos   = new Float32Array(count * 3);
        for (var i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 100;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        var mat    = new THREE.PointsMaterial({ size: 0.12, color: 0xa855f7, transparent: true, opacity: 0.6 });
        var points = new THREE.Points(geo, mat);
        scene.add(points);

        function animate3D() {
            requestAnimationFrame(animate3D);
            points.rotation.y += 0.001;
            points.rotation.x += 0.0005;
            renderer.render(scene, camera);
        }
        animate3D();

        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

    } else {
        var ctx = canvas.getContext('2d');
        var W, H, particles, mouse = { x: -9999, y: -9999 };

        function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', function() { resize(); init(); });
        document.addEventListener('mousemove', function(e) { mouse.x = e.clientX; mouse.y = e.clientY; });

        function Particle() { this.reset(); }
        Particle.prototype.reset = function() {
            this.x = Math.random() * W; this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.35; this.vy = (Math.random() - 0.5) * 0.35;
            this.r = Math.random() * 2 + 0.8; this.alpha = Math.random() * 0.6 + 0.2;
            var cols = ['168,85,247','124,58,237','224,64,251','200,100,255'];
            this.color = cols[Math.floor(Math.random() * cols.length)];
        };
        Particle.prototype.update = function() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
        };
        Particle.prototype.draw = function() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')';
            ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(' + this.color + ',0.6)';
            ctx.fill(); ctx.shadowBlur = 0;
        };
        function init() { particles = []; for (var i = 0; i < Math.floor((W*H)/14000); i++) particles.push(new Particle()); }
        init();

        function drawCanvas() {
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 130) {
                        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(168,85,247,' + ((1 - dist/130) * 0.18) + ')';
                        ctx.lineWidth = 0.8; ctx.stroke();
                    }
                }
                var mdx = particles[i].x - mouse.x, mdy = particles[i].y - mouse.y;
                var mdist = Math.sqrt(mdx*mdx + mdy*mdy);
                if (mdist < 160) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(224,64,251,' + ((1 - mdist/160) * 0.45) + ')';
                    ctx.lineWidth = 1; ctx.stroke();
                }
            }
            particles.forEach(function(p) { p.update(); p.draw(); });
            requestAnimationFrame(drawCanvas);
        }
        drawCanvas();
    }
})();

// 9. INIT — جلب البيانات من API ثم رسم الصفحة
var _loadStart = Date.now();
document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('.reveal, .slide-left, .slide-right').forEach(function(el) {
        observer.observe(el);
    });

    setTimeout(function() {
        var h = document.querySelector('.header');
        if (h) h.classList.add('nav-visible');
    }, 400);

    /* عداد النسبة المئوية للـ loader */
    (function() {
        var pctEl = document.getElementById('loader-pct');
        if (!pctEl) return;
        var start = Date.now(), duration = 3200, endVal = 100;
        function tick() {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = progress < .85 ? progress * (progress * .5 + .75) : progress;
            var val = Math.min(Math.round(eased * endVal), 100);
            pctEl.textContent = val + '%';
            if (progress < 1) requestAnimationFrame(tick);
        }
        tick();
    })();

    /* fallback: أخفِ الـ loader بعد 3.5 ثوانٍ على أي حال */
    setTimeout(function() {
        var sk = document.getElementById('page-loader');
        if (sk) sk.classList.add('hide');
    }, 5500);

    /* جلب البيانات ورسمها */
    fetchPortfolioData().then(function(db) {
        renderDynamicContent(db);
        /* إخفاء الـ loader بعد اكتمال البيانات — لا يقل عن 2.5 ثانية */
        var elapsed = Date.now() - _loadStart;
        var delay = Math.max(0, 5500 - elapsed);
        setTimeout(function() {
            var sk = document.getElementById('page-loader');
            if (sk) sk.classList.add('hide');
        }, delay);
    });
});
