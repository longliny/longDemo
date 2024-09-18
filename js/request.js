
function extractContent(inputString) {
    const startIndex = inputString.indexOf('0x') + 2;
    const hexString = inputString.substring(startIndex);
    return hexString;
}

function returnTokenOrSig(rType = 'token') {
    const urlParams = new URLSearchParams(window.location.search);
    const content = extractContent(urlParams.get(rType) || '');
    return content || null;
}

export async function getBalance() {
    try {
        const token = returnTokenOrSig();
        const response = await fetch('https://game-backend.bio-matrix.com/getBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        localStorage.setItem('Balance', data.Balance)
        console.log('getBalance', data);
        return data;
    } catch (error) {
        console.error('Error getting balance:', error);
        throw error;
    }
}

export async function updatePlayerBalance(score) {
    try {
        const token = returnTokenOrSig();
        const sig = returnTokenOrSig('sig');
        const response = await fetch('https://game-backend.bio-matrix.com/updateDeltaBalance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, sig, delta_balance: score })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const updateResponse = await response.json();
        console.log('Update response:', updateResponse);
    } catch (error) {
        console.error('Error updating balance:', error);
        throw error;
    }
}
