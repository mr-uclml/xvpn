function extractServerUrl(url) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const server = urlParams.get('server');
    if (server) {
        const parts = server.split('.');
        return parts.join('.').length > 14 ? parts.join('.').slice(0, 14) + '...' : parts.join('.');
    }
    return url;
}

function generateTelegramLink(proxy) {
    return `tg://proxy?server=${proxy}`;
}

fetch('https://raw.githubusercontent.com/mahsanet/MahsaFreeConfig/main/telegram/index.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const container = document.getElementById('proxy-container');
        let currentlyOpenBox = null;
        
        for (const channel in data) {
            const cleanChannel = channel.replace('@', '');
            const channelBox = document.createElement('div');
            channelBox.className = 'channel-box';
            
            const telegramIcon = document.createElement('img');
            telegramIcon.className = 'telegram-icon';
            telegramIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg';
            telegramIcon.onclick = () => {
                window.open(`https://t.me/${cleanChannel}`, '_blank');
            };

            channelBox.appendChild(telegramIcon);

            const channelTitle = document.createElement('div');
            channelTitle.textContent = channel;
            channelBox.appendChild(channelTitle);

            const proxyList = document.createElement('div');
            proxyList.className = 'proxy-list';

            data[channel].forEach(proxy => {
                const proxyItem = document.createElement('div');
                proxyItem.className = 'proxy-item';

                const proxyIp = document.createElement('div');
                proxyIp.className = 'proxy-ip';
                proxyIp.textContent = extractServerUrl(proxy);

                const connectButton = document.createElement('button');
                connectButton.className = 'connect-button';
                connectButton.textContent = 'Connect';
                connectButton.onclick = () => {
                    const telegramLink = generateTelegramLink(proxy);
                    window.location.href = telegramLink;
                };

                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.textContent = 'Copy';
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(proxy).then(() => {
                        alert('Proxy copied to clipboard!');
                    });
                };

                proxyItem.appendChild(proxyIp);
                proxyItem.appendChild(connectButton);
                proxyItem.appendChild(copyButton);
                proxyList.appendChild(proxyItem);
            });

            channelBox.appendChild(proxyList);
            container.appendChild(channelBox);

            channelBox.addEventListener('click', () => {
                if (currentlyOpenBox && currentlyOpenBox !== channelBox) {
                    currentlyOpenBox.querySelector('.proxy-list').style.display = 'none';
                }
                const isVisible = proxyList.style.display === 'block';
                proxyList.style.display = isVisible ? 'none' : 'block';
                currentlyOpenBox = isVisible ? null : channelBox;
            });
        }
    })
    .catch(error => console.error('Error fetching the proxy list:', error));
