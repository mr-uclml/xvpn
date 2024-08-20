document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/Flikify/getNode/main/v2ray.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg0.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt'
    ];

    const linkContainer = document.getElementById('link-container');

    links.forEach(url => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const lines = data.split('\n').filter(line => line.trim() !== '');
                lines.forEach(link => {
                    const urlParts = new URL(link);
                    const pathParts = urlParts.pathname.split('/');
                    const fileName = pathParts[pathParts.length - 1].replace('.txt', ''); // Extract file name without extension
                    const userName = pathParts[2]; // Extract username

                    // Construct the display name
                    const displayName = `${userName}-${fileName}`;

                    const linkBox = document.createElement('div');
                    linkBox.className = 'link-box';

                    const nameElement = document.createElement('div');
                    nameElement.className = 'link-name';
                    nameElement.textContent = displayName;

                    const copyButton = document.createElement('button');
                    copyButton.className = 'copy-button';
                    copyButton.textContent = 'کپی لینک ساب';
                    copyButton.onclick = () => {
                        navigator.clipboard.writeText(link);
                        alert('لینک کپی شد!');
                    };

                    const githubLogo = document.createElement('img');
                    githubLogo.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                    githubLogo.className = 'github-logo';
                    githubLogo.onclick = () => {
                        window.open(`https://github.com/${userName}`, '_blank');
                    };

                    const lastUpdateElement = document.createElement('div');
                    lastUpdateElement.className = 'last-update';
                    lastUpdateElement.textContent = 'آخرین بروزرسانی: در حال بررسی...'; // Placeholder text

                    linkBox.appendChild(nameElement);
                    linkBox.appendChild(copyButton);
                    linkBox.appendChild(githubLogo);
                    linkBox.appendChild(lastUpdateElement);

                    linkContainer.appendChild(linkBox);

                    // Fetch the last update time
                    fetch(link)
                        .then(response => response.headers.get('Last-Modified'))
                        .then(lastModified => {
                            const lastUpdateDate = new Date(lastModified);
                            const now = new Date();
                            const timeDiff = now - lastUpdateDate;
                            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor(timeDiff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                            const minutes = Math.floor(timeDiff % (1000 * 60 * 60) / (1000 * 60));

                            let updateText = '';
                            if (days > 0) {
                                updateText = `${days} روز پیش`;
                            } else if (hours > 0) {
                                updateText = `${hours} ساعت پیش`;
                            } else if (minutes > 0) {
                                updateText = `${minutes} دقیقه پیش`;
                            } else {
                                updateText = 'اکنون';
                            }

                            lastUpdateElement.textContent = `آخرین بروزرسانی: ${updateText}`;
                        })
                        .catch(error => {
                            console.error('Error fetching last update time:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching links:', error);
            });
    });
});
