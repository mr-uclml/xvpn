document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const helpIcon = document.createElement('img');
    helpIcon.src = 'path/to/question-mark-icon.png'; // آدرس آیکون علامت سوال
    helpIcon.alt = 'Help';
    helpIcon.className = 'help-icon';
    helpIcon.id = 'help-icon';
    document.body.appendChild(helpIcon);

    const splashCloseBtn = document.createElement('button');
    splashCloseBtn.id = 'splash-close-btn';
    splashCloseBtn.textContent = 'اوکی';

    const splashContent = document.createElement('div');
    splashContent.className = 'splash-content';
    splashContent.innerHTML = '<p>سلام</p>';
    splashContent.appendChild(splashCloseBtn);
    splashScreen.appendChild(splashContent);

    // نمایش اسپلاش اسکرین زمانی که روی آیکون علامت سوال کلیک می‌شود
    helpIcon.addEventListener('click', () => {
        splashScreen.style.display = 'flex';
    });

    // پنهان کردن اسپلاش اسکرین زمانی که دکمه اوکی کلیک می‌شود
    splashCloseBtn.addEventListener('click', () => {
        splashScreen.style.display = 'none';
    });

    const linkContainer = document.getElementById('link-container');
    let openQRCode = null; // متغیری برای نگهداری QR کد باز
    let vipUsers = []; // آرایه‌ای برای ذخیره کاربران VIP

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

    const fetchVipUsers = async () => {
        try {
            const response = await fetch('/vip.txt');
            const text = await response.text();
            vipUsers = text.trim().split('\n'); // ذخیره کاربران VIP
        } catch (error) {
            console.error('Error fetching VIP users:', error);
        }
    };

    const fetchData = async () => {
        try {
            await fetchVipUsers(); // ابتدا کاربران VIP را بگیر

            const response = await fetch('/data.txt');
            const text = await response.text();
            const lines = text.trim().split('\n');

            lines.forEach(line => {
                const [user, link, date, code] = line.split(',');
                const box = document.createElement('div');
                box.className = 'link-box';

                // بررسی اگر کاربر VIP باشد
                if (vipUsers.includes(user)) {
                    box.classList.add('vip-box');
                }

                const linkName = document.createElement('div');
                linkName.className = 'link-name';
                linkName.textContent = user;

                const lastUpdate = document.createElement('div');
                lastUpdate.className = 'last-update';
                lastUpdate.textContent = convertToReadableTime(new Date(date));

                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.textContent = 'کپی';

                const qrCode = document.createElement('img');
                qrCode.className = 'qr-code';
                qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;

                qrCode.addEventListener('click', () => {
                    if (openQRCode && openQRCode !== qrCode) {
                        openQRCode.classList.remove('qr-code-expanded');
                    }

                    qrCode.classList.toggle('qr-code-expanded');
                    openQRCode = qrCode.classList.contains('qr-code-expanded') ? qrCode : null;
                });

                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(link)
                        .then(() => alert('لینک کپی شد!'))
                        .catch(() => alert('مشکلی در کپی کردن لینک وجود دارد.'));
                });

                box.appendChild(linkName);
                box.appendChild(qrCode);
                box.appendChild(copyButton);
                box.appendChild(lastUpdate);
                linkContainer.appendChild(box);
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
});
