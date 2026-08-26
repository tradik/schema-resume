/*
 * Sidebar scrollspy: mark the table-of-contents entry for the section
 * currently in view.
 *
 * The previous version recomputed every section's offsetTop on every scroll
 * event — a forced layout per frame while scrolling. IntersectionObserver does
 * the same job off the main thread.
 */
(function () {
    'use strict';

    var links = Array.prototype.slice.call(document.querySelectorAll('.sidebar nav a[href^="#"]'));
    if (links.length === 0 || !('IntersectionObserver' in window)) {
        return;
    }

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
        var section = document.getElementById(link.getAttribute('href').slice(1));
        if (section) {
            byId[section.id] = link;
            sections.push(section);
        }
    });

    var visible = new Set();

    function highlight() {
        var current = null;
        // Whichever visible section comes first in document order wins, so the
        // highlight moves down the list rather than jumping around.
        sections.some(function (section) {
            if (visible.has(section.id)) {
                current = section.id;
                return true;
            }
            return false;
        });

        links.forEach(function (link) {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        if (current && byId[current]) {
            byId[current].classList.add('active');
            byId[current].setAttribute('aria-current', 'true');
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                visible.add(entry.target.id);
            } else {
                visible.delete(entry.target.id);
            }
        });
        highlight();
    }, {
        // Treat "in view" as the band just below the sticky header, so a
        // heading counts as current once it reaches reading position.
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
    });

    sections.forEach(function (section) {
        observer.observe(section);
    });
})();
