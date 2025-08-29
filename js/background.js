chrome.browserAction.onClicked.addListener((tabs) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if(!tabs[0]||tabs[0].url.indexOf('pinterest.')===-1){
            console.log('Not pinterest page');
            return;
        }
        console.log(tabs[0]);
        chrome.tabs.sendMessage(tabs[0].id, { action: "open_dialog_box" }, function (response) { });
    });
})
