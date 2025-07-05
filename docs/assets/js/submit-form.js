// Initialize EmailJS with your PUBLIC KEY (user ID)

emailjs.init('glKvCTvxb_PHtxm9v'); // ✅ Your public key here

document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect form data
  const templateParams = {
    name: this.name.value,
    email: this.email.value,
    subject: this.subject.value,
    message: this.message.value
  };

  // Send the email using your actual service and template IDs
  emailjs.send('service_5akjbzn', 'template_mitdyf8', templateParams)
    .then(function (response) {
      alert('✅ Message sent successfully!');
    }, function (error) {
      console.error('❌ FAILED...', error);
      alert('❌ Failed to send message. Please try again.');
    });
	
});
console.log('Sending params:', templateParams);


