document.addEventListener('DOMContentLoaded', () => {
    const links = [
        
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/mix',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt'
    ];

    const linkContainer = document.getElementById('link-container');
    const splashScreen = document.getElementById('splash-screen');

    const timeStringToDate = (timeString) => {
        const now = new Date();
        const timeUnits = {
            'دقیقه': 60000,
            'ساعت': 3600000,
            'روز': 86400000,
            'ماه': 2592000000,
            'سال': 31536000000
        };
        
        for (const [unit, ms] of Object.entries(timeUnits)) {
            const regex = new RegExp(`(\\d+) ${unit} پیش`);
            const match = timeString.match(regex);
            if (match) {
                const timeAmount = parseInt(match[1], 10);
                return new Date(now.getTime() - (timeAmount * ms));
            }
        }
        
        return new Date(0); // Fallback to a very old date if no match
    };

    const fetchData = async () => {
        try {
            const results = await Promise.all(links.map(url => 
                fetch(`https://v2rayn.pythonanywhere.com/file-update?file_url=${url}`)
                .then(response => response.json())
                .then(data => ({
                    url,
                    timeDifference: data.time_difference || 'اطلاعات موجود نیست'
                }))
            ));

            // Sort results based on the `timeDifference` converted to date
            results.sort((a, b) => {
                const dateA = timeStringToDate(a.timeDifference);
                const dateB = timeStringToDate(b.timeDifference);
                return dateB - dateA; // Newest first
            });

            // Clear existing items in the container
            linkContainer.innerHTML = '';

            // Append sorted items to the container
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
            // Handle error as needed
        } finally {
            // Hide splash screen after data is processed
            setTimeout(() => {
                splashScreen.classList.add('hidden');
            }, 10000); // Show splash screen for 10 seconds
        }
    };

    fetchData();
});
