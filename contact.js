$(document).ready(function () {
    // --- Location Detection ---
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                $('#location').text(`${lat}, ${lng}`);
            },
            function () {
                $('#location').text('Location unavailable');
            }
        );
    } else {
        $('#location').text('Geolocation not supported');
    }

    // --- Form Submission ---
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        const fullName = $('#fullName').val().trim();
        const email = $('#emailAddress').val().trim();
        const phone = $('#phoneNumber').val().trim();
        const inquiryType = $('#inquiryType').val();
        const message = $('#message').val().trim();

        if (!fullName || !email || !inquiryType || !message) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }

        // Disable button to prevent double submissions
        $('button[type="submit"]').prop('disabled', true).text('Sending...');

        // --- Option A: Send via Email (using Formspree - free tier available) ---
        sendViaEmail(fullName, email, phone, inquiryType, message);

        // --- Option B: Send via SMS (using a gateway like Twilio via a backend) ---
        sendViaSMS(fullName, email, phone, inquiryType, message);

        // --- Option C: Direct mailto fallback ---
        // mailToFallback(fullName, email, phone, inquiryType, message);
    });

    // --- Email via Formspree (Free, no backend required) ---
    function sendViaEmail(name, email, phone, type, msg) {
        $.ajax({
            url: 'https://formspree.io/f/YOUR_FORMSPREE_ID', // Replace with your Formspree form ID
            method: 'POST',
            data: {
                _subject: `New Contact: ${type} from ${name}`,
                name: name,
                email: email,
                phone: phone,
                inquiryType: type,
                message: msg
            },
            dataType: 'json',
            success: function () {
                showStatus('✅ Your message has been sent via email successfully! We will get back to you shortly.', 'success');
                $('#contactForm')[0].reset();
                $('button[type="submit"]').prop('disabled', false).text('Send Message');
            },
            error: function () {
                // Fallback to mailto if AJAX fails
                mailToFallback(name, email, phone, type, msg);
            }
        });
    }

    // --- SMS via Backend API (requires your own server) ---
    function sendViaSMS(name, email, phone, type, msg) {
        const smsText = `New Inquiry from ${name} (${email}, ${phone})\nType: ${type}\nMessage: ${msg}`;

        // If you have a backend endpoint for SMS:
        $.ajax({
            url: '/api/send-sms', // Replace with your actual backend endpoint
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                to: '+256700000000', // Your SMS-capable number
                message: smsText
            }),
            success: function () {
                console.log('SMS sent successfully');
            },
            error: function () {
                console.log('SMS sending failed (this is expected if no backend is set up)');
            }
        });
    }

    // --- Fallback: Open default email client ---
    function mailToFallback(name, email, phone, type, msg) {
        const subject = encodeURIComponent(`New Contact: ${type} from ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInquiry Type: ${type}\n\nMessage:\n${msg}`
        );
        window.location.href = `mailto:support@medicalassist.com?subject=${subject}&body=${body}`;

        showStatus('📧 Your email client has been opened. Please click send to complete.', 'info');
        $('button[type="submit"]').prop('disabled', false).text('Send Message');
    }

    // --- Status Display ---
    function showStatus(msg, type) {
        const statusDiv = $('#formStatus');
        statusDiv.show().removeClass().addClass(type).html(msg);

        // Styling
        if (type === 'success') {
            statusDiv.css({
                'background-color': '#d4edda',
                'color': '#155724',
                'border': '1px solid #c3e6cb'
            });
        } else if (type === 'error') {
            statusDiv.css({
                'background-color': '#f8d7da',
                'color': '#721c24',
                'border': '1px solid #f5c6cb'
            });
        } else {
            statusDiv.css({
                'background-color': '#d1ecf1',
                'color': '#0c5460',
                'border': '1px solid #bee5eb'
            });
        }

        // Auto-hide after 8 seconds
        setTimeout(function () {
            statusDiv.fadeOut();
        }, 8000);
    }

});
