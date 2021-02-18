// Redirect straight to admin dashboard for demonstrational purposes
(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.querySelector('#form-inner button');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location = '/admin/dashboard';
        });
    })
})();