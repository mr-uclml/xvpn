document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list_raw.txt',
        'https://raw.githubusercontent.com/cry0ice/genode/main/public/all.txt',
        'https://raw.githubusercontent.com/LalatinaHub/Mineral/master/result/nodes',
        'https://raw.githubusercontent.com/peasoft/NoMoreWalls/master/list.txt',
        'https://raw.githubusercontent.com/mfuu/v2ray/master/v2ray',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/mix',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list_raw.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt',
        'https://raw.githubusercontent.com/firefoxmmx2/v2rayshare_subcription/main/subscription/vray_sub.txt',
        'https://raw.githubusercontent.com/Vauth/node/main/Master',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/proxy_kafee',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/vmessorg',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/flyv2ray',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/-1001698381150',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/v2ray1_ng',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/vlessconfig',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/dailyv2ry',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/outline_vpn',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/servernett',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/directvpn',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/arv2ray',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/freakconfig',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/v2rayng_vpnrog',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/proxy_mtm',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/Legendaryking_Servers',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/isvvpn',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/outlinev2rayng',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/nim_vpn_ir',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/privatevpns',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/source/normal/mehrosaboran'
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
            const results = await Promise.all(links.map(url => 
                fetch(https://corsproxy.io/?https://v2rayn.pythonanywhere.com/file-update?file_url=${url})
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
                const displayName = ${userName}-${fileName};
                const repoUrl = https://github.com/${userName}/${repoName};

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
                lastUpdateElement.textContent = آخرین بروزرسانی: ${timeDifference};

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
