document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/eliv2ray',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/mix',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt'
    ];

    const linkContainer = document.getElementById('link-container');
    const splashScreen = document.getElementById('splash-screen');

    const parseTimeDifference = (timeDifference) => {
        if (timeDifference.includes('ثانیه')) {
            return parseInt(timeDifference) * 1;
        } else if (timeDifference.includes('دقیقه')) {
            return parseInt(timeDifference) * 60;
        } else if (timeDifference.includes('ساعت')) {
            return parseInt(timeDifference) * 3600;
        } else if (timeDifference.includes('روز')) {
            return parseInt(timeDifference) * 86400;
        } else if (timeDifference.includes('هفته')) {
            return parseInt(timeDifference) * 604800;
        } else if (timeDifference.includes('ماه')) {
            return parseInt(timeDifference) * 2592000;
        } else if (timeDifference.includes('سال')) {
            return parseInt(timeDifference) * 31536000;
        } else {
            return Infinity;
        }
    };

    const fetchData = async () => {
        try {
            const results = await Promise.all(links.map(url => 
                fetch(`https://v2rayn.pythonanywhere.com/file-update?file_url=${url}`)
                .then(response => response.json())
                .then(data => ({
                    url,
                    timeDifference: data.time_difference || 'اطلاعات موجود نیست',
                    parsedTime: parseTimeDifference(data.time_difference || 'اطلاعات موجود نیست')
                }))
            ));

            results.sort((a, b) => b.parsedTime - a.parsedTime);

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
