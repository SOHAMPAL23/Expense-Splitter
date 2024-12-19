let participants = [];

function addParticipant() {
    const name = document.getElementById('participantName').value.trim();
    if (name) {
        participants.push({ name: name, expense: 0 });
        console.log('Participant added:', name);
    } else {
        showError('Participant name cannot be empty.');
    }
}

function addExpense() {
    const name = document.getElementById('participantName').value.trim();
    const expense = parseFloat(document.getElementById('participantExpense').value);
    
    if (!name || isNaN(expense) || expense < 0) {
        showError('Invalid name or expense. Please enter valid details.');
        return;
    }

    const participant = participants.find(p => p.name === name);
    if (participant) {
        participant.expense += expense;
        document.getElementById('participantExpense').value = ''; 
        console.log('Expense added:', { name: name, expense: expense });
    } else {
        showError('Participant not found. Please add the participant first.');
    }
}

function calculateBalances() {
    const totalExpense = participants.reduce((sum, p) => sum + p.expense, 0);
    const perPerson = totalExpense / participants.length;
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    participants.forEach(participant => {
        const balance = participant.expense - perPerson;
        if (balance > 0) {
            resultDiv.innerHTML += `${participant.name} is to receive Rs. ${balance.toFixed(2)}<br>`;
        } else if (balance < 0) {
            resultDiv.innerHTML += `${participant.name} owes Rs. ${Math.abs(balance).toFixed(2)}<br>`;
        } else {
            resultDiv.innerHTML += `${participant.name} is settled.<br>`;
        }
    });
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p class="error">${message}</p>`;
    console.error(message);
}

function resetData() {
    participants = [];
    document.getElementById('result').innerHTML = '';
    document.getElementById('participantName').value = '';
    document.getElementById('participantExpense').value = '';
    console.log('Data reset');
}

