(function() {
    // Configuration
    const adblocker = true;
    const removePopup = true;
    const debug = true;

    // Domains and JSON paths to target
    const domainsToRemove = ['*.youtube-nocookie.com/*'];
    const jsonPathsToRemove = [
        'playerResponse.adPlacements',
        'playerResponse.playerAds',
        'adPlacements',
        'playerAds',
        'playerConfig',
        'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
    ];

    // Log if debugging is enabled
    const log = (message) => {
        if (debug) {
            console.log(`Remove Adblock Thing: ${message}`);
        }
    }

    // Initialize the MutationObserver
    const observer = new MutationObserver(removeAdsAndPopups);
    const observerConfig = {
        childList: true,
        subtree: true
    };

    // Check the current domain
    const isCurrentDomainToRemove = domainsToRemove.some(domain => 
        new RegExp(domain.replace('*', '.*')).test(window.location.hostname)
    );

    // Start the adblocker and popup remover if needed
    if (adblocker) {
        removeAdsAndPopups();
        observer.observe(document.body, observerConfig);
    }
    if (removePopup && isCurrentDomainToRemove) {
        removeJsonPaths();
    }

    function removeAdsAndPopups() {
        const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
        const video = document.querySelector('video');
        const ad = document.querySelector('.ad-showing');

        if (ad && video) {
            video.playbackRate = 10;
            video.volume = 0;
            skipBtn?.click();
        }

        [
            'ytd-action-companion-ad-renderer',
            'div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint',
            'div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer',
            'div#main-container.style-scope.ytd-promoted-video-renderer',
            'ytd-in-feed-ad-layout-renderer',
            '.ytd-video-masthead-ad-v3-renderer',
            "div#player-ads.style-scope.ytd-watch-flexy",
            "div#panels.style-scope.ytd-watch-flexy"
        ].forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });
    }

    function removeJsonPaths() {
        jsonPathsToRemove.forEach(jsonPath => {
            const pathParts = jsonPath.split('.');
            let obj = window;
            for (let part of pathParts) {
                if (obj.hasOwnProperty(part)) {
                    if (part === pathParts[pathParts.length - 1]) {
                        delete obj[part];
                    } else {
                        obj = obj[part];
                    }
                } else {
                    break;
                }
            }
        });
    }

    // Handle popups
    function handlePopups() {
        const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
        if (popup) {
            log('Popup detected, removing...');
            const popupButton = document.getElementById("dismiss-button");
            popupButton?.click();
            popup.remove();
        }
    }

    // If the popup remover is enabled, run it every second
    if (removePopup) {
        setInterval(handlePopups, 1000);
    }

})();
