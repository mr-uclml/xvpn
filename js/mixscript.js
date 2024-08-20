document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg1.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg2.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg3.txt',
        'https://raw.githubusercontent.com/Q3dlaXpoaQ/V2rayN_Clash_Node_Getter/main/APIs/cg4.txt'
    ];

    const linkContainer = document.getElementById('link-container');

    links.forEach(url => {
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('.')[0]; // Extract filename without extension
        const userName = urlParts[3]; // Extract username from URL
        const repoName = urlParts[4]; // Extract repository name
        const filePath = urlParts.slice(5).join('/'); // Extract file path
        const displayName = `${userName}-${fileName}`;

        fetch(`https://v2rayng.pythonanywhere.com/api/fetch?url=https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`)
            .then(response => response.json())
            .then(data => {
                const lines = (data.content || '').split('\n').filter(line => line.trim() !== '');
                lines.forEach(link => {
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
                    lastUpdateElement.textContent = `آخرین بروزرسانی: ${data.last_update || 'در حال بررسی...'}`;

                    linkBox.appendChild(nameElement);
                    linkBox.appendChild(copyButton);
                    linkBox.appendChild(githubLogo);
                    linkBox.appendChild(lastUpdateElement);

                    linkContainer.appendChild(linkBox);
                });
            })
            .catch(error => {
                console.error('Error fetching links:', error);
            });
    });
});
