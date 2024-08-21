document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/mix',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list_raw.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt'
    ];

    const linkContainer = document.getElementById('link-container');
    const splashScreen = document.getElementById('splash-screen');

    const parseTimeDifference = (timeDifference) => {
        const parts = timeDifference.split(' ');
        const value = parseInt(parts[0], 10);
        const unit = parts[1];

        switch (unit) {
            case 'ثانیه':
                return value;
            case 'دقیقه':
                return value * 60;
            case 'ساعت':
                return value * 3600;
            case 'روز':
                return value * 86400;
            case 'هفته':
                return value * 604800;
            case 'ماه':
                return value * 2592000;
            case 'سال':
                return value * 31536000;
            default:
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

            results.sort((a, b) => a.parsedTime - b.parsedTime);

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
