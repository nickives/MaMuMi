/*
 * Handle CRUD operations for Journeys within admin dashboard
*/
(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', () => {
    });

    async function _getJourneys() {
        return await (await fetch('/journeys')).json();
    }

    async function _getJourney(id) {
        return await (await fetch(`/journeys/${id}`)).json();
    }

    async function _sendJourney(journeyObj) {
        fetch('/journeys', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journeyObj)
        }).then((res) => {
            alert('Journey created!');
        }).catch((error) => {
           alert('Journey creation failed!');
        })
    }

    async function _updateJourney(journeyID, journeyObj) {
        fetch(`/journeys/${journeyID}/update`, {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(journeyObj)
        }).then((res) => {
            alert('Journey successfully updated!');
        }).catch((error) => {
            alert('Journey update failed!');
        })
    }

    async function _deleteJourney(journeyID) {
        fetch(`/journeys/${journeyID}/delete`, {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: {}
        }).then((res) => {
            alert('Journey deleted!');
        }).catch((error) => {
            alert('Journey deletion failed!');
        })
    }
})();