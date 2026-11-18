document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.documentElement;
  const tplButtons = document.querySelectorAll('.tpl-btn');

  // 1. 4 Interactive Background Templates State
  let currentTemplate = localStorage.getItem('mj-interactive-bg-tpl') || 'constellation';
  setTemplate(currentTemplate);

  function setTemplate(tpl) {
    currentTemplate = tpl;
    htmlEl.setAttribute('data-bg-template', tpl);
    localStorage.setItem('mj-interactive-bg-tpl', tpl);

    tplButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.template === tpl);
    });
  }

  tplButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setTemplate(btn.dataset.template);
    });
  });

  // 2. Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${pct}%`;
  });

  // 3. Mouse-Reactive Interactive Canvas Engine (4 Distinct Playable Modes)
  const canvas = document.getElementById('interactiveBgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      vx: 0,
      vy: 0,
      active: false,
      down: false
    };

    const clickShockwaves = [];
    const cursorTrail = [];

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
      initMatrix();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn interactive trail particles based on active template
      for (let i = 0; i < 3; i++) {
        cursorTrail.push({
          x: mouse.x + (Math.random() - 0.5) * 12,
          y: mouse.y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 2.5 + mouse.vx * 0.08,
          vy: (Math.random() - 0.5) * 2.5 + mouse.vy * 0.08,
          size: Math.random() * 4 + 1.5,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.018
        });
      }
    });

    window.addEventListener('mousedown', (e) => {
      mouse.down = true;
      clickShockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 8,
        maxRadius: 240,
        alpha: 0.95
      });
    });

    window.addEventListener('mouseup', () => {
      mouse.down = false;
    });

    // --- Data for Template 01: Cyber Neural Web ---
    let nodes = [];
    function initNodes() {
      const count = Math.min(85, Math.floor((width * height) / 14000));
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.85,
          vy: (Math.random() - 0.5) * 0.85,
          r: Math.random() * 2.2 + 1.4
        });
      }
    }
    initNodes();

    // --- Data for Template 02: Inferno Fire Vortex ---
    const embers = [];
    for (let i = 0; i < 95; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.1,
        vy: -(Math.random() * 2.2 + 0.8),
        size: Math.random() * 3.6 + 1.4,
        wobble: Math.random() * Math.PI * 2
      });
    }

    // --- Data for Template 03: Matrix Code Ripple ---
    let columns = [];
    const chars = '01MJCSHARP<>/{}[]$#@*&%';
    function initMatrix() {
      const fontSize = 16;
      const colCount = Math.floor(width / fontSize);
      columns = [];
      for (let i = 0; i < colCount; i++) {
        columns.push({
          x: i * fontSize,
          y: Math.random() * height,
          speed: Math.random() * 2.8 + 1.4,
          char: chars[Math.floor(Math.random() * chars.length)]
        });
      }
    }
    initMatrix();

    // --- Data for Template 04: Sunlit Aurora Fluid Orbs ---
    const fluidBubbles = [];
    for (let i = 0; i < 36; i++) {
      fluidBubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 36 + 16,
        hue: i % 2 === 0 ? 199 : 265
      });
    }

    function renderLoop() {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Active Template
      if (currentTemplate === 'constellation') {
        drawConstellation();
      } else if (currentTemplate === 'inferno') {
        drawInferno();
      } else if (currentTemplate === 'matrix') {
        drawMatrix();
      } else if (currentTemplate === 'aurora') {
        drawAurora();
      }

      // 2. Render Interactive Click Shockwaves (Works across all 4 templates)
      for (let i = clickShockwaves.length - 1; i >= 0; i--) {
        const sw = clickShockwaves[i];
        sw.radius += 7.5;
        sw.alpha -= 0.024;
        if (sw.alpha <= 0) {
          clickShockwaves.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = getTemplateColor(sw.alpha);
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      // 3. Render Cursor Trail Particles
      for (let i = cursorTrail.length - 1; i >= 0; i--) {
        const p = cursorTrail[i];
        p.x += p.vx;
        p.y += p.vy;
        if (currentTemplate === 'inferno') p.vy -= 0.08;
        p.life -= p.decay;
        if (p.life <= 0) {
          cursorTrail.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = getTemplateColor(p.life * 0.85);
        ctx.fill();
      }

      requestAnimationFrame(renderLoop);
    }

    function getTemplateColor(alpha) {
      if (currentTemplate === 'inferno') return `rgba(255, 110, 20, ${alpha})`;
      if (currentTemplate === 'matrix') return `rgba(16, 185, 129, ${alpha})`;
      if (currentTemplate === 'aurora') return `rgba(2, 132, 199, ${alpha})`;
      return `rgba(0, 242, 254, ${alpha})`;
    }

    function drawConstellation() {
      // Cursor magnetic glow
      const cursorGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 190);
      cursorGrad.addColorStop(0, 'rgba(0, 242, 254, 0.16)');
      cursorGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Cursor gravitational pull / push
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 185 && dist > 1) {
          const force = (185 - dist) / 185;
          const dir = mouse.down ? -1 : 1; // Repel on click, attract on hover
          n.x += (dx / dist) * force * 1.4 * dir;
          n.y += (dy / dist) * force * 1.4 * dir;

          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${force * 0.65})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Node-to-node links
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const d2 = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (d2 < 120) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - d2 / 120) * 0.32})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.fill();
      }
    }

    function drawInferno() {
      // Cursor fire torch aura
      const fireAura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
      fireAura.addColorStop(0, 'rgba(255, 120, 0, 0.25)');
      fireAura.addColorStop(0.5, 'rgba(255, 45, 0, 0.08)');
      fireAura.addColorStop(1, 'rgba(255, 45, 0, 0)');
      ctx.fillStyle = fireAura;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.wobble += 0.03;
        e.x += e.vx + Math.sin(e.wobble) * 0.65;
        e.y += e.vy;

        // Swirl around mouse cursor
        const dx = mouse.x - e.x;
        const dy = mouse.y - e.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 170 && dist > 1) {
          const force = (170 - dist) / 170;
          e.x += (-dy / dist) * force * 3.5; // Vortex swirl
          e.y += (dx / dist) * force * 2.2 - force * 1.5;
        }

        if (e.y < -20) {
          e.y = height + 20;
          e.x = Math.random() * width;
        }

        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 2.5);
        grad.addColorStop(0, 'rgba(255, 235, 160, 0.95)');
        grad.addColorStop(0.5, 'rgba(255, 90, 0, 0.75)');
        grad.addColorStop(1, 'rgba(255, 30, 0, 0)');
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    function drawMatrix() {
      ctx.font = '600 14px "JetBrains Mono", monospace';
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.y += col.speed;
        if (col.y > height + 20) {
          col.y = -20;
          col.char = chars[Math.floor(Math.random() * chars.length)];
        }

        const dist = Math.hypot(mouse.x - col.x, mouse.y - col.y);
        const nearCursor = dist < 140;
        if (nearCursor && Math.random() > 0.7) {
          col.char = chars[Math.floor(Math.random() * chars.length)];
        }

        ctx.fillStyle = nearCursor
          ? 'rgba(167, 243, 208, 0.95)'
          : 'rgba(16, 185, 129, 0.34)';
        ctx.fillText(col.char, col.x, col.y);
      }
    }

    function drawAurora() {
      for (let i = 0; i < fluidBubbles.length; i++) {
        const b = fluidBubbles[i];
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -50) b.x = width + 50;
        if (b.x > width + 50) b.x = -50;
        if (b.y < -50) b.y = height + 50;
        if (b.y > height + 50) b.y = -50;

        // Gentle repulsion when cursor glides through bubbles
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160 && dist > 1) {
          const push = ((160 - dist) / 160) * 2.6;
          b.x += (dx / dist) * push;
          b.y += (dy / dist) * push;
        }

        const grad = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.radius);
        grad.addColorStop(0, `hsla(${b.hue}, 85%, 60%, 0.28)`);
        grad.addColorStop(1, `hsla(${b.hue}, 85%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    renderLoop();
  }

  // 4. Typing Effect in Hero
  const typingEl = document.getElementById('typingText');
  const phrases = [
    '1st Year IT Student @ Mindoro State University',
    'Aspiring Future Engineer · Calapan City',
    'C# & C Programming Certified (99%+ Score)',
    'Interactive Mouse-Reactive Portfolio · 2026'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const currentPhrase = phrases[phraseIdx];
    typingEl.textContent = currentPhrase.substring(0, charIdx);

    if (!isDeleting && charIdx < currentPhrase.length) {
      charIdx++;
      setTimeout(typeLoop, 55);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
    } else if (isDeleting && charIdx > 0) {
      charIdx--;
      setTimeout(typeLoop, 30);
    } else {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 350);
    }
  }
  typeLoop();

  // 5. 3D Hover Tilt on Cards
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 6. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 7. Scroll Reveal
  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealItems.forEach((el) => observer.observe(el));

  // 8. Certificate Modal
  const certificates = {
    csharp: {
      badge: 'CODECHUM C# · VERIFIED',
      score: '99.8% · 1312/1315',
      subtitle: 'C# Programming 1 (1F3-ITC112-CSharp)',
      description:
        'has successfully completed C# Programming 1 in 1F3-ITC112-CSharp with a total score of 1312/1315 at Mindoro State University.',
      date: 'Nov. 8, 2026',
      id: '32405',
      rawScore: '1312 / 1315',
      url: 'https://minsu.codechum.com/certificates/32405'
    },
    clang: {
      badge: 'CODECHUM C · VERIFIED',
      score: '99.0% · 1352/1365',
      subtitle: 'C Programming 1 (1F3-ITC112)',
      description:
        'has successfully completed C Programming 1 in 1F3-ITC112 with a total score of 1352/1365 at Mindoro State University.',
      date: 'Nov. 8, 2026',
      id: '32362',
      rawScore: '1352 / 1365',
      url: 'https://minsu.codechum.com/certificates/32362'
    }
  };

  const modal = document.getElementById('certModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalDoneBtn = document.getElementById('modalDoneBtn');

  function openCertModal(key) {
    const data = certificates[key];
    if (!data || !modal) return;
    document.getElementById('modalBadge').textContent = data.badge;
    document.getElementById('modalScore').textContent = data.score;
    document.getElementById('modalSubtitle').textContent = data.subtitle;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalCertId').textContent = data.id;
    document.getElementById('modalRawScore').textContent = data.rawScore;
    document.getElementById('modalVerifyLink').href = data.url;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeCertModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => openCertModal(card.dataset.cert));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertModal(card.dataset.cert);
      }
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCertModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeCertModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeCertModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCertModal(); });

  // 9. Copy Email Button
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        const original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => { copyEmailBtn.textContent = original; }, 2000);
      } catch {
        copyEmailBtn.textContent = email;
      }
    });
  }

  // 10. Direct Email Sender (FormSubmit AJAX + Mailto Fallback)
  const contactForm = document.getElementById('contactForm');
  const sendDirectBtn = document.getElementById('sendDirectBtn');
  const sendBtnText = document.getElementById('sendBtnText');
  const openMailAppBtn = document.getElementById('openMailAppBtn');
  const formFeedback = document.getElementById('formFeedback');

  function triggerMailto() {
    const name = document.getElementById('senderName').value.trim() || 'Portfolio Visitor';
    const senderEmail = document.getElementById('senderEmail').value.trim();
    const subjectInput = document.getElementById('senderSubject').value.trim() || `Portfolio Message from ${name}`;
    const message = document.getElementById('senderMessage').value.trim() || 'Hi MJ!';

    const subject = encodeURIComponent(subjectInput);
    const body = encodeURIComponent(
      `Hi Mark James (MJ),

${message}

---
From: ${name}${senderEmail ? ` (${senderEmail})` : ''}`
    );
    window.location.href = `mailto:gamboamarkjamesberon@gmail.com?subject=${subject}&body=${body}`;
  }

  if (openMailAppBtn) {
    openMailAppBtn.addEventListener('click', triggerMailto);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (sendDirectBtn) sendDirectBtn.disabled = true;
      if (sendBtnText) sendBtnText.textContent = 'Sending to MJ... ⏳';
      if (formFeedback) {
        formFeedback.className = 'form-feedback info';
        formFeedback.textContent = 'Dispatching message to gamboamarkjamesberon@gmail.com...';
      }

      try {
        const res = await fetch('https://formsubmit.co/ajax/gamboamarkjamesberon@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            _subject: `[Portfolio] ${subject}`,
            message
          })
        });

        if (res.ok) {
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = '✓ Message sent directly to MJ! (Note: First-time FormSubmit use requires clicking the one-time activation link sent to gamboamarkjamesberon@gmail.com).';
          }
          contactForm.reset();
        } else {
          throw new Error('Fallback to mailto');
        }
      } catch {
        if (formFeedback) {
          formFeedback.className = 'form-feedback info';
          formFeedback.textContent = 'Opening your email app so you can send the message directly...';
        }
        triggerMailto();
      } finally {
        if (sendDirectBtn) sendDirectBtn.disabled = false;
        if (sendBtnText) sendBtnText.textContent = "Send Direct to MJ's Inbox 🚀";
      }
    });
  }
});
