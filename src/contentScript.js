'use strict';

const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
    `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'COUNT') {
        console.log(`Current count is ${request.payload.count}`);
    }

    if (request.type === 'CHANGE') {
        console.log(`Change Event On`);
        if (document.getElementsByClassName('dialog-extension')[0]) {
            return;
        }
        const bigheroArray = Array.from(
            document.getElementsByClassName('smallhero')
        );
        const filterData = bigheroArray.map((item) => {
            const numRegex = /\d+/g;
            const imgEl = item.querySelectorAll('img')[0];
            const nameEl = item.querySelectorAll('.dark-grey-text strong')[0];
            const addressAndHeightEl = item.querySelectorAll('.f13 strong');
            const isFull = !!item.querySelectorAll('.danger-bg-text')[0];
            const address = addressAndHeightEl[0].innerText.trim().split('・');
            const state = address[0];
            const town = address[1];
            const height =
                addressAndHeightEl[1].innerText.trim().match(numRegex)[0] ?? 0;
            const id = imgEl.alt;
            const imgUrl = imgEl.src;
            const name = nameEl.innerText;
            return { id, name, imgUrl, state, town, height, isFull };
        });
        if (filterData.length === 0) return;

        const modal = document.createElement('div');
        modal.classList.add('dialog-extension');
        const floatBtn = document.createElement('button');
        floatBtn.innerHTML = '<p style="margin:auto;">開關</p>';
        floatBtn.style.cssText =
            'background-color: #134B43;color:white;position: fixed;bottom: 3rem;right: 3rem;border-radius: 50%;width: 100px;height: 100px;z-index: 99999999;';
        modal.style.cssText =
            'z-index:9999999; width: 100%; height:100%; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);display:flex; flex-direction: row; flex-wrap: wrap; overflow:scroll; gap:20px;';

        document.body.appendChild(modal);
        document.body.appendChild(floatBtn);

        const isClose = false;
        floatBtn.addEventListener('click', () => {
            modal.style.display === 'flex'
                ? (modal.style.display = 'none')
                : (modal.style.display = 'flex');
        });

        filterData.forEach((item) => {
            if (!item.isFull) {
                const newCard = document.createElement('a');
                newCard.href = `https://m.icamping.app/store/${item.id}`;
                newCard.target = '_blank';
                newCard.style.cssText =
                    'display:flex; flex:1; padding:0.5rem;border: 1px solid #a0a0a0;border-radius: 10px;';
                newCard.innerHTML = `
                <div style="display:flex; flex-direction: row;">
                    <img src="${item.imgUrl}" style="width:300px; height:200px;"/>
                    <div style="white-space: nowrap; padding:3rem; display:flex; flex-direction: column;justify-content: center;">
                        <div>
                            ${item.name}
                        </div>
                        <div>
                            ${item.state}・${item.town}
                        </div>
                        <div>
                            海拔 ${item.height}
                        </div>
                    </div>
                </div>
                `;

                modal.appendChild(newCard);
            }
        });
    }

    // Send an empty response
    // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
    sendResponse({});
    return true;
});
