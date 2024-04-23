let email = '';

Swal.fire({
    title: "Identify yourself",
    input: "text",
    text: "Register your email",
    inputValidator: (value) => {
        return !value && "You need to register an email to continue";
    },
    allowOutsideClick: false
}).then(result => {
    email = result.value;
});

document.querySelector('.input_send').addEventListener('click', async () => {
    const message = document.querySelector('.input_chat').value.trim();
    if (!message || !email) return;

    try {
        // Guardar el mensaje en algún lugar o enviarlo al servidor
        const response = await fetch('/contact/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message })
        });

        if (response.ok) {
            console.log('Message sent successfully');
            // Actualizar la vista si es necesario
            updateChatView(email, message);
        } else {
            console.error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
    };
    // Limpiar el campo de mensaje después de enviarlo
    document.querySelector('.input_chat').value = '';
});

// Función para actualizar la vista del chat con el nuevo mensaje
function updateChatView(email, message) {
    const output = document.getElementById('output');
    const newMessage = document.createElement('div');
    newMessage.textContent = email + ": " + message;
    output.appendChild(newMessage);
}



