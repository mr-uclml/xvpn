document.addEventListener('DOMContentLoaded', () => {
    // آرایه‌ای از لینک‌ها
    const links = [
        'https://raw.githubusercontent.com/Flikify/getNode/main/v2ray.txt',
        'https://raw.githubusercontent.com/euueu/troj/nd.txt'
        // اضافه کردن لینک‌های بیشتر اینجا
    ];

    // انتخاب عنصر container
    const container = document.getElementById('linkContainer');

    if (!container) {
        console.error('عنصر با شناسه "linkContainer" پیدا نشد');
        return;
    }

    // پردازش هر لینک و ایجاد باکس لینک
    links.forEach(link => {
        if (link.trim()) {
            const linkParts = link.split('/');
            const linkName = linkParts[3]; // استخراج نام لینک از URL
            const githubUser = linkParts[3]; // استخراج یوزرنیم از URL

            // ایجاد باکس لینک
            const linkBox = document.createElement('div');
            linkBox.className = 'link-box';

            // ایجاد نام لینک
            const nameSpan = document.createElement('span');
            nameSpan.className = 'link-name';
            nameSpan.textContent = linkName;

            // ایجاد دکمه کپی
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'کپی لینک ساب کانفینگ ها';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(link)
                    .then(() => alert(`${linkName} کپی شد!`))
                    .catch(err => console.error('خطا در کپی کردن لینک:', err));
            };

            // ایجاد لوگوی گیت‌هاب
            const githubLogo = document.createElement('img');
            githubLogo.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
            githubLogo.className = 'github-logo';
            githubLogo.alt = 'GitHub';
            githubLogo.onclick = () => {
                window.open(`https://github.com/${githubUser}`, '_blank');
            };

            // اضافه کردن نام لینک و دکمه کپی به باکس لینک
            linkBox.appendChild(nameSpan);
            linkBox.appendChild(copyButton);
            linkBox.appendChild(githubLogo);
            container.appendChild(linkBox);
        }
    });
});
