  // ==========================================
        // MATH GRID BACKGROUND ANIMATION (Canvas)
        // ==========================================
        const canvas = document.getElementById('math-grid-canvas');
        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];
        let gridPoints = [];
        let mouseX = 0, mouseY = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGrid();
            initParticles();
        }

        function initGrid() {
            gridPoints = [];
            const spacing = 60;
            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    gridPoints.push({
                        x: x,
                        y: y,
                        baseX: x,
                        baseY: y,
                        size: 1.5,
                        opacity: 0.15
                    });
                }
            }
        }

        function initParticles() {
            particles = [];
            const mathSymbols = ['∑', '∫', 'π', '∞', '√', 'Δ', '∂', 'θ', 'λ', 'σ', 'φ', 'ε', '≈', '≠', '≤', '≥', '±', '×', '÷', '∇', '⊗', '⊕', 'α', 'β', 'γ'];

            for (let i = 0; i < 40; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 18 + 12,
                    symbol: mathSymbols[Math.floor(Math.random() * mathSymbols.length)],
                    opacity: Math.random() * 0.12 + 0.03,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 0.5
                });
            }

            // Floating equations
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 10 + 8,
                    symbol: ['E=mc²', 'a²+b²=c²', 'f(x)=x²', 'dy/dx', '∫₀¹ f(x)dx', 'Σn²', 'lim x→∞', 'sin²θ+cos²θ=1'][i],
                    opacity: Math.random() * 0.06 + 0.02,
                    rotation: 0,
                    rotationSpeed: 0
                });
            }
        }

        function drawGrid() {
            gridPoints.forEach(point => {
                const dx = mouseX - point.baseX;
                const dy = mouseY - point.baseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 200;

                let newX = point.baseX;
                let newY = point.baseY;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    newX += (dx / dist) * force * -15;
                    newY += (dy / dist) * force * -15;
                }

                const opacity = dist < maxDist ? point.opacity + (1 - dist / maxDist) * 0.3 : point.opacity;

                ctx.beginPath();
                ctx.arc(newX, newY, point.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(66, 99, 235, ${opacity})`;
                ctx.fill();
            });

            // Draw grid lines
            const spacing = 60;
            ctx.strokeStyle = 'rgba(66, 99, 235, 0.04)';
            ctx.lineWidth = 0.5;

            for (let x = 0; x < canvas.width; x += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            for (let y = 0; y < canvas.height; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }

        function drawParticles() {
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                if (p.x < -100) p.x = canvas.width + 100;
                if (p.x > canvas.width + 100) p.x = -100;
                if (p.y < -100) p.y = canvas.height + 100;
                if (p.y > canvas.height + 100) p.y = -100;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.font = `${p.size}px 'JetBrains Mono', monospace`;
                ctx.fillStyle = `rgba(66, 99, 235, ${p.opacity})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.symbol, 0, 0);
                ctx.restore();
            });
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 200) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(66, 99, 235, ${0.03 * (1 - dist / 200)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            drawConnections();
            drawParticles();
            animationId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        resizeCanvas();
        animate();

        // ==========================================
        // FLOATING MATH SYMBOLS (DOM)
        // ==========================================
        function createFloatingSymbols() {
            const container = document.getElementById('floating-symbols');
            const symbols = ['+', '−', '×', '÷', '=', '∑', '∫', 'π', '√', '∞', 'Δ', 'θ', 'α', 'β'];

            symbols.forEach((symbol, i) => {
                const el = document.createElement('div');
                el.className = 'math-symbol';
                el.textContent = symbol;
                el.style.left = Math.random() * 100 + '%';
                el.style.fontSize = (Math.random() * 20 + 16) + 'px';
                el.style.animationDuration = (Math.random() * 15 + 20) + 's';
                el.style.animationDelay = (Math.random() * 10) + 's';
                container.appendChild(el);
            });
        }
        createFloatingSymbols();

        // ==========================================
        // LANGUAGE TOGGLE (Khmer / English)
        // ==========================================
        let currentLang = 'en';

        const langToggle = document.getElementById('lang-toggle');
        const currentLangDisplay = document.getElementById('current-lang');
        const langDot = document.getElementById('lang-dot');

        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'kh' : 'en';

            // Update display
            currentLangDisplay.textContent = currentLang.toUpperCase();
            langDot.style.left = currentLang === 'en' ? '0.5rem' : '0.125rem';

            // Toggle body class
            document.body.classList.toggle('khmer-mode', currentLang === 'kh');

            // Update all translatable elements
            document.querySelectorAll('[data-en]').forEach(el => {
                const text = el.getAttribute(`data-${currentLang}`);
                if (text) {
                    el.style.opacity = '0';
                    setTimeout(() => {
                        el.textContent = text;
                        el.style.opacity = '1';
                    }, 150);
                }
            });

            // Update placeholders
            document.querySelectorAll('[data-en-placeholder]').forEach(el => {
                const ph = el.getAttribute(`data-${currentLang}-placeholder`);
                if (ph) {
                    el.placeholder = ph;
                }
            });

            // Update select options
            document.querySelectorAll('select option[data-en]').forEach(opt => {
                const text = opt.getAttribute(`data-${currentLang}`);
                if (text) opt.textContent = text;
            });
        });

        // ==========================================
        // TYPING EFFECT
        // ==========================================
        const typingTexts = {
            en: ['Algebra & Equations', 'Calculus & Analysis', 'Geometry & Trigonometry', 'Statistics & Probability', 'Competition Math Prep', 'University Mathematics'],
            kh: ['ពិជគណិត និងសមីការ', 'គណិតវិទ្យា និងការវិភាគ', 'ធរណីមាត្រ និងត្រីកោណមាត្រ', 'ស្ថិតិ និងប្រូបាប', 'ត្រៀមប្រកួតគណិតវិទ្យា', 'គណិតវិទ្យាសាកលវិទ្យាល័យ']
        };

        let typingIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingElement = document.getElementById('typing-text');

        function typeEffect() {
            const texts = typingTexts[currentLang];
            const currentText = texts[typingIndex % texts.length];

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let speed = isDeleting ? 30 : 60;

            if (!isDeleting && charIndex === currentText.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                typingIndex++;
                speed = 300;
            }

            setTimeout(typeEffect, speed);
        }
        typeEffect();

        // ==========================================
        // COUNTER ANIMATION
        // ==========================================
        function animateCounters() {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const start = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(eased * target);

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target;
                    }
                }
                requestAnimationFrame(update);
            });
        }

        // ==========================================
        // SCROLL REVEAL ANIMATIONS
        // ==========================================
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Trigger counter animation when stats are visible
                    if (entry.target.closest('#home')) {
                        animateCounters();
                    }

                    // Trigger skill bars
                    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                        setTimeout(() => bar.classList.add('active'), 300);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            observer.observe(el);
        });

        // Also observe skill section for skill bars
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
                        setTimeout(() => bar.classList.add('active'), i * 100);
                    });
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('#skills').forEach(el => skillsObserver.observe(el));

        // ==========================================
        // NAVBAR SCROLL EFFECT
        // ==========================================
        const navbar = document.getElementById('navbar');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                navbar.classList.add('bg-slate-900/90', 'backdrop-blur-xl', 'border-b', 'border-slate-800/50', 'shadow-lg');
            } else {
                navbar.classList.remove('bg-slate-900/90', 'backdrop-blur-xl', 'border-b', 'border-slate-800/50', 'shadow-lg');
            }

            lastScroll = currentScroll;
        });

        // Active nav link
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active', 'text-white');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active', 'text-white');
                }
            });
        });

        // ==========================================
        // BACK TO TOP BUTTON
        // ==========================================
        const backToTop = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                backToTop.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTop.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                backToTop.classList.remove('opacity-100', 'translate-y-0');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ==========================================
        // MOBILE MENU
        // ==========================================
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const mobileOverlay = document.getElementById('mobile-overlay');

        function openMobileMenu() {
            mobileMenu.classList.add('open');
            mobileOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeMobileMenu() {
            mobileMenu.classList.remove('open');
            mobileOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }

        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);

        document.querySelectorAll('.mobile-nav-link, #mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // ==========================================
        // CONTACT FORM
        // ==========================================
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = this.querySelector('button[type="submit"]');
            const originalContent = btn.innerHTML;

            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check mr-2"></i> Message Sent!';
                btn.classList.remove('from-math-600', 'to-math-500');
                btn.classList.add('from-green-600', 'to-green-500');

                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.classList.remove('from-green-600', 'to-green-500');
                    btn.classList.add('from-math-600', 'to-math-500');
                    btn.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });

        // ==========================================
        // SMOOTH SCROLL FOR ANCHOR LINKS
        // ==========================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });

        // ==========================================
        // INITIAL COUNTER TRIGGER
        // ==========================================
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const heroSection = document.getElementById('home');
        if (heroSection) heroObserver.observe(heroSection);