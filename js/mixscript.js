document.addEventListener('DOMContentLoaded', () => {
    const linkContainer = document.getElementById('link-container');
    const splashScreen = document.getElementById('splash-screen');
    const helpButton = document.getElementById('help-button');
    const okButton = document.getElementById('ok-button');
    let openQRCode = null; // Variable to keep track of currently open QR code
    let vipUsers = []; // Array to store VIP users

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

    const fetchVipUsers = async () => {
        try {
            const response = await fetch('/vip.txt');
            const text = await response.text();
            vipUsers = text.trim().split('\n'); // Store VIP users
        } catch (error) {
            console.error('Error fetching VIP users:', error);
        }
    };

    const fetchData = async () => {
        await fetchVipUsers(); // Fetch VIP users first

        try {
            const response = await fetch('/source.txt');
            const text = await response.text();
            const links = text.trim().split('\n');

            const results = await Promise.all(links.map(url => 
                fetch(`https://corsproxy.io/?https://api.codetabs.com/v1/proxy/?quest=https://v2rayn.pythonanywhere.com/file-update?file_url=${url}`)
                .then(response => response.json())
                .then(data => {
                    const lastUpdate = new Date(data.time_difference);
                    return {
                        url,
                        timeDifference: convertToReadableTime(lastUpdate),
                        lastUpdate
                    };
                })
            ));

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

                // Add VIP class if userName is in vipUsers
                if (vipUsers.includes(userName)) {
                    linkBox.classList.add('vip-box');
                }

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

                const qrCode = document.createElement('img');
                qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
                qrCode.className = 'qr-code';
                
                qrCode.onclick = () => {
                    if (openQRCode && openQRCode !== qrCode) {
                        openQRCode.classList.remove('qr-code-expanded');
                    }
                    qrCode.classList.toggle('qr-code-expanded');
                    openQRCode = qrCode.classList.contains('qr-code-expanded') ? qrCode : null;
                };

                const lastUpdateElement = document.createElement('div');
                lastUpdateElement.className = 'last-update';
                lastUpdateElement.textContent = `بروزرسانی: ${timeDifference}`;

                linkBox.appendChild(nameElement);
                linkBox.appendChild(copyButton);
                linkBox.appendChild(githubLogo);
                linkBox.appendChild(qrCode);
                linkBox.appendChild(lastUpdateElement);

                linkContainer.appendChild(linkBox);
            });

        } catch (error) {
            console.error('Error fetching last update times:', error);
        } finally {
            setTimeout(() => {
                splashScreen.classList.add('hidden');
            }, 3000);
        }
    };

    // Function to show the splash screen
    const showSplashScreen = () => {
        splashScreen.style.display = 'flex';
    };

    // Function to hide the splash screen
    const hideSplashScreen = () => {
        splashScreen.style.display = 'none';
    };

    // Event listener for help button
    helpButton.addEventListener('click', showSplashScreen);

    // Event listener for OK button on the splash screen
    okButton.addEventListener('click', hideSplashScreen);

    fetchData();
});
