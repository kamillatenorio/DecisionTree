(function () {
    var STORAGE_KEY = 'dt-fullscreen-enabled';
    var FONT_AWESOME_ID = 'fa-fullscreen-icons';
    var FONT_AWESOME_HREF = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    var button;
    var icon;

    function isInIframe() {
        try {
            return window.self !== window.top;
        } catch (error) {
            return true;
        }
    }

    function ensureFontAwesome() {
        if (document.getElementById(FONT_AWESOME_ID)) {
            return;
        }

        var link = document.createElement('link');
        link.id = FONT_AWESOME_ID;
        link.rel = 'stylesheet';
        link.href = FONT_AWESOME_HREF;
        document.head.appendChild(link);
    }

    function hasFullscreen() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function requestFullscreen() {
        var el = document.documentElement;
        var request = el.requestFullscreen || el.webkitRequestFullscreen;

        if (!request || hasFullscreen()) {
            return Promise.resolve();
        }

        try {
            var result = request.call(el);
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    function exitFullscreen() {
        var exit = document.exitFullscreen || document.webkitExitFullscreen;

        if (!exit || !hasFullscreen()) {
            return Promise.resolve();
        }

        try {
            var result = exit.call(document);
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    function updateButtonText() {
        if (!icon) {
            return;
        }

        icon.className = hasFullscreen() ? 'fas fa-compress' : 'fas fa-expand';
    }

    function setFullscreenPreference(enabled) {
        sessionStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    }

    function wantsFullscreen() {
        return sessionStorage.getItem(STORAGE_KEY) === '1';
    }

    function restoreFullscreenOnFirstInteraction() {
        function onFirstInteraction() {
            requestFullscreen().finally(function () {
                updateButtonText();
            });

            document.removeEventListener('pointerdown', onFirstInteraction, true);
            document.removeEventListener('keydown', onFirstInteraction, true);
        }

        document.addEventListener('pointerdown', onFirstInteraction, true);
        document.addEventListener('keydown', onFirstInteraction, true);
    }

    function createButton() {
        ensureFontAwesome();

        button = document.createElement('button');
        button.type = 'button';
        button.className = 'fullscreen-btn';
        button.title = 'Toggle Fullscreen';

        icon = document.createElement('i');
        icon.className = 'fas fa-expand';
        button.appendChild(icon);

        button.addEventListener('click', function () {
            if (hasFullscreen()) {
                setFullscreenPreference(false);
                exitFullscreen().finally(function () {
                    updateButtonText();
                });
                return;
            }

            setFullscreenPreference(true);
            requestFullscreen().finally(function () {
                updateButtonText();
            });
        });

        document.body.appendChild(button);
        updateButtonText();
    }

    window.navigateWithFullscreen = function (url) {
        if (isInIframe()) {
            window.location.href = url;
            return;
        }

        if (wantsFullscreen()) {
            requestFullscreen().finally(function () {
                window.location.href = url;
            });
            return;
        }

        window.location.href = url;
    };

    if (isInIframe()) {
        return;
    }

    document.addEventListener('fullscreenchange', updateButtonText);
    document.addEventListener('webkitfullscreenchange', updateButtonText);

    window.addEventListener('DOMContentLoaded', function () {
        createButton();

        if (hasFullscreen()) {
            setFullscreenPreference(true);
            updateButtonText();
            return;
        }

        if (!wantsFullscreen()) {
            return;
        }

        requestFullscreen().then(function () {
            updateButtonText();
        }).catch(function () {
            restoreFullscreenOnFirstInteraction();
        });
    });
})();
