// DOM yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Sticky navigation ve aktif bölüm vurgulama
    initStickyNavigation();
    
    // Scroll animasyonları
    initScrollAnimations();
    
    // Smooth scrolling için nav linkleri
    initSmoothScrolling();
    
    // Menü öğelerine hover efektleri
    initMenuInteractions();
});

// Sticky Navigation ve Aktif Bölüm Vurgulama
function initStickyNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.menu-section');
    
    // Scroll olayını dinle
    window.addEventListener('scroll', throttle(function() {
        let current = '';
        const scrollPosition = window.scrollY + 200; // Offset için
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                current = section.getAttribute('id');
            }
        });
        
        // Aktif nav item'ı vurgula
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    }, 100));
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const stickyNavHeight = document.querySelector('.sticky-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - stickyNavHeight - 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Aktif durumu güncelle
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Scroll Animasyonları
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Menü öğelerini sırayla animasyon ile göster
                const menuItems = entry.target.querySelectorAll('.menu-item');
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
        });
    }, observerOptions);
    
    // Menü bölümlerini gözlemle
    const menuSections = document.querySelectorAll('.menu-section');
    menuSections.forEach(section => {
        observer.observe(section);
        
        // Başlangıçta menü öğelerini gizle (animasyon için)
        const menuItems = section.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        });
    });
}

// Menü Etkileşimleri
function initMenuInteractions() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        // Hover efekti için ses efekti (opsiyonel)
        item.addEventListener('mouseenter', function() {
            // Hafif bir vurgu efekti
            this.style.transform = 'translateX(8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
        
        // Touch cihazlar için tap efekti
        item.addEventListener('touchstart', function() {
            this.classList.add('touched');
        });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touched');
            }, 200);
        });
    });
}

// Sayfa yüklenme animasyonu
window.addEventListener('load', function() {
    // Header animasyonu
    const header = document.querySelector('.header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-50px)';
    header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    setTimeout(() => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    
    // Logo animasyonu
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.transform = 'scale(0) rotate(180deg)';
        logo.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        setTimeout(() => {
            logo.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
});

// Performans için scroll throttling
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Scroll performansını iyileştir
let ticking = false;
function updateOnScroll() {
    // Scroll pozisyonuna göre header'da parallax efekti
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    const parallax = scrolled * 0.5;
    
    if (header) {
        header.style.transform = `translateY(${parallax}px)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Responsive navigation için yardımcı fonksiyonlar
function handleResize() {
    const navItems = document.querySelectorAll('.nav-item');
    const navContainer = document.querySelector('.nav-container');
    
    // Ekran genişliğine göre navigation düzenlemesi
    if (window.innerWidth < 768) {
        navContainer.classList.add('mobile');
    } else {
        navContainer.classList.remove('mobile');
    }
}

window.addEventListener('resize', throttle(handleResize, 250));
handleResize(); // Sayfa yüklendiğinde çalıştır

// Touch gesture desteği (kaydırma ile bölümler arası geçiş)
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Yukarı kaydırma - sonraki bölüm
            navigateToNextSection();
        } else {
            // Aşağı kaydırma - önceki bölüm
            navigateToPrevSection();
        }
    }
}

function navigateToNextSection() {
    const sections = document.querySelectorAll('.menu-section');
    const currentSection = getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        scrollToSection(nextSection);
    }
}

function navigateToPrevSection() {
    const sections = document.querySelectorAll('.menu-section');
    const currentSection = getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        scrollToSection(prevSection);
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('.menu-section');
    let current = sections[0];
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
        }
    });
    
    return current;
}

function scrollToSection(section) {
    const navHeight = document.querySelector('.sticky-nav').offsetHeight;
    const targetPosition = section.offsetTop - navHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Hata yakalama
window.addEventListener('error', function(e) {
    console.warn('Bir hata oluştu:', e.error);
});

// CSS sınıfları ekle
const additionalStyles = `
    .nav-item.active {
        background: #27ae60 !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
    }
    
    .menu-item.touched {
        background: rgba(46, 204, 113, 0.1) !important;
        transform: translateX(5px) scale(1.02) !important;
    }
    
    .nav-container.mobile {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-container.mobile .nav-item {
        width: 200px;
        text-align: center;
        margin: 0.2rem 0;
    }
    
    @media (max-width: 480px) {
        .nav-container.mobile .nav-item {
            width: 150px;
            font-size: 0.7rem;
            padding: 0.3rem 0.5rem;
        }
    }
`;

// Dinamik stil ekle
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
