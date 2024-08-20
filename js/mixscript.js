document.addEventListener('DOMContentLoaded', () => {
    const links = [
        'https://raw.githubusercontent.com/Flikify/getNode/main/v2ray.txt',
        'https://raw.githubusercontent.com/euueu/troj/nd.txt'
    ];

    const container = document.getElementById('linkContainer');

    if (!container) {
        console.error('عنصر با شناسه "linkContainer" پیدا نشد');
        return;
    }

    links.forEach(link => {
        if (link.trim()) {
            const linkParts = link.split('/');
            const linkName = linkParts[3];
            const githubUser = linkParts[3];
            const repoName = linkParts[4];

            const linkBox = document.createElement('div');
            linkBox.className = 'link-box';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'link-name';
            nameSpan.textContent = linkName;

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'کپی لینک ساب';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(link)
                    .then(() => alert(`${linkName} کپی شد!`))
                    .catch(err => console.error('خطا در کپی کردن لینک:', err));
            };

            const githubLogo = document.createElement('img');
            githubLogo.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
            githubLogo.className = 'github-logo';
            githubLogo.alt = 'GitHub';
            githubLogo.onclick = () => {
                window.open(`https://github.com/${githubUser}`, '_blank');
            };

            const updateSpan = document.createElement('span');
            updateSpan.className = 'last-update';
            updateSpan.textContent = 'در حال دریافت...';

            fetch(`https://api.github.com/repos/${githubUser}/${repoName}/commits/main`)
                .then(response => response.json())
                .then(data => {
                    const lastUpdate = new Date(data.commit.author.date);
                    const now = new Date();
                    const timeDifference = Math.abs(now - lastUpdate);
                    const seconds = Math.floor(timeDifference / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    const months = Math.floor(days / 30);
                    const years = Math.floor(months / 12);

                    let formattedTime;
                    if (years > 0) {
                        formattedTime = `${years} سال پیش`;
                    } else if (months > 0) {
                        formattedTime = `${months} ماه پیش`;
                    } else if (days > 0) {
                        formattedTime = `${days} روز پیش`;
                    } else if (hours > 0) {
                        formattedTime = `${hours} ساعت پیش`;
                    } else if (minutes > 0) {
                        formattedTime = `${minutes} دقیقه پیش`;
                    } else {
                        formattedTime = `${seconds} ثانیه پیش`;
                    }

                    updateSpan.textContent = `آخرین آپدیت: ${formattedTime}`;
                })
                .catch(error => {
                    console.error('خطا در دریافت اطلاعات:', error);
                    updateSpan.textContent = 'خطا در دریافت اطلاعات';
                });

            linkBox.appendChild(nameSpan);
            linkBox.appendChild(copyButton);
            linkBox.appendChild(githubLogo);
            linkBox.appendChild(updateSpan);
            container.appendChild(linkBox);
        }
    });
});
