document.addEventListener('DOMContentLoaded', () => {
    const reqbinUrl = 'https://apius.reqbin.com/api/v1/requests'; // لینک API ReqBin

    const links = [
        'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list_raw.txt',
        
    ];

    const linkContainer = document.getElementById('link-container');
    const splashScreen = document.getElementById('splash-screen');

    const convertToReadableTime = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

        if (interval >= 1) return interval + " سال پیش";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " ماه پیش";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " روز پیش";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " ساعت پیش";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " دقیقه پیش";
        return Math.floor(seconds) + " ثانیه پیش";
    };

    const fetchData = async () => {
        try {
            const requests = links.map(url => {
                const payload = {
                    "id": "0",
                    "name": "",
                    "errors": "",
                    "json": JSON.stringify({
                        "method": "GET",
                        "url": `https://v2rayn.pythonanywhere.com/file-update?file_url=${url}`,
                        "apiNode": "US",
                        "contentType": "",
                        "headers": "Accept: application/json",
                        "errors": "",
                        "curlCmd": "",
                        "codeCmd": "",
                        "jsonCmd": "",
                        "xmlCmd": "",
                        "lang": "",
                        "auth": {
                            "auth": "noAuth",
                            "bearerToken": "",
                            "basicUsername": "",
                            "basicPassword": "",
                            "customHeader": "",
                            "encrypted": ""
                        },
                        "compare": false,
                        "idnUrl": `https://v2rayn.pythonanywhere.com/file-update?file_url=${url}`
                    }),
                    "sessionId": "",
                    "deviceId": ""
                };

                return fetch(reqbinUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    const content = JSON.parse(data.Content);
                    const lastUpdate = new Date(content.time_difference);
                    return {
                        url,
                        timeDifference: convertToReadableTime(lastUpdate),
                        lastUpdate
                    };
                });
            });

            const results = await Promise.all(requests);

            results.sort((a, b) => b.lastUpdate - a.lastUpdate);

            linkContainer.innerHTML = '';

            results.forEach(({ url, timeDifference }) => {
                const urlParts = url.split('/');
                const fileName = urlParts[urlParts.length - 1].split('.')[0];
                const userName = urlParts[3];
                const repoName = urlParts[4];
                const displayName = `${userName}-${fileName}`;
                const repoUrl = `https://github.com/${userName}/${repoName}`;

                const linkBox = document.createElement('div');
                linkBox.className = 'link-box';

                const nameElement = document.createElement('div');
                nameElement.className = 'link-name';
                nameElement.textContent = displayName;

                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.textContent = 'لینک ساب';
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(url);
                    alert('لینک کپی شد!');
                };

                const githubLogo = document.createElement('img');
                githubLogo.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                githubLogo.className = 'github-logo';
                githubLogo.onclick = () => {
                    window.open(repoUrl, '_blank');
                };

                const lastUpdateElement = document.createElement('div');
                lastUpdateElement.className = 'last-update';
                lastUpdateElement.textContent = `آخرین بروزرسانی: ${timeDifference}`;

                linkBox.appendChild(nameElement);
                linkBox.appendChild(copyButton);
                linkBox.appendChild(githubLogo);
                linkBox.appendChild(lastUpdateElement);

                linkContainer.appendChild(linkBox);
            });
        } catch (error) {
            console.error('Error fetching last update times:', error);
        } finally {
            setTimeout(() => {
                splashScreen.classList.add('hidden');
            }, 10000);
        }
    };

    fetchData();
});
