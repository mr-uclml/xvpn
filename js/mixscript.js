document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/itsyebekhe/HiN-VPN/main/subscription/normal/mix',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt'
    ];

    const linkContainer = document.getElementById('link-container');
    const splashScreen = document.getElementById('splash-screen');

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

            // Sort results based on the `timeDifference` or another timestamp if available
            results.sort((a, b) => {
                // You might need to parse `timeDifference` if it's a timestamp
                // Here, we're assuming `timeDifference` is a human-readable string
                // Adjust sorting logic according to your data structure
                return new Date(b.timeDifference) - new Date(a.timeDifference);
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
