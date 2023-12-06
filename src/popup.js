'use strict';

import './popup.css';

(function () {
    const changeElementBtn = document.getElementById('changeElement');
    changeElementBtn.addEventListener('click', () => {
        console.log('click');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            console.log(tabs);
            chrome.tabs.sendMessage(
                tab.id,
                {
                    type: 'CHANGE',
                },
                (response) => {
                    console.log(
                        'Current count value passed to contentScript file'
                    );
                }
            );
        });
    });
})();
