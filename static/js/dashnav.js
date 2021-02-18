/*
 * Set active nav link cosmetically
*/
(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', () => {
        const _anchors = document.querySelectorAll('#dashboard-sidebar a');

        _anchors.forEach((element) => {
            if(element.getAttribute('href') == window.location.pathname) {
                element.classList.add('active');
            }
        });
    });
})();